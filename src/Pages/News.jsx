import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ── News assets ─────────────────────────────────────────────────────────────
import img1 from '../assets/news/01K87YZQNX503SN3TQKZEP7S4W.png'
import img2 from '../assets/news/01K87Z1KWNJPC3BN1T6TMQ8YPR1.png'
import img3 from '../assets/news/01K87Z1KWNJPC3BN1T6TMQ8YPR2.png'
import img4 from '../assets/news/01K87Z55XY4P3JZJD9ZS34C9ZX1.png'
import img5 from '../assets/news/01K87Z55XY4P3JZJD9ZS34C9ZX2.png'
import img6 from '../assets/news/01K8AJ4CXG6T09EWPPD69R0TB51.png'
import img7 from '../assets/news/01K8AJ4CXG6T09EWPPD69R0TB52.jpg'
import CtaBgImg from '../assets/about/cta_background.png'

// ── Data mapping for images ──────────────────────────────────────────────────
const articleImages = {
  1: img1, 2: img2, 3: img3, 4: img4, 5: img5, 6: img6, 7: img7
};

// ── Data ────────────────────────────────────────────────────────────────────
const ALL_ARTICLES = [
  {
    id: 1,
    title: 'Chronic Pain Relief',
    subtitle: 'The Role of Physiotherapy in Chronic Pain Relief',
    date: '24 Oct 2025',
    category: 'Pain Management',
    img: img1,
    content:
      'Chronic pain affects millions worldwide. Our specialised therapists use evidence-based techniques—manual therapy, dry needling, and targeted exercise—to break the pain cycle and restore normal movement.',
    featured: true,
  },
  {
    id: 2,
    title: 'Geriatric Therapy',
    subtitle: 'How Geriatric Therapy Helps Seniors Stay Active & Independent',
    date: '23 Oct 2025',
    category: 'Senior Care',
    img: img2,
    content:
      "Aging doesn't mean slowing down. Our geriatric rehabilitation programme is tailored for older adults, improving balance, strength, and confidence in daily activities.",
    featured: false,
  },
  {
    id: 3,
    title: 'Sports Injury Recovery',
    subtitle: 'Recover Faster. Perform Better.',
    date: '23 Oct 2025',
    category: 'Sports',
    img: img3,
    content:
      'From sprained ankles to ACL tears, our sports physiotherapy specialists design progressive rehabilitation plans to get you back on the field stronger than ever.',
    featured: false,
  },
  {
    id: 4,
    title: 'Posture Correction',
    subtitle: 'Straighten Up: A Guide to Better Posture',
    date: '22 Oct 2025',
    category: 'Lifestyle',
    img: img4,
    content:
      'Poor posture is one of the leading causes of back and neck pain. Through targeted exercises and ergonomic guidance, we help you build lasting postural habits.',
    featured: false,
  },
  {
    id: 5,
    title: 'Back Pain Relief Tips',
    subtitle: 'Simple Daily Exercises to Manage Chronic Back Pain',
    date: '21 Oct 2025',
    category: 'Pain Management',
    img: img5,
    content:
      'Discover practical, at-home exercises recommended by our physiotherapists to reduce chronic back pain and improve spinal mobility in just 15 minutes a day.',
    featured: false,
  },
  {
    id: 6,
    title: 'ቀልማማ እግር ምንድን ነው?',
    subtitle: 'ከቀዶ ጥገና በኋላ የማገገሚያ ምክሮች',
    date: '24 Oct 2025',
    category: 'Pediatric',
    img: img6,
    content:
      'ቀደምት ህክምና ለልጆቻችን ሞቶሪክ ጤናማ እድገት ወሳኝ ሚና ይጫወታሉ። የሕፃናት ሕክምና ልጆች ሙሉ አቅማቸውን ለማሳካት ይረዳሉ።',
    featured: false,
  },
  {
    id: 7,
    title: 'የልጆች ህክምና ጥቅሞች',
    subtitle: 'ፊዚዮቴራፒ ለሕፃናት እንዴት ይጠቅማል?',
    date: '23 Oct 2025',
    category: 'Pediatric',
    img: img7,
    content:
      'የሕፃናት ሕክምና ልጆች ሙሉ አቅማቸውን እንዲያሳኩ ይረዳሉ። ከጥቃቅን እስከ ትልቅ የሞቶሪክ ክህሎቶች እናዳብረዋለን።',
    featured: false,
  },
]

