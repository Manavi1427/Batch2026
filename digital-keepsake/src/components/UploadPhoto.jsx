import { useEffect, useState } from 'react'
import { ImagePlus, LoaderCircle, Upload } from 'lucide-react'
import { createGalleryEntry, uploadImage } from '../services/galleryService'

const maxFileSize = 5 * 1024 * 1024

function UploadPhoto({ onPhotoAdded }) {
  const [identity] = useState(() => readSavedIdentity())
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [note, setNote] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0]

    setStatus({ type: '', message: '' })
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl('')

    if (!selectedFile) return

    if (!selectedFile.type.startsWith('image/')) {
      setStatus({ type: 'error', message: 'Please choose an image file.' })
      return
    }

    if (selectedFile.size > maxFileSize) {
      setStatus({ type: 'error', message: 'Please choose an image under 5MB.' })
      return
    }

    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
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
        <input accept="image/*" onChange={handleFileChange} required type="file" />
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

      <button className="pin-submit" disabled={isUploading} type="submit">
        {isUploading ? <LoaderCircle className="spin" size={21} /> : <Upload size={21} />}
        Upload Photo
      </button>

      <p className={`form-status ${status.type || 'neutral'}`} role={status.type === 'error' ? 'alert' : 'status'}>
        {status.message || 'Images only, up to 5MB.'}
      </p>
    </form>
  )
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
