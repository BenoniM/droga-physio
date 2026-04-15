import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CtaBgImg from '../assets/about/cta_background.png'

// ── Hooks ────────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, visible]
}

const BUBBLE_COUNT = 60
const baseSizes = Array.from({ length: BUBBLE_COUNT }, (_, i) => 300 * Math.pow(1 - i / BUBBLE_COUNT, 1.6))

// ── Images ───────────────────────────────────────────────────────────────────
// High-quality Unsplash placeholders fit for wellness and health
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2070&auto=format&fit=crop", 
  sit: "https://images.unsplash.com/photo-1531123414780-f74242c2b052?q=80&w=1470&auto=format&fit=crop", 
  drive: "https://images.pexels.com/photos/9518031/pexels-photo-9518031.jpeg", 
  stretch: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop", 
  sleep: "https://images.unsplash.com/photo-1505686994434-e3f4e13636f4?q=80&w=1460&auto=format&fit=crop", 
  eyes: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=1200&auto=format&fit=crop" 
}

// ── Reusable Section Components ──────────────────────────────────────────────
function SectionHeading({ title, subtitle }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} className="text-center w-full mb-16 px-6">
      <div 
        className="flex justify-center items-center gap-4 mb-4"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease' }}
      >
        <div className="h-[1px] bg-[#745893]/40 w-16" />
        <span className="text-[#745893] font-medium tracking-[0.3em] text-sm uppercase">{subtitle}</span>
        <div className="h-[1px] bg-[#745893]/40 w-16" />
      </div>
      <h2 
        className="md:font-['Compacta'] text-[#745893] text-[clamp(2rem,6vw,3rem)] leading-[0.9] uppercase"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease 0.1s' }}
      >
        {title}
      </h2>
    </div>
  )
}

function BentoCard({ imgSrc, title, content, colSpan, rowSpan, delay }) {
  const [ref, visible] = useReveal(0.1)
  
  return (
    <div
      ref={ref}
      className={`relative group overflow-hidden rounded shadow-xl ${colSpan} ${rowSpan}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s`
      }}
    >
      <img
        src={imgSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#745893]/90 via-[#745893]/30 to-transparent transition-opacity duration-500 group-hover:from-[#745893] group-hover:to-[#745893]/40" />
      
      <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className=" text-[#FFF200] font-semibold text-xl uppercase tracking-wide mb-3">{title}</h3>
        <p className="text-[#F7F7F5] text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
          {content}
        </p>
      </div>
    </div>
  )
}

function TimelineItem({ time, title, description, alignLeft }) {
    const [ref, visible] = useReveal(0.3)

    return (
        <div ref={ref} className={`relative flex items-center justify-between md:justify-normal w-full mb-12 ${alignLeft ? 'flex-row-reverse md:flex-row-reverse' : ''}`}>
            {/* Center dot removed upon request */}
            
            <div className="w-full md:w-5/12" />
            <div 
                className={`w-full md:w-5/12 bg-white rounded shadow-lg p-8 border-l-4 border-[#FFF200] relative`}
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateX(0)' : (alignLeft ? 'translateX(-40px)' : 'translateX(40px)'),
                    transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1)'
                }}
            >
                <div className="text-[#745893]/50 font-bold tracking-widest text-xs uppercase mb-2">{time}</div>
                <h3 className="text-[#745893] text-xl font-bold uppercase tracking-wide mb-3">{title}</h3>
                <p className="text-gray-600 font-light text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    )
}

