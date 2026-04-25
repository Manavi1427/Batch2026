import { useEffect, useState } from 'react'
import { ArrowRight, Edit3, LoaderCircle, Pin, RefreshCw, Sparkles } from 'lucide-react'
import { fetchMemories } from '../services/memoryService'

const noteStyles = [
  { color: 'wall-pink', rotation: '-1.5deg', font: 'hand' },
  { color: 'wall-blue', rotation: '2deg', font: 'hand' },
  { color: 'wall-lavender', rotation: '-1deg', font: 'marker' },
  { color: 'wall-paper', rotation: '-2.2deg', font: 'hand' },
  { color: 'wall-rose', rotation: '0.8deg', font: 'caveat' },
  { color: 'wall-purple', rotation: '1.7deg', font: 'hand' },
]

function formatWallDate(value) {
  if (!value) return 'Just now'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
  }).format(new Date(value))
}

function MemoriesWall({ navigateToPinMemories }) {
  const [memories, setMemories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadMemories()
  }, [])

  async function loadMemories() {
    try {
      setIsLoading(true)
      setError('')
      const fetchedMemories = await fetchMemories()
      const latestPinnedMemory = getLatestPinnedMemory()
      const mergedMemories = latestPinnedMemory
        ? [latestPinnedMemory, ...fetchedMemories.filter((memory) => memory.$id !== latestPinnedMemory.$id)]
        : fetchedMemories

      setMemories(mergedMemories)
    } catch (fetchError) {
      const latestPinnedMemory = getLatestPinnedMemory()

      if (latestPinnedMemory) {
        setMemories([latestPinnedMemory])
        setError('')
        return
      }

      setError(
        fetchError?.message
          ? `Could not load the wall: ${fetchError.message}`
          : 'Could not load the wall right now.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main id="top" className="wall-page">
      <div className="wall-texture" aria-hidden="true" />
      <span className="wall-glow wall-glow-one" aria-hidden="true" />
      <span className="wall-glow wall-glow-two" aria-hidden="true" />

      <header className="wall-page-header reveal">
        <div className="eyebrow">
          <Sparkles size={16} />
          Class of 2024 Notes
        </div>
        <h1>
          The Farewell <span>Wall</span>
        </h1>
        <p>Every posted note lands here as a tiny scrap of batch lore, chaos, gratitude, and things we will pretend not to miss.</p>
      </header>

      <section className="wall-toolbar reveal" aria-label="Wall actions">
        <button className="refresh-button wall-refresh" disabled={isLoading} onClick={loadMemories} type="button">
          {isLoading ? <LoaderCircle className="spin" size={18} /> : <RefreshCw size={18} />}
          Refresh Wall
        </button>
        <a className="wall-write-link" href="/pin-your-memories" onClick={navigateToPinMemories}>
          Add a Note
          <ArrowRight size={18} />
        </a>
      </section>

      {isLoading ? (
        <section className="wall-state reveal">
          <LoaderCircle className="spin" size={28} />
          Loading pinned notes...
        </section>
      ) : error ? (
        <section className="wall-state error reveal">{error}</section>
      ) : memories.length ? (
        <section className="posted-wall-grid" aria-label="Pinned memories">
          {memories.map((memory, index) => {
            const style = noteStyles[index % noteStyles.length]

            return (
              <article
                className={`posted-note ${style.color} ${style.font}`}
                key={memory.$id}
                style={{ '--note-rotation': style.rotation, '--delay': `${Math.min(index, 14) * 55}ms` }}
              >
                <div className="posted-note-top">
                  <Pin size={23} />
                  <time dateTime={memory.createdAt || memory.$createdAt}>{formatWallDate(memory.createdAt || memory.$createdAt)}</time>
                </div>
                <p>{memory.message}</p>
                <strong>- {memory.senderName}</strong>
              </article>
            )
          })}

          <a className="posted-note add-note-card" href="/pin-your-memories" onClick={navigateToPinMemories}>
            <span>
              <Edit3 size={30} />
            </span>
            <strong>Add a Note</strong>
            <p>Share your final message</p>
          </a>
        </section>
      ) : (
        <section className="wall-state empty reveal">
          <strong>No memories pinned yet. Be the first menace.</strong>
          <a href="/pin-your-memories" onClick={navigateToPinMemories}>
            Pin the first note
          </a>
        </section>
      )}

      <a className="wall-floating-action" href="/pin-your-memories" onClick={navigateToPinMemories} aria-label="Add a note">
        <Edit3 size={28} />
      </a>
    </main>
  )
}

function getLatestPinnedMemory() {
  try {
    const rawMemory = sessionStorage.getItem('latest-pinned-memory')
    return rawMemory ? JSON.parse(rawMemory) : null
  } catch {
    return null
  }
}

export default MemoriesWall
