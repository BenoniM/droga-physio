import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import physioLogoFooter from '../assets/general/physioLogo2.svg'

// ── News assets ─────────────────────────────────────────────────────────────
import img1 from '../assets/news/01K87YZQNX503SN3TQKZEP7S4W.png'
import img2 from '../assets/news/01K87Z1KWNJPC3BN1T6TMQ8YPR1.png'
import img3 from '../assets/news/01K87Z1KWNJPC3BN1T6TMQ8YPR2.png'
import img4 from '../assets/news/01K87Z55XY4P3JZJD9ZS34C9ZX1.png'
import img5 from '../assets/news/01K87Z55XY4P3JZJD9ZS34C9ZX2.png'
import img6 from '../assets/news/01K8AJ4CXG6T09EWPPD69R0TB51.png'
import img7 from '../assets/news/01K8AJ4CXG6T09EWPPD69R0TB52.jpg'
import CtaBgImg from '../assets/about/cta_background.png'

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
function ArticleCard({ article, index }) {
  const [ref, visible] = useReveal(0.1)
  const delay = `${(index % 3) * 100}ms`

  return (
    <div
      ref={ref}
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
          <span>Read More</span>
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
  const [scrollY, setScrollY] = useState(0)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredCard, setHoveredCard] = useState(null)

  // Hero cursor comet
  const heroRef = useRef(null)
  const targetRef = useRef({ x: -1000, y: -1000 })
  const historyRef = useRef(Array(BUBBLE_COUNT).fill({ x: -1000, y: -1000 }))
  const [maskStyle, setMaskStyle] = useState('')
  const [isInsideHero, setIsInsideHero] = useState(false)

  // Scroll
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Comet animation loop
  useEffect(() => {
    let rafId
    const animate = () => {
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
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [])

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
    const matchCat = activeCategory === 'All' || a.category === activeCategory
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
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar scrollY={scrollY} />
      </div>

      {/* ── HERO SECTION ───────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        onPointerMove={handleHeroMove}
        onPointerEnter={handleHeroEnter}
        onPointerLeave={handleHeroLeave}
        className="relative h-[75vh] w-full overflow-hidden bg-[#745893] pt-16 cursor-none"
      >
        {/* Bottom layer — yellow headline */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <div className="flex items-center gap-4 mb-6 animate-slide-down" style={{ animationDelay: '0.1s' }}>
            <div className="h-[1px] bg-[#FFF200]/60 w-20" />
            <span className="text-[#FFF200] font-medium tracking-[0.3em] text-sm uppercase">
              Droga Physiotherapy
            </span>
            <div className="h-[1px] bg-[#FFF200]/60 w-20" />
          </div>

          <h1
            className="font-['Compacta'] text-[#FFF200] text-[clamp(3.5rem,8vw,7rem)] leading-[0.9] uppercase animate-fade-up"
            style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
          >
            News &<br />Insights
          </h1>

          

          
        </div>

        {/* Top reveal layer — image on hover */}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            display: isInsideHero ? 'block' : 'none',
            WebkitMaskImage: maskStyle,
            maskImage: maskStyle,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
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
              Droga Physiotherapy
            </span>
            <div className="h-[1px] bg-[#F7F7F5]/60 w-20" />
          </div>

          <h1
            className="font-['Compacta'] text-[#F7F7F5] text-[clamp(3.5rem,8vw,7rem)] leading-[0.9] uppercase animate-fade-up"
            style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
          >
            News &<br />Insights
          </h1>
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
          <span className="text-[#745893] font-medium tracking-widest text-sm uppercase">Featured Story</span>
        </div>

        {/* Featured card */}
        <div
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
              <p className="text-[#FFF200]/70 text-sm tracking-widest uppercase mb-3">{featured.date}</p>
              <h2 className="text-[#F7F7F5] text-[clamp(2.5rem,5vw,4rem)] leading-[0.92] uppercase mb-4">
                {featured.title}
              </h2>
              <p className="text-[#F7F7F5]/80 text-lg leading-relaxed">{featured.subtitle}</p>
            </div>

            <div>
              <p className="text-[#F7F7F5]/70 text-sm leading-relaxed mb-8">
                {featured.content}
              </p>

              <button className="flex items-center gap-3 bg-[#FFF200] text-[#745893] px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg group/btn">
                Read Full Article
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                  className="transition-transform group-hover/btn:translate-x-1">
                  <path d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Decorative number */}
            <div className="absolute right-8 bottom-8 text-[8rem] leading-none text-[#F7F7F5]/5 pointer-events-none select-none">
              01
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
              {activeCategory === 'All' ? 'All Articles' : activeCategory}
            </span>
          </div>

          <span className="text-[#745893]/50 text-sm">
            {filtered.length} article{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-[#745893]/20 text-8xl mb-4">?</div>
            <p className="text-[#745893]/60 text-lg">No articles found for this search.</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery('') }}
              className="mt-6 px-6 py-2 rounded-full bg-[#745893] text-white text-sm hover:bg-[#5d3e78] transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* ── NEWSLETTER CTA ──────────────────────────────────────────────────── */}
      <NewsletterSection />

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <Footer physioLogoFooter={physioLogoFooter} />
    </div>
  )
}

// ── Newsletter CTA section ───────────────────────────────────────────────────
function NewsletterSection() {
  const [ref, visible] = useReveal(0.15)
  return (
    <section className="relative w-full h-[50vh] min-h-[400px] overflow-hidden">
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
            <h2 className="text-white text-[clamp(2.5rem,8vw,3.5rem)] leading-[1.2] uppercase max-w-5xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                Start Your Journey to <br /> Pain-Free Mobility Today!
            </h2>

            <button className="bg-white text-[#745893] px-10 py-5 rounded-full flex items-center gap-3 font-medium text-sm transition-all hover:scale-105 hover:bg-[#F7F7F5] shadow-xl group">
                Book An Appointment
                <svg width="25" height="25" viewBox="0 0 20 20" fill="none" className="transition-transform group-hover:translate-x-1">
                    <path d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699" stroke="#745893" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    </section>
  )
}

// ── Footer ──────────────────────────────────────────────────────────────────
function Footer({ physioLogoFooter }) {
  return (
    <footer className="relative bg-[#745893] text-white overflow-hidden px-6 md:px-16 lg:px-20 h-[75vh] flex flex-col">
      <div className="flex flex-col justify-between">
        <div className="flex flex-col lg:flex-row gap-50 mt-10">
          <div className="font-['Compacta'] uppercase leading-[0.85] text-[clamp(5rem,14vw,50rem)] tracking-tight">
            DROGA
          </div>
          <div className="flex gap-15 md:gap-20 lg:gap-30">
            <div>
              <h4 className="text-xl md:text-2xl mb-4 w-20">Pages</h4>
              <div className="space-y-2 text-sm md:text-[15px] font-light">
                <div className="cursor-pointer hover:text-white">Home</div>
                <div className="cursor-pointer hover:text-white">About Us</div>
                <div className="cursor-pointer hover:text-white">Services</div>
                <div className="cursor-pointer hover:text-white">Book Now</div>
                <div className="cursor-pointer hover:text-white">Contact Us</div>
              </div>
            </div>
            <div>
              <h4 className="text-xl md:text-2xl mb-4">Companies</h4>
              <div className="space-y-2 text-sm md:text-[15px] font-light">
                <div className="cursor-pointer hover:text-white">Droga Pharma PLC</div>
                <div className="cursor-pointer hover:text-white">EMA Import and Export Pvt.Ltd</div>
                <div className="cursor-pointer hover:text-white">Trust Pharmaceutical Manufacturing PLC</div>
                <div className="cursor-pointer hover:text-white">Draga Pharmacy</div>
              </div>
            </div>
            <div>
              <h4 className="text-xl md:text-2xl mb-4">Contact Us</h4>
              <div className="space-y-2 text-sm md:text-[15px] font-light">
                <div className="flex items-center gap-3 text-white/90">
                  <svg className="w-5 h-5 text-[#FFF200]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-base md:text-lg font-light">0974959595</span>
                </div>
                <div>0115578906 / 0965757526</div>
                <div>Addis Ababa, Ethiopia</div>
                <div>info@drogaphysiotherapy.com</div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                {[
                  <svg key="fb" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
                  <svg key="ig" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
                  <svg key="tg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
                  <svg key="ph" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
                ].map((icon, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border border-white/80 flex items-center justify-center hover:bg-white hover:text-[#745893] transition">
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mt-2">
          <div className="font-['Compacta'] uppercase leading-[0.85] text-[clamp(5rem,14vw,50rem)] tracking-tight">
            PHYSIOTHERAPY
          </div>
          <img src={physioLogoFooter} alt="Droga Physiotherapy" className="h-25 md:h-30" />
        </div>

        <div className="border-t border-white/30 mb-5 pt-3 flex justify-between text-xs md:text-sm text-white/80 mt-5">
          <div>Powered by Droga Consulting © 2026</div>
          <div className="flex items-center gap-4">
            <span className="cursor-pointer hover:text-white">All Rights Reserved</span>
            <span className="w-px h-4 bg-white/40" />
            <span className="cursor-pointer hover:text-white">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