// ── Toolbox Accordion ────────────────────────────────────────────────────────
function ToolboxAccordion() {
  const [ref, visible] = useReveal(0.1)
  const [activeIndex, setActiveIndex] = useState(0)
  
  const tools = [
    {
      title: "Ice vs. Heat",
      desc: "Ice limits blood flow to reduce acute swelling. Heat promotes blood flow to relax muscles. Never use heat on a fresh injury.",
      img: "https://images.pexels.com/photos/3334510/pexels-photo-3334510.jpeg"
    },
    {
      title: "Foam Rolling",
      desc: "Release myofascial tightness in IT bands, calves, and upper back using slow, controlled pressure before and after workouts.",
      img: "https://images.pexels.com/photos/4804307/pexels-photo-4804307.jpeg"
    },
    {
      title: "Epsom Salt Baths",
      desc: "Magnesium sulfate absorbed through the skin helps relax overworked muscles and loosen stiff joints after long days.",
      img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Active Recovery",
      desc: "Instead of total rest, try light walking, cycling, or swimming to promote nutrient-rich blood flow to recovering tissues.",
      img: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800&auto=format&fit=crop"
    }
  ]

  return (
    <section className="py-24 px-6 md:px-20 max-w-[1400px] mx-auto overflow-hidden">
        <SectionHeading title="At-Home Recovery Toolbox" subtitle="Practical Methods" />
        
        <div 
            ref={ref}
            className="w-full flex flex-col md:flex-row h-[600px] md:h-[500px] gap-2 md:gap-4 mt-12 rounded-xl"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1)'
            }}
        >
          {tools.map((tool, idx) => {
            const isActive = activeIndex === idx
            return (
              <div 
                key={idx}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`relative group overflow-hidden rounded-xl cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.35,1)] ${isActive ? 'flex-[3] md:flex-[4]' : 'flex-[1] md:flex-[1]'}`}
              >
                <img src={tool.img} alt={tool.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className={`absolute inset-0 bg-gradient-to-t from-[#745893] via-[#745893]/20 to-transparent transition-opacity duration-700 ${isActive ? 'opacity-90' : 'opacity-70'}`} />
                
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end h-full">
                    <div className="h-full flex flex-col justify-end">
                        <h3 className={` text-[#FFF200] uppercase tracking-wide transition-all duration-700 ${isActive ? 'text-3xl md:text-4xl mb-3' : 'text-xl md:text-2xl mb-0 whitespace-nowrap truncate'}`}>
                            {tool.title}
                        </h3>
                        
                        <div className={`overflow-hidden transition-all duration-700 ${isActive ? 'max-h-40 opacity-100 delay-200' : 'max-h-0 opacity-0'}`}>
                            <p className="text-[#F7F7F5] text-sm md:text-base leading-relaxed max-w-sm">
                                {tool.desc}
                            </p>
                        </div>
                    </div>
                </div>
              </div>
            )
          })}
        </div>
    </section>
  )
}

