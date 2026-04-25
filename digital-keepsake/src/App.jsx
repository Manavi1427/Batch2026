import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Camera,
  Clock3,
  GraduationCap,
  Heart,
  History,
  Menu,
  Moon,
  PartyPopper,
  Sparkles,
  Star,
  Sun,
  Trophy,
  UsersRound,
  X,
  Zap,
} from 'lucide-react'
import './App.css'

const navItems = ['Memories', 'Yearbook', 'Messages', 'Wall', 'Gallery']
const fallbackImage = '/images/shared/image-placeholder.svg'
const pageImages = {
  home: {
    featuredStudy: '/images/home/featured-study.jpg',
    featuredCelebration: '/images/home/featured-celebration.jpg',
  },
  yearbook: {
    marcusLee: '/images/yearbook/marcus-lee.jpg',
    elenaVance: '/images/yearbook/elena-vance.jpg',
    chloeDubois: '/images/yearbook/chloe-dubois.jpg',
    davidChen: '/images/yearbook/david-chen.jpg',
  },
}

const homeMemories = [
  {
    icon: Camera,
    title: 'Memory Vault',
    text: 'Photos, notes, class moments, and the tiny in-between stories that made PSCS 2024 feel like home.',
  },
  {
    icon: BookOpen,
    title: 'Batch Stories',
    text: 'A soft archive of late submissions, canteen debates, farewell laughs, and friendships that stayed.',
  },
  {
    icon: GraduationCap,
    title: 'Forever 2024',
    text: 'A keepsake for the batch, built to revisit whenever nostalgia decides to tap on the shoulder.',
  },
]

const superlatives = [
  {
    name: 'Marcus "Snooze" Lee',
    award: 'Most Likely to Sleep Through a Final',
    quote: "I don't fail exams, I just dream about the answers from home.",
    image: pageImages.yearbook.marcusLee,
    alt: 'Portrait of a young man with a sleepy expression',
    icon: Moon,
    color: 'cyan',
    rotate: '-1.2deg',
  },
  {
    name: 'Elena Vance',
    award: 'The Professional Procrastinator',
    quote: 'Diamonds are made under pressure, and so are my 2,000-word essays.',
    image: pageImages.yearbook.elenaVance,
    alt: 'Young woman with glasses looking at a laptop',
    icon: Clock3,
    color: 'pink',
    rotate: '1.5deg',
  },
  {
    name: 'Chloe Dubois',
    award: 'Main Character Energy',
    quote: "I'm not dramatic, I just live in a high-budget indie film.",
    image: pageImages.yearbook.chloeDubois,
    alt: 'Stylish young woman walking confidently',
    icon: Zap,
    color: 'purple',
    rotate: '-0.8deg',
  },
  {
    name: 'David Chen',
    award: 'Most Likely to be CEO',
    quote: "I've already scheduled my mid-life crisis for next Tuesday at 3 PM.",
    image: pageImages.yearbook.davidChen,
    alt: 'Young man smiling confidently',
    icon: Trophy,
    color: 'cyan',
    rotate: '1.2deg',
  },
]

const featureCards = [
  {
    title: 'The Hand-Penned Vault',
    text: 'Every award is nominated and voted by the class of 2024. These are the legends that defined our four years.',
    icon: History,
    tone: 'neutral',
  },
  {
    title: 'Alumni Network',
    text: 'Find where your favorite legends ended up after graduation in our interactive alumni directory.',
    icon: UsersRound,
    tone: 'cyan',
  },
  {
    title: 'Farewell Bash',
    text: "Don't miss the final send-off! Check the wall for details on the end-of-year gala.",
    icon: PartyPopper,
    tone: 'purple',
  },
]

function ImageWithFallback({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      onError={(event) => {
        event.currentTarget.onerror = null
        event.currentTarget.src = fallbackImage
      }}
    />
  )
}

function App() {
  const getRoute = () => (window.location.hash === '#/yearbook' ? 'yearbook' : 'home')
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('keepsake-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return savedTheme ? savedTheme === 'dark' : prefersDark
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [route, setRoute] = useState(getRoute)
  const carouselRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('keepsake-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    if (!window.location.hash) window.history.replaceState(null, '', '#/')

    const handleHashChange = () => {
      setRoute(getRoute())
      setMenuOpen(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    const revealItems = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible')
        })
      },
      { threshold: 0.14 },
    )

    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [route])

  const handleSectionNav = (event, item) => {
    if (item === 'Yearbook') return

    if (route !== 'home') {
      event.preventDefault()
      const sectionId = item.toLowerCase()
      window.history.pushState(null, '', '#/')
      setRoute('home')
      setMenuOpen(false)
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    }
  }

  const scrollCarousel = (direction) => {
    const track = carouselRef.current
    if (!track) return

    const cardWidth = track.querySelector('.yearbook-card-shell')?.clientWidth ?? 360
    track.scrollBy({
      left: direction * (cardWidth + 32),
      behavior: 'smooth',
    })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#/" aria-label="The Digital Keepsake home">
          The Digital Keepsake
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              className={item === 'Yearbook' && route === 'yearbook' ? 'active' : ''}
              key={item}
              href={item === 'Yearbook' ? '#/yearbook' : `#${item.toLowerCase()}`}
              onClick={(event) => handleSectionNav(event, item)}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setDarkMode((value) => !value)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span>{darkMode ? <Moon size={16} /> : <Sun size={16} />}</span>
          </button>
          <button className="icon-button hide-small" type="button" aria-label="Featured moments">
            <Sparkles size={20} />
          </button>
          <button className="icon-button hide-small" type="button" aria-label="Favorite memories">
            <Heart size={20} fill="currentColor" />
          </button>
          <a className="add-button" href={route === 'home' ? '#messages' : '#/'}>
            Add Moment
          </a>
          <button
            className="icon-button menu-button"
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a
              key={item}
              href={item === 'Yearbook' ? '#/yearbook' : `#${item.toLowerCase()}`}
              onClick={(event) => {
                setMenuOpen(false)
                handleSectionNav(event, item)
              }}
            >
              {item}
            </a>
          ))}
        </nav>
      )}

      {route === 'yearbook' ? <YearbookPage carouselRef={carouselRef} scrollCarousel={scrollCarousel} /> : <HomePage />}

      <footer id="gallery">
        <strong>The Digital Keepsake</strong>
        <div className="footer-links">
          <a href="#memories">The Vault</a>
          <a href="#/yearbook">Alumni Directory</a>
          <a href="#messages">Lost &amp; Found</a>
          <a href="#top">Farewell Letter</a>
        </div>
        <div className="footer-rule" />
        <p>© 2024 Class of 2024. Hand-penned with love and nostalgia.</p>
      </footer>
    </div>
  )
}