const CATEGORIES = ['All', 'Pain Management', 'Senior Care', 'Sports', 'Lifestyle', 'Pediatric']

// ── Animated counter ─────────────────────────────────────────────────────────
const BUBBLE_COUNT = 50
const baseSizes = Array.from({ length: BUBBLE_COUNT }, (_, i) =>
  260 * Math.pow(1 - i / BUBBLE_COUNT, 1.6)
)

// ── Scroll-reveal hook ───────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

// ── Article Card ─────────────────────────────────────────────────────────────
function ArticleCard({ article, index, onClick }) {
  const { t } = useLanguage()
  const [ref, visible] = useReveal(0.1)
  const delay = `${(index % 3) * 100}ms`

  return (
    <div
      ref={ref}
      onClick={onClick}
      className="group relative overflow-hidden bg-white rounded-sm shadow-md hover:shadow-2xl cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay},
                     transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}`,
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-56">
        <img
          src={article.img}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* overlay */}
        <div className="absolute inset-0 bg-[#745893]/0 group-hover:bg-[#745893]/30 transition-colors duration-500" />
        {/* category badge */}
        <span className="absolute top-4 left-4 bg-[#FFF200] text-[#745893] text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full">
          {article.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-3">
        <p className="text-[#745893]/60 text-xs tracking-widest uppercase">{article.date}</p>
        <h3 className="text-[#745893] text-xl leading-tight tracking-wide">
          {article.title}
        </h3>
        <p className="text-[#333]/70 text-sm leading-relaxed line-clamp-3">{article.content}</p>

        {/* Read more link */}
        <div className="mt-2 flex items-center gap-2 text-[#745893] font-semibold text-sm group-hover:text-[#745893] transition-colors">
          <span>{t.newsPage.article.readMore}</span>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
            className="transition-transform group-hover:translate-x-1">
            <path d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ── Running ticker ───────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  'Pain-Free Mobility',
  'Geriatric Care',
  'Sports Recovery',
  'Pediatric Physio',
  'Posture Correction',
  'Manual Therapy',
  'Dry Needling',
  'Neuro Rehab',
]

function Ticker() {
  const { t } = useLanguage();
  const TICKER_ITEMS = t.newsPage.ticker;
  return (
    <div className="w-full bg-[#FFF200] overflow-hidden py-3 select-none">
      <div
        className="flex gap-16 whitespace-nowrap"
        style={{
          animation: 'tickerScroll 22s linear infinite',
        }}
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="text-[#745893] font-bold uppercase tracking-widest text-sm flex items-center gap-4">
            {item}
            <span className="w-2 h-2 bg-[#745893] rotate-45 inline-block" />
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function News() {
  const { t } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState(null)
  
  const ALL_ARTICLES = t.newsPage.articles.map(article => ({
    ...article,
    img: articleImages[article.id],
    featured: article.id === 1
  }));
  
  useEffect(() => {
    if (selectedArticle) {
       window.scrollTo(0, 0);
    }
  }, [selectedArticle]);

  const [scrollY, setScrollY] = useState(0)
  const [activeCategory, setActiveCategory] = useState(t.newsPage.categories.all)

  // Reset category filter when language changes to prevent empty results
  useEffect(() => {
    setActiveCategory(t.newsPage.categories.all)
  }, [t.newsPage.categories.all])
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredCard, setHoveredCard] = useState(null)

  // Hero cursor comet
  const heroRef = useRef(null)
  const targetRef = useRef({ x: -1000, y: -1000 })
  const historyRef = useRef(Array(BUBBLE_COUNT).fill({ x: -1000, y: -1000 }))
  const [maskStyle, setMaskStyle] = useState('')
  const [isInsideHero, setIsInsideHero] = useState(false)
  const [isResponsive, setIsResponsive] = useState(window.innerWidth < 1024)

  // Automatic blobs for high-fidelity fluid motion
  const blobsRef = useRef(Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * (window.innerWidth || 1000),
      y: Math.random() * 600,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      r: 40 + Math.random() * 60,
      isCursor: i === 0 // First blob can follow cursor on desktop
  })))

  useEffect(() => {
    const handleResize = () => setIsResponsive(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Scroll
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Comet animation loop
  useEffect(() => {
    let rafId
    const el = heroRef.current

    const animate = () => {
      const rect = el?.getBoundingClientRect()
      const width = rect?.width || window.innerWidth
      const height = rect?.height || 600

      if (isResponsive) {
        // SVG Metaballs Logic
        blobsRef.current.forEach((blob, i) => {
          const circleEl = document.getElementById(`blob-${i}`)
          if (!circleEl) return
          blob.x += blob.vx
          blob.y += blob.vy
          if (blob.x < -50 || blob.x > width + 50) blob.vx *= -1
          if (blob.y < -50 || blob.y > height + 50) blob.vy *= -1
          blob.x += Math.sin(Date.now() * 0.0005 + i) * 0.4
          blob.y += Math.cos(Date.now() * 0.0005 + i) * 0.4
          circleEl.setAttribute('cx', blob.x)
          circleEl.setAttribute('cy', blob.y)
          circleEl.setAttribute('r', blob.r)
        })
        if (!isInsideHero) setIsInsideHero(true)
      } else {
        // Desktop Cursor Trail Logic
        historyRef.current.unshift({ ...targetRef.current })
        if (historyRef.current.length > BUBBLE_COUNT) historyRef.current.pop()
        const gradients = baseSizes
          .map((size, i) => {
            const pos = historyRef.current[i] || historyRef.current.at(-1)
            return `radial-gradient(circle ${size / 2}px at ${pos.x}px ${pos.y}px, black 100%, transparent 100%)`
          })
          .reverse()
          .join(',')
        setMaskStyle(gradients)
      }
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [isResponsive, isInsideHero])

  const handleHeroMove = (e) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    targetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handleHeroEnter = (e) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    targetRef.current = { x, y }
    historyRef.current = Array(BUBBLE_COUNT).fill({ x, y })
    setIsInsideHero(true)
  }

  const handleHeroLeave = () => {
    setIsInsideHero(false)
    targetRef.current = { x: -1000, y: -1000 }
    historyRef.current = Array(BUBBLE_COUNT).fill({ x: -1000, y: -1000 })
  }

  // Articles filtering
  const featured = ALL_ARTICLES.find((a) => a.featured) || ALL_ARTICLES[0]
  const filtered = ALL_ARTICLES.filter((a) => {
    const matchCat = activeCategory === t.newsPage.categories.all || a.category === activeCategory
    const matchSearch =
      searchQuery === '' ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch && !a.featured
  })

  // Section refs for scroll-reveal
  const [sectionRef, sectionVisible] = useReveal(0.05)
  const [filterRef, filterVisible] = useReveal(0.1)
  const [featuredRef, featuredVisible] = useReveal(0.1)

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] overflow-x-hidden pt-24">
        <div className="fixed top-0 left-0 w-full z-[200]">
          <Navbar scrollY={scrollY} />
        </div>
        
        {/* Back button */}
        <div className="px-8 md:px-20 mb-8 max-w-5xl mx-auto pt-8">
          <button 
            onClick={() => setSelectedArticle(null)} 
            className="flex items-center gap-2 text-[#745893] hover:text-[#5d3e78] transition-colors font-semibold uppercase tracking-widest text-sm group"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="transition-transform group-hover:-translate-x-1 rotate-180">
               <path d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.newsPage.article.backToNews}
          </button>
        </div>

        {/* Hero Image */}
        <div className="px-8 md:px-20 mb-12 max-w-5xl mx-auto">
          <div className="relative w-full h-[50vh] md:h-[60vh] rounded-sm overflow-hidden shadow-2xl group animate-fade-up">
            <img 
              src={selectedArticle.img} 
              alt={selectedArticle.title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-14 w-full">
              <span className="inline-block bg-[#FFF200] text-[#745893] text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
                {selectedArticle.category}
              </span>
              <h1 className="text-[#F7F7F5] text-[clamp(2.5rem,5vw,4rem)] leading-[0.92] uppercase mb-2">
                {selectedArticle.title}
              </h1>
              <p className="text-[#F7F7F5]/80 text-lg tracking-widest uppercase">{selectedArticle.date}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 md:px-20 max-w-4xl mx-auto mb-20 animate-fade-up" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
          <h2 className="text-[#745893] text-2xl md:text-3xl font-medium mb-8 leading-tight">
            {selectedArticle.subtitle}
          </h2>
          
          <div className="prose prose-lg text-[#333]/80 leading-relaxed max-w-none">
            <p className="mb-6 text-xl leading-relaxed text-[#333]/90">{selectedArticle.content}</p>
            
            <h3 className="text-[#745893] text-2xl mb-4 mt-8">{t.newsPage.article.understanding}</h3>
            <p className="mb-6">{t.newsPage.article.understandingDesc}</p>
            
            <div className="bg-[#745893]/5 p-8 rounded-sm border-l-4 border-[#745893] mb-8 mt-8">
              <p className="text-xl font-medium text-[#745893] italic">
                "{t.newsPage.article.healingQuote}"
              </p>
            </div>
            
            <h3 className="text-[#745893] text-2xl mb-4 mt-8">{t.newsPage.article.treatment}</h3>
            <p className="mb-6">{t.newsPage.article.treatmentDesc}</p>
            
            <p className="mb-6">{t.newsPage.article.consistencyDesc}</p>
          </div>
          
          {/* Share or CTA within article */}
          <div className="mt-16 pt-8 border-t border-[#745893]/20 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-[#745893] font-medium tracking-widest text-sm uppercase">{t.newsPage.article.share}</span>
              <div className="flex gap-3">
                <button className="w-10 h-10 rounded-full bg-[#745893]/10 flex items-center justify-center text-[#745893] hover:bg-[#745893] hover:text-white transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                </button>
              </div>
            </div>
            <Link to="/appointment" className="bg-[#FFF200] text-[#745893] px-8 py-3 rounded-full font-medium text-sm transition-all hover:scale-105 shadow-md flex items-center gap-2 group">
              {t.newsPage.article.bookConsultation}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="transition-transform group-hover:translate-x-1">
                 <path d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Newsletter CTA */}
        <NewsletterSection />
        <Footer />
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(60px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up { animation: fadeUp 1.1s cubic-bezier(0.22,1,0.36,1) forwards; }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] overflow-x-hidden">
      {/* Ticker animation */}
      <style>{`
        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(60px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes lineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        .animate-slide-down { animation: slideDown 0.9s cubic-bezier(0.22,1,0.36,1) forwards; }
        .animate-fade-up    { animation: fadeUp 1.1s cubic-bezier(0.22,1,0.36,1) forwards; }
        .animate-line-grow  { animation: lineGrow 1.2s cubic-bezier(0.22,1,0.36,1) forwards; }
      `}</style>

      {/* ── FIXED NAVBAR ───────────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 w-full z-200">
        <Navbar scrollY={scrollY} />
      </div>

      {/* Hidden SVG for Metaball Filter/Mask */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
          <mask id="hero-mask" maskContentUnits="userSpaceOnUse">
            <g filter="url(#goo)">
              {Array.from({ length: 12 }).map((_, i) => (
                <circle key={i} id={`blob-${i}`} r="80" fill="white" />
              ))}
            </g>
          </mask>
        </defs>
      </svg>

      {/* ── HERO SECTION ───────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        onPointerMove={handleHeroMove}
        onPointerEnter={handleHeroEnter}
        onPointerLeave={handleHeroLeave}
        className="relative h-[75vh] w-full overflow-hidden bg-[#745893] pt-16 md:cursor-none"
      >
        {/* Bottom layer — yellow headline */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <div className="flex items-center gap-4 mb-6 animate-slide-down" style={{ animationDelay: '0.1s' }}>
            <div className="h-[1px] bg-[#FFF200]/60 w-20" />
            <span className="text-[#FFF200] font-medium tracking-[0.3em] text-sm uppercase">
              {t.newsPage.hero.subtitle}
            </span>
            <div className="h-[1px] bg-[#FFF200]/60 w-20" />
          </div>

          <h1
            className="md:font-compacta text-[#F7F7F5] text-[clamp(2rem,8vw,5rem)] md:text-[clamp(3.5rem,8vw,7rem)] leading-[0.9] uppercase animate-fade-up"
            style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
            dangerouslySetInnerHTML={{ __html: t.newsPage.hero.title }}
          />

          

          
        </div>

        {/* Top reveal layer — image on hover */}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            display: isInsideHero ? 'block' : 'none',
            WebkitMaskImage: isResponsive ? 'url(#hero-mask)' : maskStyle,
            maskImage: isResponsive ? 'url(#hero-mask)' : maskStyle,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: isResponsive ? '100% 100%' : 'auto',
            maskSize: isResponsive ? '100% 100%' : 'auto',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1582079768266-e65af1ad8d3a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="reveal"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Same text overlay in light colour */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className="flex items-center gap-4 mb-6 animate-slide-down" style={{ animationDelay: '0.1s' }}>
            <div className="h-[1px] bg-[#F7F7F5]/60 w-20" />
            <span className="text-[#F7F7F5] font-medium tracking-[0.3em] text-sm uppercase">
              {t.newsPage.hero.subtitle}
            </span>
            <div className="h-[1px] bg-[#F7F7F5]/60 w-20" />
          </div>

          <h1
            className="md:font-compacta text-[#FFF200] text-[clamp(2rem,8vw,5rem)] md:text-[clamp(3.5rem,8vw,7rem)] leading-[0.9] uppercase animate-fade-up"
            style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
            dangerouslySetInnerHTML={{ __html: t.newsPage.hero.title }}
          />
          </div>
        </div>
      </section>

      {/* ── YELLOW TICKER ──────────────────────────────────────────────────── */}
      <Ticker />

      {/* ── FEATURED ARTICLE ────────────────────────────────────────────────── */}
      <section
        ref={featuredRef}
        className="px-8 md:px-20 py-16 bg-[#F7F7F5]"
      >
        <div
          className="flex items-center gap-4 mb-10"
          style={{
            opacity: featuredVisible ? 1 : 0,
            transform: featuredVisible ? 'translateX(0)' : 'translateX(-40px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="flex items-center">
            <div className="h-[1.25px] bg-[#745893] w-60" />
            <div className="w-2 h-2 bg-[#745893] rotate-45 -mr-1" />
          </div>
          <span className="text-[#745893] font-medium tracking-widest text-sm uppercase">{t.newsPage.featured.subtitle}</span>
        </div>

        {/* Featured card */}
        <div
          onClick={() => setSelectedArticle(featured)}
          className="group relative grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-sm shadow-2xl min-h-[60vh] cursor-pointer"
          style={{
            opacity: featuredVisible ? 1 : 0,
            transform: featuredVisible ? 'translateY(0)' : 'translateY(50px)',
            transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s',
          }}
        >
          {/* Image side */}
          <div className="relative overflow-hidden lg:order-2 min-h-[350px]">
            <img
              src={featured.img}
              alt={featured.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#745893]/60 via-transparent to-transparent lg:bg-gradient-to-l" />
          </div>

          {/* Text side */}
          <div className="relative bg-[#745893] lg:order-1 p-10 md:p-14 flex flex-col justify-between gap-8">
            {/* top tag */}
            <div>
              <span className="inline-block bg-[#FFF200] text-[#745893] text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-6">
                {featured.category}
              </span>
              <p className="text-[#F7F7F5]/90 text-sm tracking-widest uppercase mb-3">{featured.date}</p>
              <h2 className="text-[#F7F7F5] text-[clamp(2.5rem,5vw,4rem)] leading-[0.92] uppercase mb-4">
                {featured.title}
              </h2>
              <p className="text-[#F7F7F5]/80 text-lg leading-relaxed">{featured.subtitle}</p>
            </div>

            <div>
              <p className="text-[#F7F7F5]/70 text-sm leading-relaxed mb-8">
                {featured.content}
              </p>

              <button onClick={(e) => { e.stopPropagation(); setSelectedArticle(featured); }} className="flex items-center w-max gap-3 bg-[#FFF200] text-[#745893] px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg group/btn">
                {t.newsPage.featured.button}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                  className="transition-transform group-hover/btn:translate-x-1">
                  <path d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTICLE GRID ────────────────────────────────────────────────────── */}
      <section ref={sectionRef} className="px-8 md:px-20 pb-20 bg-[#F7F7F5]">
        {/* Section heading */}
        <div
          className="flex items-center justify-between mb-10"
          style={{
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="h-[1.25px] bg-[#745893] w-16" />
              <div className="w-2 h-2 bg-[#745893] rotate-45 -mr-1" />
            </div>
            <span className="text-[#745893] font-medium tracking-widest text-sm uppercase">
              {activeCategory === t.newsPage.categories.all ? t.newsPage.article.allArticles : activeCategory}
            </span>
          </div>

          <span className="text-[#745893]/50 text-sm">
            {filtered.length} {filtered.length !== 1 ? t.newsPage.article.countPlural : t.newsPage.article.count}
          </span>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} onClick={() => setSelectedArticle(article)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-[#745893]/20 text-8xl mb-4">{t.newsPage.noResults.title}</div>
            <p className="text-[#745893]/60 text-lg">{t.newsPage.noResults.desc}</p>
            <button
              onClick={() => { setActiveCategory(t.newsPage.categories.all); setSearchQuery('') }}
              className="mt-6 px-6 py-2 rounded-full bg-[#745893] text-white text-sm hover:bg-[#5d3e78] transition"
            >
              {t.newsPage.noResults.clear}
            </button>
          </div>
        )}
      </section>

      {/* ── NEWSLETTER CTA ──────────────────────────────────────────────────── */}
      <NewsletterSection />

      <Footer />
    </div>
  )
}

// ── Newsletter CTA section ───────────────────────────────────────────────────
function NewsletterSection() {
  const { t } = useLanguage()
  const [ref, visible] = useReveal(0.15)
  return (
    <section className="relative w-full h-[40vh] md:h-[50vh] min-h-[350px] md:min-h-[400px] overflow-hidden">
        {/* Background Image with Blur */}
        <div className="absolute inset-0">
            <img
                src={CtaBgImg}
                alt="CTA Background"
                className="w-full h-full object-cover blur-[4px] scale-105"
            />
            <div className="absolute inset-0 bg-[#745893]/55"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-6">
            <h2 
                className="text-white text-3xl sm:text-4xl md:text-[clamp(2.5rem,8vw,3.5rem)] leading-[1.2] uppercase max-w-5xl mb-8 md:mb-12"
                dangerouslySetInnerHTML={{ __html: t.newsPage.cta.title }}
            />

            <Link to="/appointment" className="bg-white text-[#745893] px-8 md:px-10 py-4 md:py-5 rounded-full flex items-center gap-3 font-medium text-sm transition-all hover:scale-105 hover:bg-[#F7F7F5] shadow-xl group">
                {t.newsPage.cta.button}
                <svg width="25" height="25" viewBox="0 0 20 20" fill="none" className="transition-transform group-hover:translate-x-1">
                    <path d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699" stroke="#745893" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </Link>
        </div>
    </section>
  )
}
