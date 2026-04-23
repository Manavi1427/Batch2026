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
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBjwnPVGwfcb2jitB_yUdG_5Swy99BVEXxCF8n6E3pHtyAl4ZYFajID5mp0rdqRu-Eh7XdrODd03n4jdTdS402INjBZBF3PNPpfNTuk3grUBfzuOxOOaE0hqUz1e30eNTNL4h5uR8wX85QogjHokmHOBhbGssvaaK8hgpytoqdf4YtDxQJm8qrI1mvaJVLWKSsgGi1gS2kE9uhJsPIV6odLka8TTWQyKBQRGS6H8wHqhMY9ayYJZvb4_AkTeOV7FZJwiP7DFmpxEY8',
    alt: 'Portrait of a young man with a sleepy expression',
    icon: Moon,
    color: 'cyan',
    rotate: '-1.2deg',
  },
  {
    name: 'Elena Vance',
    award: 'The Professional Procrastinator',
    quote: 'Diamonds are made under pressure, and so are my 2,000-word essays.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCpAf6yizuUkWFYD7W6L4In_BSl0BJVpUgPJOkm8Dgd9KZ2TU1CkqZTglfmZd_U1FABlOKKVAJCvDHxLo9dFZNbMuq0M8c32PK5LnOMHBJ-9Tl23o77g4IqGQ19N13k80h0y_HSloOuF7tN0JULjyKRFvstV7aFO92CSlrRrDTO1SKAt-gmJv2qS-TSbOK7aDRtuN9RUbyu6UDGDSGvhf4wJ2ektws_xXRMus6QS8scTiljXFn1ng-4aDPEpHhqy12iwFTDM2vvW7I',
    alt: 'Young woman with glasses looking at a laptop',
    icon: Clock3,
    color: 'pink',
    rotate: '1.5deg',
  },
  {
    name: 'Chloe Dubois',
    award: 'Main Character Energy',
    quote: "I'm not dramatic, I just live in a high-budget indie film.",
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBDREK8OsosekzYWWC1l2fwp1E-l5iKbe7wA21gz8uNP-PHCKbmHGAbqOGKyLLRzWHxVraj26cD1cIzEKNVVtPKktSnOcnUfsz6_oo3UQCeoFJh87qZUMzypZrk8HeKPuvTtm1vOKvrw83p34DHT34p_fsa87cEl2IMtaRLrAO5I7ifUWlw-xQrgCNBU-nP1VNS3dmXDXWiTKEa1t__yhoXblQiwbmF57yEQOx9fI2fghfg75fLJGcr7-o4i7nOox_O8Bplrm24e4A',
    alt: 'Stylish young woman walking confidently',
    icon: Zap,
    color: 'purple',
    rotate: '-0.8deg',
  },
  {
    name: 'David Chen',
    award: 'Most Likely to be CEO',
    quote: "I've already scheduled my mid-life crisis for next Tuesday at 3 PM.",
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCaFSjpJFfz8y43cz2mjBZkoZ2zMbfrhKzvDg3sFgYeQTxh7h5_pHh-6h9kyqNT1DHRi0LwRlrso_Pd9PIUPGK_S-QSfdtjdSeOT-S0J44lFFELa9rLt5fRRznaoAqZI9alUChtlr4EmM9tiSC6uilI2znM3UGoKIV80SlRPM-Le5c4R0zVL-aw8_-o5vmoMZbsz0t2RMW6kaGhIqC17D5le94rk5ydOZuxb2ajOTyUiL8bEb6YEVARFk-b6g7Rm5_pHAimvaXIgAQ',
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
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBmm8EFaTalwMWe-aA7RT7zd1fviWJVzmnfg_UT6eAOSf2OjyBgEr483k6lyp3NJ5lDopLe2RnsTOkffzyBluCmFnghJ1O7hL-yAfKl9xQ-YnUQRGBIM9ZFrl_tA_Zj77hxwPZE3DMRfCm320oWNt8MOt2Cksc71O0QcMDpRzgGg36C7albLJFyuy3hXFxAVFkrdXxeHx92lOUWKsboe8ZJ-f72aCM1QOekVrvYCaZIgCmm8wZjOnhg3YBfBizxZCpIcnArtEosg8"
              alt="Students studying together"
            />
          </article>
          <article className="stack-card stack-two">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuByESndx6TwM8rfrKKjnibZZmL77-TaNI5zETELUp4akwKbevuJvHgeUvsMX4rpQKymjLONDEKW84-Bwm2CxgIiKdKwcDNOGR6vGM0a9FGmuS9FPeIjFoAg87yS-lGaiYLjtDEE1Velj_VPJnQskYtjMj4gOIQotkXDI2iWkSbDW7h5Ff2nlb8oqS87RWidW0tyGyqjgeJXguEcfXKuKawF_l7VBzPQxn4H2EbHpCjRZ5gqpcZa7JBK5LsKaoXJcp9STERsi767_mk"
              alt="Graduates celebrating"
            />
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
                    <img src={image} alt={alt} />
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