function HomePage() {
  return (
    <main id="top" className="home-page">
      <section className="home-hero reveal">
        <div className="home-copy">
          <div className="eyebrow">
            <Sparkles size={16} />
            PSCS Batch 2024
          </div>
          <h1>
            The Digital <span>Keepsake</span>
          </h1>
          <p>One warm scrapbook for every photo, note, inside joke, farewell message, and unforgettable batch moment.</p>
          <div className="hero-actions">
            <a className="primary-link" href="#memories">
              Explore Memories <ArrowRight size={22} />
            </a>
            <a className="secondary-link" href="#/yearbook">
              Open Yearbook
            </a>
          </div>
        </div>

        <div className="home-stack" aria-label="Featured memories">
          <article className="stack-card stack-one">
            <ImageWithFallback src={pageImages.home.featuredStudy} alt="Students studying together" />
          </article>
          <article className="stack-card stack-two">
            <ImageWithFallback src={pageImages.home.featuredCelebration} alt="Graduates celebrating" />
          </article>
        </div>
      </section>

      <section className="home-memory-section" id="memories">
        <div className="section-heading reveal">
          <span>Memory Shelf</span>
          <h2>Everything that made these four years ours.</h2>
        </div>
        <div className="home-memory-grid">
          {homeMemories.map(({ icon, title, text }, index) => {
            const MemoryIcon = icon

            return (
              <article className="home-memory-card reveal" key={title} style={{ '--delay': `${index * 100}ms` }}>
                <MemoryIcon size={28} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="home-message-band reveal" id="messages">
        <h2>Leave a note for the batch wall.</h2>
        <a href="#wall">Pin a Memory</a>
      </section>

      <section className="home-wall" id="wall">
        <div className="wall-note reveal">
          <Heart size={24} />
          <p>Some friendships do not need perfect attendance. They just need one remembered laugh.</p>
        </div>
      </section>
    </main>
  )
}

function YearbookPage({ carouselRef, scrollCarousel }) {
  return (
    <main id="top" className="yearbook-page">
      <section className="yearbook-hero reveal" id="yearbook">
        <div className="eyebrow">
          <Star size={16} fill="currentColor" />
          Class of 2024 Superlatives
        </div>
        <h1>
          The Hall of <span>Fame &amp; Funny</span>
        </h1>
        <p>Celebrating the unique quirks and legendary personalities that made this year unforgettable.</p>
      </section>

      <section className="carousel-section" aria-label="Yearbook superlatives">
        <div className="carousel-controls reveal">
          <button type="button" onClick={() => scrollCarousel(-1)} aria-label="Previous superlative">
            <ArrowLeft size={22} />
          </button>
          <button type="button" onClick={() => scrollCarousel(1)} aria-label="Next superlative">
            <ArrowRight size={22} />
          </button>
        </div>

        <div className="yearbook-track" ref={carouselRef}>
          {superlatives.map(({ name, award, quote, image, alt, icon, color, rotate }, index) => {
            const AwardIcon = icon

            return (
              <article
                className="yearbook-card-shell reveal"
                key={name}
                style={{ '--rotate': rotate, '--delay': `${index * 90}ms` }}
              >
                <div className="yearbook-card">
                  <div className={`award-badge ${color}`}>
                    <AwardIcon size={30} />
                  </div>
                  <div className="portrait">
                    <ImageWithFallback src={image} alt={alt} />
                  </div>
                  <h2>{name}</h2>
                  <strong>{award}</strong>
                  <p>"{quote}"</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="feature-grid" id="messages">
        {featureCards.map(({ title, text, icon, tone }, index) => {
          const FeatureIcon = icon

          return (
            <article className={`feature-card ${tone} reveal`} key={title} style={{ '--delay': `${index * 110}ms` }}>
              <FeatureIcon size={34} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          )
        })}
      </section>
    </main>
  )
}

export default App
