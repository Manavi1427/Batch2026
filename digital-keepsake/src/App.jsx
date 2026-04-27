import { useEffect, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Camera,
  GraduationCap,
  Heart,
  History,
  Menu,
  Moon,
  PartyPopper,
  Sparkles,
  Star,
  Sun,
  X,
} from 'lucide-react'
import Gallery from './pages/Gallery'
import MemoriesWall from './pages/MemoriesWall'
import PinYourMemories from './pages/PinYourMemories'
import UploadMoment from './pages/UploadMoment'
import './App.css'

const navItems = ['Memories', 'Yearbook', 'Messages', 'Wall', 'Gallery']
const fallbackImage = '/images/shared/image-placeholder.svg'
const pageImages = {
  home: {
    featuredStudy: '/images/home/featured-study.jpg',
    featuredCelebration: '/images/home/featured-celebration.jpg',
  },
  yearbook: {
    student: (number) => `/images/yearbook/student-${String(number).padStart(2, '0')}.jpg`,
  },
}

const homeMemories = [
  {
    icon: Camera,
    title: 'Memory Vault',
    text: 'Photos, notes, class moments, and the tiny in-between stories that made PSCS 2026 feel like home.',
  },
  {
    icon: BookOpen,
    title: 'Batch Stories',
    text: 'A soft archive of late submissions, canteen debates, farewell laughs, and friendships that stayed.',
  },
  {
    icon: GraduationCap,
    title: 'Forever 2026',
    text: 'A keepsake for the batch, built to revisit whenever nostalgia decides to tap on the shoulder.',
  },
]

const studentNames = [
  'Khushi Singh',
  'Vineet',
  'Yash Bhushan',
  'Midhuna Unnikrishnan',
  'Shyam',
  'Khushi Chaudhary',
  'Rahul Kumar',
  'Ravi Kumar',
  'Harsh',
  'Aryan Sharma',
  'Aditya Kumar',
  'Adarsh',
  'Rachna Lamba',
  'Aditya negi',
  'Mukul',
  'Lalit Sain',
  'Kirti Rathee',
  'Kanak Yadav',
  'Sukriti Singh',
  'Vishal Prasad',
  'Sumit',
  'Neha',
  'Gaurav Yadav',
  'Anjali Archana',
  'Aditya',
  'Student 26',
  'Student 27',
  'Student 28',
  'Student 29',
  'Student 30',
]
const yearbookQuotes = [
  'Gentle heart, determined mind.',
  'Every problem has a solution; I just found mine.',
  'When death finds you, may it find you alive.',
  'Had many ups and downs in this journey, but I wouldn’t trade it for anything—the people, lessons, and memories made it all worthwhile.',
  'China town chl lo',
  'Build yourself but dont forget to enjoy, having fun and make lots of memories.',
  '.....and in between freshers and farewell, life happened.',
  'Bhai mere ko game me rahna hai😅',
  'Four years, too many screenshots, zero regrets.',
  'Always keep pushing your limits',
  'I finally got out. See you never, 9 AM classes',
  'We came, we saw, we procrastinated.',
  'Started with confusion, leaving with confidence (and screenshots of notes).',
  'In every walk with nature one receives far more than he seeks',
  'Agle sem pakka',
  'No thoughts, just vibes and somehow a degree—held together by Google, YouTube, and last-night miracles. This wasn’t just college… it was character development.',
  '😎 Elegance With Side Of Ambition✨.',
  'You can get what you want, or you can just get old.',
  'Prioritize yourself and be happy',
  'Each of us is unique - don’t waste your energy on comparison. Use it to grow, and become your best self.',
  'Dilli k raaje',
  'Tum Tum Ho, Hum Hum Hain.Na Tum Kam Ho, Na Hum Kam Hain.',
  'Best memories planned nahi hoti, bas ho jaati hain.Kuch best saal, kuch best log, aur bohot saari yaadein❤️—Gaurav, signing off with memories that stay✨.',
  'Signing out… but the memories stay logged in.',
  'We made memories between all the deadlines.',
  'No retakes for this kind of time.',
  'Leaving campus, carrying the whole batch.',
  'The photos changed, the feeling stayed.',
  'Certified by attendance shortage and emotional damage.',
  'Same stories, better lighting, forever us.',
]
const yearbookStudents = studentNames.map((name, index) => ({
  name,
  quote: yearbookQuotes[index],
  image: pageImages.yearbook.student(index + 1),
  alt: `Portrait of ${name}`,
}))

