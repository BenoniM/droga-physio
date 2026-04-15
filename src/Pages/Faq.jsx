import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ServiceImg from '../assets/serv/IMG_3492.JPG'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CtaBgImg from '../assets/about/cta_background.png'
import { Plus, Minus } from 'lucide-react'

const BUBBLE_COUNT = 60

const baseSizes = Array.from({ length: BUBBLE_COUNT }, (_, i) => {
    return 300 * Math.pow(1 - i / BUBBLE_COUNT, 1.6)
})

function Faq() {
    const heroRef = useRef(null)
    const targetRef = useRef({ x: -1000, y: -1000 })
    const historyRef = useRef(Array(BUBBLE_COUNT).fill({ x: -1000, y: -1000 }))

    const [maskStyle, setMaskStyle] = useState('')
    const [isInside, setIsInside] = useState(false)
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
    const [activeIndex, setActiveIndex] = useState(0) // First one open by default
    const [scrollY, setScrollY] = useState(0)

    const faqs = [
        {
            question: "How can you help my problem?",
            answer: "We can help you by providing high quality physiotherapy care options by our expert physiotherapists. We use various therapeutic interventions to alleviate your pain and maximize your physical functionality. Such as; manual therapy, electrotherapy, therapeutic exercise and different therapeutic procedures. We implement highly evidence based therapy practice and high tech machineries."
        },
        {
            question: "How is your work process?",
            answer: "First you need to book via online or get registered in person for the physiotherapy evaluation. After in person registration pre medical checkup will be conducted by senior nurses. The nurse will check all your vital signs; take your previous medical and medication history. Then a physiotherapist will do the physical assessment, identify your physical illness cause and develop individualized therapy plan. Then the number of expected therapy follow up days and frequency will be decided. Then you start your therapy after you settle the payment."
        },
        {
            question: "Do you give home therapy service?",
            answer: "Currently No, We only have out patient service."
        },
        {
            question: "Do you have acupuncture service?",
            answer: "Yes we do have."
        },
        {
            question: "Do you give chiropractic service as well?",
            answer: "We don’t give chiropractic service but we manage efficiently all conditions that a chiropractor does. Like, we adjust the spine and peripheral joints and we rehabilitate beyond just an adjustment."
        },
        {
            question: "Do you have MRI service alongside?",
            answer: "No we don’t have but there are MRI centers nearby to our clinics."
        },
        {
            question: "Can I choose the gender of my therapist?( Male or Female)",
            answer: "Sure we have both female and male therapist and you can choose upon registration."
        }
    ]

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

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
                if (!isInside) setIsInside(true)
            } else {
                // Desktop Cursor Trail Logic
                historyRef.current.unshift({ x: targetRef.current.x, y: targetRef.current.y })
                if (historyRef.current.length > BUBBLE_COUNT) historyRef.current.pop()
                const maskGradients = baseSizes
                    .map((size, i) => {
                        const pos = historyRef.current[i] || historyRef.current[historyRef.current.length - 1]
                        return `radial-gradient(circle ${size / 2}px at ${pos.x}px ${pos.y}px, black 100%, transparent 100%)`
                    })
                    .reverse()
                    .join(',')
                setMaskStyle(maskGradients)
            }
            rafId = requestAnimationFrame(animate)
        }

        rafId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(rafId)
    }, [isResponsive, isInside])

    const handleMove = (e) => {
        const rect = heroRef.current.getBoundingClientRect()
        targetRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        }
    }

    const handleEnter = (e) => {
        const rect = heroRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        targetRef.current = { x, y }
        historyRef.current = Array(BUBBLE_COUNT).fill({ x, y })
        setIsInside(true)
    }

    const handleLeave = () => {
        setIsInside(false)
        targetRef.current = { x: -1000, y: -1000 }
        historyRef.current = Array(BUBBLE_COUNT).fill({ x: -1000, y: -1000 })
    }

    return (
        <div className="min-h-screen bg-[#F7F7F5] overflow-x-hidden">
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
            
            <section
                ref={heroRef}
                onPointerMove={handleMove}
                onPointerEnter={handleEnter}
                onPointerLeave={handleLeave}
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
                        className="max-w-6xl md:font-semibold text-[#F7F7F5] text-[clamp(1.8rem,5.5vw,3rem)] md:text-[clamp(2rem,5.5vw,4rem)] leading-[0.9] uppercase animate-fade-up"
                        style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
                    >
                        Have questions about our <br /> treatments, appointments? 
                    </h1>
                </div>

                {/* Top reveal layer — image on hover */}
                <div
                    className="pointer-events-none absolute inset-0 z-20"
                    style={{
                        display: isInside ? 'block' : 'none',
                        WebkitMaskImage: isResponsive ? 'url(#hero-mask)' : maskStyle,
                        maskImage: isResponsive ? 'url(#hero-mask)' : maskStyle,
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        WebkitMaskSize: isResponsive ? '100% 100%' : 'auto',
                        maskSize: isResponsive ? '100% 100%' : 'auto',
                    }}
                >
                    <img
                        src={ServiceImg}
                        alt="Services"
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
                            className="max-w-6xl md:font-semibold text-[#FFF200] text-[clamp(1.8rem,5.5vw,3rem)] md:text-[clamp(2rem,5.5vw,4rem)] leading-[0.9] uppercase animate-fade-up"
                            style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
                        >
                            Have questions about our <br /> treatments, appointments? 
                        </h1>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="bg-[#F7F7F5] py-24 px-10 md:px-24">
                <div className="flex flex-col gap-12 max-w-7xl mx-auto">
                    <header className="flex items-center gap-4 group">
                        <div className="flex items-center">
                            <div className="h-[1.25px] bg-[#745893] w-75"></div>
                            <div className="w-2 h-2 bg-[#745893] rotate-45 -mr-1"></div>
                        </div>
                        <h3 className="text-[#745893] font-medium tracking-[0.2em] uppercase text-xl whitespace-nowrap">
                            FAQ
                        </h3>
                    </header>

                    <h2 className="text-[#745893] font-['Compacta'] text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.85] uppercase -mt-4">
                        Frequently Asked Questions
                    </h2>

                    <div className="flex flex-col mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="border-b border-[#745893]/30 last:border-0 first:border-t first:border-[#745893]/30">
                                <button 
                                    onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                                    className="w-full flex justify-between items-center py-8 text-left group"
                                >
                                    <span className={`text-xl md:text-2xl font-light transition-colors duration-300 ${activeIndex === idx ? 'text-[#745893]' : 'text-[#745893]/90 hover:text-[#745893]'}`}>
                                        {faq.question}
                                    </span>
                                    <div className={`w-8 h-8 rounded-full border border-[#745893]/30 flex items-center justify-center transition-all duration-300 ${activeIndex === idx ? 'bg-[#745893] border-[#745893]' : 'group-hover:border-[#745893]'}`}>
                                        {activeIndex === idx ? (
                                            <svg width="2" height="17" viewBox="0 0 2 17" fill="none" className="rotate-270">
                                            <path
                                                d="M0.703125 0.703125L0.703125 10.5469M0.703125 15.7031L0.703125 13.3594"
                                                stroke="#F7F7F5"
                                                strokeWidth="1.40625"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            </svg>
                                        ) : (
                                            <svg
                                                width="17"
                                                height="17"
                                                viewBox="0 0 17 17"
                                                fill="none"
                                                className="transition-transform duration-300 group-hover:rotate-90"
                                            >
                                            <path
                                                d="M0.703125 7.76562H10.5469M15.7031 7.76562H13.3594"
                                                stroke="#745893"
                                                strokeWidth="1.40625"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M8.20312 0.703125L8.20312 10.5469M8.20312 15.7031V13.3594"
                                                stroke="#745893"
                                                strokeWidth="1.40625"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            </svg>
                                        )}
                                    </div>
                                </button>
                                <div 
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${activeIndex === idx ? 'max-h-[500px] opacity-100 mb-8' : 'max-h-0 opacity-0'}`}
                                >
                                    <p className="text-[#745893]/70 text-lg leading-relaxed max-w-5xl font-light">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION SECTION */}
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

            {/* ========== FOOTER ========== */}
            <Footer />
        </div>
    )
}

export default Faq