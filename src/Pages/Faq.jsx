import { useEffect, useRef, useState } from 'react'
import ServiceImg from '../assets/serv/ServiceImg.png'
import Navbar from '../components/Navbar'
import physioLogoFooter from '../assets/general/physioLogo2.svg'
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

        const animate = () => {
            historyRef.current.unshift({ x: targetRef.current.x, y: targetRef.current.y })

            if (historyRef.current.length > BUBBLE_COUNT) {
                historyRef.current.pop()
            }

            const maskGradients = baseSizes
                .map((size, i) => {
                    const pos = historyRef.current[i] || historyRef.current[historyRef.current.length - 1]
                    return `radial-gradient(circle ${size / 2}px at ${pos.x}px ${pos.y}px, black 100%, transparent 100%)`
                })
                .reverse()
                .join(',')

            setMaskStyle(maskGradients)
            rafId = requestAnimationFrame(animate)
        }

        rafId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(rafId)
    }, [])

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
            <div className="fixed top-0 left-0 w-full z-50">
                <Navbar scrollY={scrollY} />
            </div>
            
            <section
                ref={heroRef}
                onPointerMove={handleMove}
                onPointerEnter={handleEnter}
                onPointerLeave={handleLeave}
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
                        className="max-w-6xl font-['Compacta'] text-[#FFF200] text-[clamp(2.6rem,5.5vw,5.8rem)] leading-[0.9] uppercase animate-fade-up"
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
                        WebkitMaskImage: maskStyle,
                        maskImage: maskStyle,
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
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
                            className="max-w-6xl font-['Compacta'] text-[#F7F7F5] text-[clamp(2.6rem,5.5vw,5.8rem)] leading-[0.9] uppercase animate-fade-up"
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
                                    <span className={`text-xl md:text-2xl font-light tracking-tight transition-colors duration-300 ${activeIndex === idx ? 'text-[#745893]' : 'text-[#745893]/90 hover:text-[#745893]'}`}>
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

            {/* ========== FOOTER ========== */}
            <footer className="relative bg-[#745893] text-white overflow-hidden px-6 md:px-16 lg:px-20 h-[75vh] flex flex-col">
    
                {/* Main Content */}
                <div className="flex flex-col justify-between">
    
                {/* Top Row */}
                <div className="flex flex-col lg:flex-row gap-50 mt-10">
    
                    {/* DROGA */}
                    <div className="font-['Compacta'] uppercase leading-[0.85] text-[clamp(5rem,14vw,50rem)] tracking-tight">
                    DROGA
                    </div>
    
                    {/* Right columns */}
                    <div className="flex gap-15 md:gap-20 lg:gap-30">
    
                    {/* Pages */}
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
    
                    {/* Companies */}
                    <div>
                        <h4 className="text-xl md:text-2xl mb-4">Companies</h4>
                        <div className="space-y-2 text-sm md:text-[15px] font-light">
                        <div className="cursor-pointer hover:text-white">Droga Pharma PLC</div>
                        <div className="cursor-pointer hover:text-white">EMA Import and Export Pvt.Ltd</div>
                        <div className="cursor-pointer hover:text-white">Trust Pharmaceutical Manufacturing PLC</div>
                        <div className="cursor-pointer hover:text-white">Draga Pharmacy</div>
                        </div>
                    </div>
    
                    {/* Contact */}
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
    
                        {/* YOUR ORIGINAL SVGs (UNCHANGED) */}
                        <div className="mt-4 flex items-center gap-3">
                        {[
                            { 
                            icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> 
                            },
                            { 
                            icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> 
                            },
                            { 
                            icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> 
                            },
                            { 
                            icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            }
                        ].map((item, i) => (
                            <div
                            key={i}
                            className="w-9 h-9 rounded-full border border-white/80 flex items-center justify-center hover:bg-white hover:text-[#745893] transition"
                            >
                            {item.icon}
                            </div>
                        ))}
                        </div>
                    </div>
    
                    </div>
                </div>
    
                {/* Bottom Row */}
                <div className="flex justify-between items-end mt-2">
    
                    <div className="font-['Compacta'] uppercase leading-[0.85] text-[clamp(5rem,14vw,50rem)] tracking-tight">
                    PHYSIOTHERAPY
                    </div>
    
                    <img src={physioLogoFooter} alt="Droga Physiotherapy" className="h-25 md:h-30" />
                </div>
    
                {/* Bottom line */}
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
        </div>
    )
}

export default Faq