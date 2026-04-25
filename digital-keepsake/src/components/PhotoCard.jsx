const rotations = [-2.5, 1.8, -1.2, 2.7, -0.7, 1.1, -3, 2.2]

function formatPhotoDate(value) {
  if (!value) return 'Just now'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
  }).format(new Date(value))
}

function PhotoCard({ photo, index }) {
  const rotation = rotations[index % rotations.length]

  return (
    <article className="photo-card" style={{ '--photo-rotation': `${rotation}deg`, '--delay': `${Math.min(index, 14) * 55}ms` }}>
      <div className="photo-card-image">
        <img src={photo.imageUrl} alt={`Memory uploaded by ${photo.senderName}`} loading="lazy" />
      </div>
      {photo.note ? <p>{photo.note}</p> : null}
      <div className="photo-card-meta">
        <strong>- {photo.senderName}</strong>
        <time dateTime={photo.createdAt || photo.$createdAt}>{formatPhotoDate(photo.createdAt || photo.$createdAt)}</time>
      </div>
    </article>
  )
}

export default PhotoCard
