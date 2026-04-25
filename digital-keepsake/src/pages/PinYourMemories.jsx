import { useMemo, useState } from 'react'
import { ArrowRight, Heart, LoaderCircle, Pin, Send, Sparkles } from 'lucide-react'
import { createMemory } from '../services/memoryService'

const COLLEGE_EMAIL_DOMAIN = '@ddu.du.ac.in'

const initialForm = {
  senderName: '',
  senderEmail: '',
  message: '',
}

function PinYourMemories({ navigateToWall }) {
  const [savedIdentity, setSavedIdentity] = useState(() => readSavedIdentity())
  const [identityLocked, setIdentityLocked] = useState(() => Boolean(readSavedIdentity()))
  const [form, setForm] = useState(() => {
    const storedIdentity = readSavedIdentity()

    return storedIdentity
      ? {
          ...initialForm,
          senderName: storedIdentity.senderName,
          senderEmail: storedIdentity.senderEmail,
        }
      : initialForm
  })
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

    const senderName = form.senderName.trim()
    const senderEmail = form.senderEmail.trim().toLowerCase()
    const message = form.message.trim()

    if (!senderName || !message) {
      setStatus({ type: 'error', message: 'Your name and memory are required before pinning.' })
      return
    }

    if (!isValidEmail(senderEmail)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' })
      return
    }

    if (!senderEmail.endsWith(COLLEGE_EMAIL_DOMAIN)) {
      setStatus({ type: 'error', message: `Please use your college email ending with ${COLLEGE_EMAIL_DOMAIN}.` })
      return
    }

    const lastPostTime = Number(localStorage.getItem('lastMemoryPostTime'))

    if (lastPostTime && Date.now() - lastPostTime < 10000) {
      setStatus({ type: 'error', message: 'Wait a few seconds before posting again.' })
      return
    }

    try {
      setIsSubmitting(true)
      setStatus({ type: '', message: '' })
      const createdMemory = await createMemory({ senderName, senderEmail, message })
      const identity = { senderName, senderEmail }

      localStorage.setItem('farewellUser', JSON.stringify(identity))
      localStorage.setItem('lastMemoryPostTime', Date.now().toString())
      sessionStorage.setItem('latest-pinned-memory', JSON.stringify(createdMemory))
      setSavedIdentity(identity)
      setIdentityLocked(true)
      setForm({ senderName, senderEmail, message: '' })
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

          {savedIdentity && identityLocked ? (
            <div className="identity-card">
              <span>Posting as: {savedIdentity.senderName}</span>
            </div>
          ) : null}

          <label>
            Your Name
            <input
              maxLength={100}
              name="senderName"
              onChange={updateField}
              placeholder="The brave sender"
              readOnly={identityLocked}
              type="text"
              value={form.senderName}
            />
          </label>

          <label>
            Sender Email
            <input
              maxLength={160}
              name="senderEmail"
              onChange={updateField}
              placeholder={`you${COLLEGE_EMAIL_DOMAIN}`}
              readOnly={identityLocked}
              type="email"
              value={form.senderEmail}
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

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function readSavedIdentity() {
  try {
    const rawIdentity = localStorage.getItem('farewellUser')
    if (!rawIdentity) return null

    const parsedIdentity = JSON.parse(rawIdentity)
    if (!parsedIdentity?.senderName || !parsedIdentity?.senderEmail) return null

    return {
      senderName: parsedIdentity.senderName,
      senderEmail: parsedIdentity.senderEmail,
    }
  } catch {
    return null
  }
}

export default PinYourMemories
