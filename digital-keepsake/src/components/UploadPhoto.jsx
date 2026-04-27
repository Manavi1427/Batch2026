import { useEffect, useRef, useState } from 'react'
import { ImagePlus, LoaderCircle, Upload } from 'lucide-react'
import { createGalleryEntry, uploadImage } from '../services/galleryService'

const maxOriginalFileSize = 25 * 1024 * 1024
const maxUploadFileSize = 4.5 * 1024 * 1024
const maxImageDimension = 1800
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

function UploadPhoto({ onPhotoAdded }) {
  const [identity] = useState(() => readSavedIdentity())
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [note, setNote] = useState('')
  const [isPreparing, setIsPreparing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  const fileInputRef = useRef(null)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  async function handleFileChange(event) {
    const selectedFile = event.target.files?.[0]

    setStatus({ type: '', message: '' })
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl('')

    if (!selectedFile) return

    if (!isAllowedImage(selectedFile)) {
      setStatus({ type: 'error', message: 'Please choose an image file.' })
      resetFileInput()
      return
    }

    if (selectedFile.size > maxOriginalFileSize) {
      setStatus({ type: 'error', message: 'Please choose an image under 25MB.' })
      resetFileInput()
      return
    }

    try {
      setIsPreparing(true)
      setStatus({ type: 'neutral', message: 'Preparing photo for upload...' })

      const uploadFile = await prepareImageForUpload(selectedFile)

      if (uploadFile.size > maxUploadFileSize) {
        setStatus({ type: 'error', message: 'This photo is still too large. Try a smaller image or screenshot version.' })
        resetFileInput()
        return
      }

      setFile(uploadFile)
      setPreviewUrl(URL.createObjectURL(uploadFile))
      setStatus({ type: 'success', message: 'Photo ready to upload.' })
    } catch {
      setStatus({ type: 'error', message: 'This image format could not be prepared. Try a JPG, PNG, or screenshot.' })
      resetFileInput()
    } finally {
      setIsPreparing(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!identity) {
      setStatus({ type: 'error', message: 'Please add a memory first to set your identity' })
      return
    }

    if (!file) {
      setStatus({ type: 'error', message: 'Please choose a photo before uploading.' })
      return
    }

    try {
      setIsUploading(true)
      setStatus({ type: '', message: '' })

      const uploadedImage = await uploadImage(file)
      const galleryEntry = await createGalleryEntry({
        senderName: identity.senderName,
        senderEmail: identity.senderEmail,
        imageUrl: uploadedImage.imageUrl,
        note,
      })

      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setFile(null)
      setPreviewUrl('')
      setNote('')
      resetFileInput()
      setStatus({ type: 'success', message: 'Photo added to the wall' })
      onPhotoAdded?.(galleryEntry)
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.message || 'Could not upload the photo. Please try again.',
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (!identity) {
    return (
      <section className="upload-photo-card reveal">
        <ImagePlus size={32} />
        <h2>Add a Photo</h2>
        <p className="upload-photo-empty">Please add a memory first to set your identity</p>
      </section>
    )
  }

  return (
    <form className="upload-photo-card reveal" onSubmit={handleSubmit}>
      <div className="upload-photo-heading">
        <ImagePlus size={30} />
        <div>
          <h2>Add a Photo</h2>
          <p>Posting as {identity.senderName}</p>
        </div>
      </div>

      <label>
        Sender Name
        <input readOnly type="text" value={identity.senderName} />
      </label>

      <label>
        Sender Email
        <input readOnly type="email" value={identity.senderEmail} />
      </label>

      <label>
        Photo
        <input
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          disabled={isPreparing || isUploading}
          onChange={handleFileChange}
          ref={fileInputRef}
          required
          type="file"
        />
      </label>

      {previewUrl ? (
        <div className="photo-preview">
          <img src={previewUrl} alt="Selected upload preview" />
        </div>
      ) : null}

      <label>
        Note
        <textarea
          maxLength={500}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Optional caption, memory, or suspicious context..."
          rows={4}
          value={note}
        />
      </label>

      <button className="pin-submit" disabled={isPreparing || isUploading} type="submit">
        {isPreparing || isUploading ? <LoaderCircle className="spin" size={21} /> : <Upload size={21} />}
        {isPreparing ? 'Preparing Photo' : isUploading ? 'Uploading Photo' : 'Upload Photo'}
      </button>

      <p className={`form-status ${status.type || 'neutral'}`} role={status.type === 'error' ? 'alert' : 'status'}>
        {status.message || 'Phone photos are resized automatically before upload.'}
      </p>
    </form>
  )

  function resetFileInput() {
    if (fileInputRef.current) fileInputRef.current.value = ''
  }
}

function isAllowedImage(file) {
  if (allowedImageTypes.includes(file.type)) return true
  return /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name)
}

async function prepareImageForUpload(file) {
  if (file.size <= maxUploadFileSize && file.type !== 'image/heic' && file.type !== 'image/heif') {
    return file
  }

  const image = await loadImage(file)
  const scale = Math.min(1, maxImageDimension / Math.max(image.naturalWidth, image.naturalHeight))
  const width = Math.max(1, Math.round(image.naturalWidth * scale))
  const height = Math.max(1, Math.round(image.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) throw new Error('Canvas is not available.')

  canvas.width = width
  canvas.height = height
  context.drawImage(image, 0, 0, width, height)

  const blob = await canvasToBlob(canvas, 'image/jpeg', 0.82)

  if (!blob) throw new Error('Image compression failed.')

  return new File([blob], replaceImageExtension(file.name), {
    type: 'image/jpeg',
    lastModified: Date.now(),
  })
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Image could not be loaded.'))
    }
    image.src = url
  })
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality)
  })
}

function replaceImageExtension(fileName) {
  const baseName = fileName.replace(/\.[^.]+$/, '')
  return `${baseName || 'photo'}.jpg`
}

function readSavedIdentity() {
  try {
    const rawIdentity = localStorage.getItem('farewellUser')
    if (!rawIdentity) return null

    const user = JSON.parse(rawIdentity)
    if (!user?.senderName || !user?.senderEmail) return null

    return {
      senderName: user.senderName,
      senderEmail: user.senderEmail,
    }
  } catch {
    return null
  }
}

export default UploadPhoto
