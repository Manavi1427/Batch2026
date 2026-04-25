import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Heart, LoaderCircle, Pin, Send, Sparkles } from 'lucide-react'
import { createMemory, fetchMemories } from '../services/memoryService'

const initialForm = {
  senderName: '',
  message: '',
}

const noteColors = ['pink', 'blue', 'purple', 'mint', 'peach', 'lemon']
const noteRotations = ['-1.4deg', '1.1deg', '-0.7deg', '1.5deg', '-1deg', '0.8deg']

function formatMemoryDate(value) {
  if (!value) return 'Just now'

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function PinYourMemories() {
  const [form, setForm] = useState(initialForm)
  const [memories, setMemories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  const hasMemories = memories.length > 0

  const helperText = useMemo(() => {
    if (isSubmitting) return 'Finding a clean spot on the wall...'
    if (status.message) return status.message
    return 'Keep it kind enough for the wall, spicy enough for the batch.'
  }, [isSubmitting, status.message])

  useEffect(() => {
    loadMemories()
  }, [])

  async function loadMemories() {
    try {
      setIsLoading(true)
      const fetchedMemories = await fetchMemories()
      setMemories(fetchedMemories)
      setStatus((current) => (current.type === 'error' ? { type: '', message: '' } : current))
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.message || 'Could not load the memories wall right now. Try refreshing in a bit.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.senderName.trim() || !form.message.trim()) {
      setStatus({ type: 'error', message: 'Your name and memory are required before pinning.' })
      return
    }

    try {
      setIsSubmitting(true)
      setStatus({ type: '', message: '' })
      await createMemory(form)
      setForm(initialForm)
      setStatus({ type: 'success', message: 'Pinned. The wall just got a little more legendary.' })
      await loadMemories()
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.message || 'The memory refused to pin itself. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main id="top" className="pin-page">
      <section className="pin-hero reveal">
        <div className="pin-hero-copy">
          <div className="eyebrow">
            <Sparkles size={16} />
            Public Memories Wall
          </div>
          <h1>Pin Your Memories</h1>
          <p>Write something sweet, funny, chaotic, or suspiciously emotional for someone from the batch.</p>
        </div>
        <div className="pin-floating-note" aria-hidden="true">
          <Pin size={22} />
          <span>Batch lore belongs here.</span>
        </div>
      </section>

      <section className="pin-layout">
        <form className="memory-form reveal" onSubmit={handleSubmit}>
          <div className="form-heading">
            <Heart size={22} fill="currentColor" />
            <h2>Leave a Note</h2>
          </div>

          <label>
            Your Name
            <input
              maxLength={100}
              name="senderName"
              onChange={updateField}
              placeholder="The brave sender"
              type="text"
              value={form.senderName}
            />
          </label>

          <label>
            Memory Message
            <textarea
              maxLength={1000}
              name="message"
              onChange={updateField}
              placeholder="Drop the memory, confession, inside joke, or emotional damage here."
              rows={7}
              value={form.message}
            />
          </label>

          <button className="pin-submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? <LoaderCircle className="spin" size={21} /> : <Send size={21} />}
            Pin Memory
          </button>

          <p className={`form-status ${status.type || 'neutral'}`} role={status.type === 'error' ? 'alert' : 'status'}>
            {helperText}
          </p>
        </form>

        <section className="memories-wall reveal" aria-live="polite">
          <div className="wall-heading">
            <div>
              <span>Latest first</span>
              <h2>Memories Wall</h2>
            </div>
            <button className="refresh-button" disabled={isLoading} onClick={loadMemories} type="button">
              Refresh
              <ArrowRight size={18} />
            </button>
          </div>

          {isLoading ? (
            <div className="wall-empty loading">
              <LoaderCircle className="spin" size={26} />
              Loading pinned memories...
            </div>
          ) : hasMemories ? (
            <div className="memory-note-grid">
              {memories.map((memory, index) => (
                <article
                  className={`memory-note ${noteColors[index % noteColors.length]}`}
                  key={memory.$id}
                  style={{ '--note-rotation': noteRotations[index % noteRotations.length], '--delay': `${index * 55}ms` }}
                >
                  <span className="note-pin" />
                  <p>{memory.message}</p>
                  <div className="note-meta">
                    <strong>from {memory.senderName}</strong>
                    <time dateTime={memory.createdAt}>{formatMemoryDate(memory.createdAt)}</time>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="wall-empty">No memories pinned yet. Be the first menace.</div>
          )}
        </section>
      </section>
    </main>
  )
}

export default PinYourMemories
