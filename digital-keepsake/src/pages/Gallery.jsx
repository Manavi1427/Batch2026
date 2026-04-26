import { useEffect, useState } from 'react'
import { Camera, ImagePlus, LoaderCircle, RefreshCw, Sparkles } from 'lucide-react'
import PhotoCard from '../components/PhotoCard'
import { fetchGalleryImages } from '../services/galleryService'

function Gallery({ navigateToAddMoment }) {
  const [photos, setPhotos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPhotos()
  }, [])

  async function loadPhotos() {
    try {
      setIsLoading(true)
      setError('')
      setPhotos(await fetchGalleryImages())
    } catch (fetchError) {
      setError(fetchError?.message ? `Could not load the gallery: ${fetchError.message}` : 'Could not load the gallery right now.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main id="top" className="gallery-page">
      <section className="gallery-hero reveal">
        <div className="eyebrow">
          <Sparkles size={16} />
          Photo Vault
        </div>
        <h1>
          Batch <span>Gallery</span>
        </h1>
        <p>Browse the uploaded photo moments that deserve a permanent spot in the scrapbook, from blurry chaos to graduation glow-ups.</p>
      </section>

      <section className="gallery-layout gallery-only-layout">
        <section className="gallery-board reveal" aria-live="polite">
          <div className="gallery-board-heading">
            <div>
              <span>Latest first</span>
              <h2>Photo Collage</h2>
            </div>
            <div className="gallery-board-actions">
              <a className="wall-write-link" href="/add-moment" onClick={navigateToAddMoment}>
                <ImagePlus size={18} />
                Add Moment
              </a>
              <button className="refresh-button" disabled={isLoading} onClick={loadPhotos} type="button">
                {isLoading ? <LoaderCircle className="spin" size={18} /> : <RefreshCw size={18} />}
                Refresh
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="gallery-state">
              <LoaderCircle className="spin" size={28} />
              Loading photos...
            </div>
          ) : error ? (
            <div className="gallery-state error">{error}</div>
          ) : photos.length ? (
            <div className="photo-grid">
              {photos.map((photo, index) => (
                <PhotoCard index={index} key={photo.$id} photo={photo} />
              ))}
            </div>
          ) : (
            <div className="gallery-state empty">
              <Camera size={32} />
              No photos yet. Start the nostalgia.
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default Gallery
