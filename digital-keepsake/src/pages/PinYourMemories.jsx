import { useMemo, useState } from 'react'
import { ArrowRight, Heart, LoaderCircle, Pin, Send, Sparkles } from 'lucide-react'
import { createMemory } from '../services/memoryService'

const initialForm = {
  senderName: '',
  message: '',
}

function PinYourMemories({ navigateToWall }) {
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  const helperText = useMemo(() => {
    if (isSubmitting) return 'Finding a clean spot on the wall...'
    if (status.message) return status.message
    return 'Keep it kind enough for the wall, spicy enough for the batch.'
  }, [isSubmitting, status.message])

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
      const createdMemory = await createMemory(form)
      sessionStorage.setItem('latest-pinned-memory', JSON.stringify(createdMemory))
      setForm(initialForm)
      setStatus({ type: 'success', message: 'Pinned. Opening the wall now...' })
      window.setTimeout(() => navigateToWall(), 450)
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

      <section className="pin-layout pin-form-layout">
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

        <section className="pin-wall-preview reveal" aria-label="Memories wall preview">
          <div className="preview-note preview-one">
            <Pin size={21} />
            <p>Posted notes now live on the Farewell Wall.</p>
          </div>
          <div className="preview-note preview-two">
            <Sparkles size={21} />
            <p>Your note joins the batch board right after pinning.</p>
          </div>
          <a className="wall-write-link" href="/wall" onClick={(event) => navigateToWall(event)}>
            Open Wall
            <ArrowRight size={18} />
          </a>
        </section>
      </section>
    </main>
  )
}

export default PinYourMemories
