import { ArrowRight, ImagePlus, Sparkles } from 'lucide-react'
import UploadPhoto from '../components/UploadPhoto'

function UploadMoment({ navigateToGallery }) {
  function handlePhotoAdded() {
    window.setTimeout(() => navigateToGallery(), 450)
  }

  return (
    <main id="top" className="gallery-page upload-moment-page">
      <section className="gallery-hero reveal">
        <div className="eyebrow">
          <Sparkles size={16} />
          Add to the Photo Vault
        </div>
        <h1>
          Add a <span>Moment</span>
        </h1>
        <p>Upload one photo for the batch scrapbook. After it lands safely, the gallery opens with the newest moments first.</p>
      </section>

      <section className="upload-moment-layout">
        <UploadPhoto onPhotoAdded={handlePhotoAdded} />

        <section className="pin-wall-preview upload-gallery-preview reveal" aria-label="Gallery preview">
          <div className="preview-note preview-one">
            <ImagePlus size={21} />
            <p>Your photo joins the batch gallery after uploading.</p>
          </div>
          <div className="preview-note preview-two">
            <Sparkles size={21} />
            <p>The gallery keeps every uploaded moment in latest-first order.</p>
          </div>
          <a className="wall-write-link" href="/gallery" onClick={navigateToGallery}>
            Open Gallery
            <ArrowRight size={18} />
          </a>
        </section>
      </section>
    </main>
  )
}

export default UploadMoment