const featureCards = [
  {
    title: 'The Hand-Penned Vault',
    text: 'Every award is nominated and voted by the class of 2026. These are the legends that defined our four years.',
    icon: History,
    tone: 'neutral',
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
  const getRoute = () => {
    if (window.location.pathname.startsWith('/pin-your-memories') || window.location.hash === '#/pin-your-memories') {
      return 'pin-your-memories'
    }

    if (window.location.pathname.startsWith('/add-moment') || window.location.hash === '#/add-moment') {
      return 'add-moment'
    }

    if (window.location.pathname.startsWith('/wall') || window.location.hash === '#/wall') {
      return 'wall'
    }

    if (window.location.pathname.startsWith('/gallery') || window.location.hash === '#/gallery') {
      return 'gallery'
    }

    return window.location.hash === '#/yearbook' ? 'yearbook' : 'home'
  }
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('keepsake-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return savedTheme ? savedTheme === 'dark' : prefersDark
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('keepsake-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    if (
      !window.location.hash &&
      !window.location.pathname.startsWith('/pin-your-memories') &&
      !window.location.pathname.startsWith('/add-moment') &&
      !window.location.pathname.startsWith('/wall') &&
      !window.location.pathname.startsWith('/gallery')
    ) {
      window.history.replaceState(null, '', '/#/')
    }

    const handleRouteChange = () => {
      setRoute(getRoute())
      setMenuOpen(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', handleRouteChange)
    window.addEventListener('popstate', handleRouteChange)
    return () => {
      window.removeEventListener('hashchange', handleRouteChange)
      window.removeEventListener('popstate', handleRouteChange)
    }
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
    if (item === 'Yearbook') {
      event.preventDefault()
      window.history.pushState(null, '', '/#/yearbook')
      setRoute('yearbook')
      setMenuOpen(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (item === 'Wall') {
      event.preventDefault()
      window.history.pushState(null, '', '/wall')
      setRoute('wall')
      setMenuOpen(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (item === 'Gallery') {
      event.preventDefault()
      window.history.pushState(null, '', '/gallery')
      setRoute('gallery')
      setMenuOpen(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (route !== 'home') {
      event.preventDefault()
      const sectionId = item.toLowerCase()
      window.history.pushState(null, '', `/#${sectionId}`)
      setRoute('home')
      setMenuOpen(false)
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    }
  }

  const navigateHome = (event) => {
    event.preventDefault()
    window.history.pushState(null, '', '/')
    setRoute('home')
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToPinMemories = (event) => {
    event.preventDefault()
    window.history.pushState(null, '', '/pin-your-memories')
    setRoute('pin-your-memories')
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToAddMoment = (event) => {
    event?.preventDefault()
    window.history.pushState(null, '', '/add-moment')
    setRoute('add-moment')
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToWall = (event) => {
    event?.preventDefault()
    window.history.pushState(null, '', '/wall')
    setRoute('wall')
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToGallery = (event) => {
    event?.preventDefault()
    window.history.pushState(null, '', '/gallery')
    setRoute('gallery')
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToHomeSection = (event, sectionId) => {
    event.preventDefault()
    window.history.pushState(null, '', `/#${sectionId}`)
    setRoute('home')
    setMenuOpen(false)
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" onClick={navigateHome} aria-label="The Digital Keepsake home">
          The Digital Keepsake
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              className={
                (item === 'Yearbook' && route === 'yearbook') || (item === 'Wall' && route === 'wall')
                  || (item === 'Gallery' && route === 'gallery')
                  ? 'active'
                  : ''
              }
              key={item}
              href={
                item === 'Yearbook'
                  ? '/#/yearbook'
                  : item === 'Wall'
                    ? '/wall'
                    : item === 'Gallery'
                      ? '/gallery'
                      : `#${item.toLowerCase()}`
              }
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
          <a className="add-button" href="/add-moment" onClick={navigateToAddMoment}>
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
              href={
                item === 'Yearbook'
                  ? '/#/yearbook'
                  : item === 'Wall'
                    ? '/wall'
                    : item === 'Gallery'
                      ? '/gallery'
                      : `#${item.toLowerCase()}`
              }
              onClick={(event) => {
                setMenuOpen(false)
                handleSectionNav(event, item)
              }}
            >
              {item}
            </a>
          ))}
          <a href="/add-moment" onClick={navigateToAddMoment}>
            Add Moment
          </a>
        </nav>
      )}

      {route === 'yearbook' ? (
        <YearbookPage />
      ) : route === 'pin-your-memories' ? (
        <PinYourMemories navigateToWall={navigateToWall} />
      ) : route === 'add-moment' ? (
        <UploadMoment navigateToGallery={navigateToGallery} />
      ) : route === 'wall' ? (
        <MemoriesWall navigateToPinMemories={navigateToPinMemories} />
      ) : route === 'gallery' ? (
        <Gallery navigateToAddMoment={navigateToAddMoment} />
      ) : (
        <HomePage navigateToGallery={navigateToGallery} navigateToPinMemories={navigateToPinMemories} />
      )}

      <footer id="gallery">
        <strong>The Digital Keepsake</strong>
        <div className="footer-links">
          <a href="/#memories" onClick={(event) => navigateToHomeSection(event, 'memories')}>
            The Vault
          </a>
          <a href="/#/yearbook" onClick={(event) => handleSectionNav(event, 'Yearbook')}>
            Alumni Directory
          </a>
          <a href="/pin-your-memories" onClick={navigateToPinMemories}>
            Lost &amp; Found
          </a>
          <a href="/#top" onClick={(event) => navigateToHomeSection(event, 'top')}>
            Farewell Letter
          </a>
        </div>
        <div className="footer-rule" />
        <p>© 2026 Class of 2026. Hand-penned with love and nostalgia.</p>
      </footer>
    </div>
  )
}

function HomePage({ navigateToGallery, navigateToPinMemories }) {
  return (
    <main id="top" className="home-page">
      <section className="home-hero reveal">
        <div className="home-copy">
          <div className="eyebrow">
            <Sparkles size={16} />
            PSCS Batch 2026
          </div>
          <h1>
            The Digital <span>Keepsake</span>
          </h1>
          <p>One warm scrapbook for every photo, note, inside joke, farewell message, and unforgettable batch moment.</p>
          <div className="hero-actions">
            <a className="primary-link" href="/gallery" onClick={navigateToGallery}>
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
        <a href="/pin-your-memories" onClick={navigateToPinMemories}>
          Pin a Memory
        </a>
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

function YearbookPage() {
  return (
    <main id="top" className="yearbook-page">
      <section className="yearbook-hero reveal" id="yearbook">
        <div className="eyebrow">
          <Star size={16} fill="currentColor" />
          Class of 2026 Superlatives
        </div>
        <h1>
          The Hall of <span>Fame &amp; Funny</span>
        </h1>
        <p>Celebrating the unique quirks and legendary personalities that made this year unforgettable.</p>
      </section>

      <section className="yearbook-section" aria-label="Yearbook student photos">
        <div className="yearbook-grid">
          {yearbookStudents.map(({ name, quote, image, alt }, index) => (
            <article
              className="yearbook-card-shell reveal"
              key={name}
              style={{ '--delay': `${Math.min(index, 11) * 45}ms` }}
            >
              <div className="yearbook-card">
                <div className="portrait">
                  <ImageWithFallback src={image} alt={alt} />
                </div>
                <h2>{name}</h2>
                <p>{quote}</p>
              </div>
            </article>
          ))}
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