// ── Main Layout ──────────────────────────────────────────────────────────────
export default function Blog() {
  const [scrollY, setScrollY] = useState(0)

  // Hero comet state
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

  // Scroll listener
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
  const handleHeroEnter = (e) => { setIsInsideHero(true); handleHeroMove(e) }
  const handleHeroLeave = () => {
    setIsInsideHero(false)
    targetRef.current = { x: -1000, y: -1000 }
    historyRef.current.fill({ x: -1000, y: -1000 })
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] overflow-x-hidden font-['Delight']">
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
              Droga Physiotherapy
            </span>
            <div className="h-[1px] bg-[#FFF200]/60 w-20" />
          </div>
          <h1
            className="max-w-6xl md:font-['Compacta'] text-[#F7F7F5] text-[clamp(1.8rem,5.5vw,3rem)] md:text-[clamp(3.5rem,8vw,6.5rem)] leading-[0.9] uppercase animate-fade-up"
            style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
          >
            Wellness And Pre-Therapy<br />Tips For Daily Life
          </h1>
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
            src={IMAGES.hero}
            alt="Wellness reveal"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className="flex items-center gap-4 mb-6 animate-slide-down" style={{ animationDelay: '0.1s' }}>
              <div className="h-[1px] bg-[#F7F7F5]/60 w-20" />
              <span className="text-[#F7F7F5] font-medium tracking-[0.3em] text-sm uppercase">
                Droga Physiotherapy
              </span>
              <div className="h-[1px] bg-[#F7F7F5]/60 w-20" />
            </div>
            <h1
              className="max-w-6xl md:font-['Compacta'] text-[#FFF200] text-[clamp(1.8rem,5.5vw,3rem)] md:text-[clamp(3.5rem,8vw,6.5rem)] leading-[0.9] uppercase animate-fade-up"
              style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
            >
              Wellness And Pre-Therapy<br />Tips For Daily Life
            </h1>
          </div>
        </div>
      </section>

      {/* ── BENTO GRID SECTION (LIFESTYLE TIPS) ───────────────────────────── */}
      <section className="py-24 px-6 md:px-20 max-w-[1400px] mx-auto">
        <SectionHeading title="Preventative Care Guides" subtitle="Ergonomics & Lifestyle" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-[auto,auto,auto] md:grid-rows-[400px_300px] gap-4 md:gap-6 mt-12 w-full">
            {/* LARGE SQUARE - Desk Ergonomics */}
            <BentoCard 
                imgSrc={IMAGES.sit}
                title="Master Your Desk Posture"
                content="Sitting for hours puts immense pressure on your spine. Keep your screen at eye level, shoulders relaxed, and lower back supported. Ensure your feet are flat on the floor to maintain blood circulation and reduce lumbar strain."
                colSpan="col-span-1 md:col-span-2"
                rowSpan="row-span-1 md:row-span-2"
                delay={0}
            />

            {/* TALL RECTANGLE - Driving */}
            <BentoCard 
                imgSrc={IMAGES.drive}
                title="Drive Pain-Free"
                content="Adjust your seat so your knees are slightly bent. Keep your hands at 9 and 3 o'clock. Use a lumbar roll if your seat lacks support."
                colSpan="col-span-1 md:col-span-1"
                rowSpan="row-span-1 md:row-span-2"
                delay={0.15}
            />

            {/* SMALL SQUARE 1 - Stretching */}
            <BentoCard 
                imgSrc={IMAGES.stretch}
                title="3-Minute Stretch"
                content="Incorporate quick standing back extensions and neck gentle rolls every two hours."
                colSpan="col-span-1 md:col-span-1"
                rowSpan="h-[300px] md:h-auto row-span-1 md:row-span-1"
                delay={0.3}
            />

            {/* SMALL SQUARE 2 - Eye Strain */}
            <BentoCard 
                imgSrc={IMAGES.eyes}
                title="The 20-20-20 Rule"
                content="Every 20 mins, look 20 feet away for 20 seconds. This prevents neck craning caused by focusing strictly on screens."
                colSpan="col-span-1 md:col-span-1"
                rowSpan="h-[300px] md:h-auto row-span-1 md:row-span-1"
                delay={0.45}
            />
        </div>
      </section>

      {/* ── TOOLBOX SECTION (FLEX ACCORDION) ────────────────────────────────── */}
      <ToolboxAccordion />

      {/* ── TIMELINE SECTION: DAY IN THE LIFE ───────────────────────────────── */}
      <section className="py-24 bg-[#EBEBE8] relative">
        <div className="max-w-5xl mx-auto px-6">
            <SectionHeading title="A Healthy Daily Routine" subtitle="Chronological Guide" />

            <div className="relative mt-20">
                {/* Central Line for desktop */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#745893]/20 -translate-x-1/2" />
                
                <TimelineItem 
                    time="07:00 AM" 
                    title="The Wake-Up Stretch" 
                    description="Before leaping out of bed, gently bring your knees to your chest to stretch the lower back. Roll to your side before sitting up to avoid spinal compression right in the morning." 
                    alignLeft={false} 
                />
                <TimelineItem 
                    time="11:30 AM" 
                    title="The Desk Reset" 
                    description="If you're desk-bound, stand up and walk around. Perform shoulder blade squeezes and chin tucks to counteract the modern 'forward-head' tech posture." 
                    alignLeft={true} 
                />
                <TimelineItem 
                    time="15:00 PM" 
                    title="Hydration & Alignment" 
                    description="Dehydrated spinal discs lose their cushioning capability. Drink water throughout the afternoon, and check your ergonomic chair settings." 
                    alignLeft={false} 
                />
                <TimelineItem 
                    time="22:00 PM" 
                    title="Optimal Sleeping Positions" 
                    description="Sleep on your back with a pillow under your knees, or on your side with a pillow between your legs. Avoid sleeping on your stomach, which twists the cervical spine." 
                    alignLeft={true} 
                />
            </div>
        </div>
      </section>

      {/* ── NEWSLETTER CTA ──────────────────────────────────────────────────── */}
      <NewsletterSection />

      <Footer />
    </div>
  )
}

// ── Shared Components ────────────────────────────────────────────────────────
function NewsletterSection() {
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
            <h2 className="text-white text-3xl sm:text-4xl md:text-[clamp(2.5rem,8vw,3.5rem)] leading-[1.2] uppercase max-w-5xl mb-8 md:mb-12">
                Start Your Journey to <br className="hidden sm:block" /> Pain-Free Mobility Today!
            </h2>

            <Link to="/appointment" className="bg-white text-[#745893] px-8 md:px-10 py-4 md:py-5 rounded-full flex items-center gap-3 font-medium text-sm transition-all hover:scale-105 hover:bg-[#F7F7F5] shadow-xl group">
                Book An Appointment
                <svg width="25" height="25" viewBox="0 0 20 20" fill="none" className="transition-transform group-hover:translate-x-1">
                    <path d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699" stroke="#745893" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </Link>
        </div>
    </section>
  )
}
