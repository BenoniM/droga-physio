import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AbtImg from '../assets/about/AbtImg.png'
import AboutSectionImg from '../assets/home/IMG_3651.JPG'
import StatImg1 from '../assets/home/IMG_3575.JPG'
import StatImg2 from '../assets/home/IMG_3651.JPG'
import StatImg3 from '../assets/home/enh.png'
import StatImg4 from '../assets/home/photo_2026-03-27_11-04-18.jpg'
import CtaBgImg from '../assets/about/cta_background.png'

import gsap from 'gsap'

const StatValue = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(0)
    const elementRef = useRef(null)
    const hasAnimated = useRef(false)

    // Extract numerical value and suffix (e.g., '90%' -> 90, '%')
    const match = value.match(/(\d+)(.*)/)
    const target = match ? parseInt(match[1]) : 0
    const suffix = match ? match[2] : ''

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true
                    const obj = { val: 0 }
                    gsap.to(obj, {
                        val: target,
                        duration: 2,
                        ease: "power2.out",
                        onUpdate: () => setDisplayValue(Math.floor(obj.val))
                    })
                }
            },
            { threshold: 0.5 }
        )

        if (elementRef.current) observer.observe(elementRef.current)
        return () => observer.disconnect()
    }, [target])

    return (
        <span ref={elementRef} className="text-white font-bold text-6xl drop-shadow-lg">
            {displayValue}{suffix}
        </span>
    )
}

// High count for a seamless, continuous comet tail
const BUBBLE_COUNT = 60

// Pre-compute the sizes for the trail
const baseSizes = Array.from({ length: BUBBLE_COUNT }, (_, i) => {
    return 300 * Math.pow(1 - i / BUBBLE_COUNT, 1.6)
})

function About() {
    const heroRef = useRef(null)
    const targetRef = useRef({ x: -1000, y: -1000 })
    const historyRef = useRef(Array(BUBBLE_COUNT).fill({ x: -1000, y: -1000 }))

    const [scrollY, setScrollY] = useState(0)
    const [maskStyle, setMaskStyle] = useState('')
    const [isInside, setIsInside] = useState(false)
    const [isMission, setIsMission] = useState(true)
    const [currentAboutImg, setCurrentAboutImg] = useState(0)
    const sliderRef = useRef(null)

    useEffect(() => {
        const missionInterval = setInterval(() => {
            setIsMission(prev => !prev);
        }, 2500)
        
        const aboutImgInterval = setInterval(() => {
            setCurrentAboutImg(prev => (prev + 1) % 3);
        }, 2500)

        return () => {
            clearInterval(missionInterval)
            clearInterval(aboutImgInterval)
        }
    }, [])

    // Scroll tracking for Navbar
    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Animation loop
    useEffect(() => {
        let rafId

        const animate = () => {
            // Add current cursor target to history
            historyRef.current.unshift({ x: targetRef.current.x, y: targetRef.current.y })

            // Cap history array size
            if (historyRef.current.length > BUBBLE_COUNT) {
                historyRef.current.pop()
            }

            // Create mask gradients
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

    // Cursor movement inside hero
    const handleMove = (e) => {
        const el = heroRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()

        targetRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        }
    }

    // Enter hero: snap trail to cursor
    const handleEnter = (e) => {
        const el = heroRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        targetRef.current = { x, y }
        historyRef.current = Array(BUBBLE_COUNT).fill({ x, y })
        setIsInside(true)
    }

    // Leave hero: hide trail
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

            {/* HERO DESCRIPTION SECTION */}
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
                        Discover our mission to provide exceptional <br /> physiotherapy services
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
                        src={AbtImg}
                        alt="About"
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
                            Discover our mission to provide exceptional <br /> physiotherapy services
                        </h1>
                    </div>
                </div>
            </section>

            {/* ABOUT US DESCRIPTION SECTION */}
            <section className="bg-[#745893] w-full px-24 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="flex h-full flex-col justify-between">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                    <div className="h-[1.25px] bg-[#F7F7F5] w-50"></div>
                                    <div className="w-2 h-2 bg-[#F7F7F5] rotate-45 -mr-1"></div>
                                </div>

                                <span className="text-[#FFF200] font-medium tracking-widest text-lg uppercase">About Us</span>
                            </div>

                            <h2 className="text-[#F7F7F5] text-[clamp(3.5rem,7vw,3rem)] leading-[1] uppercase -mt-4">
                                Droga Physiotherapy
                            </h2>
                        </div>

                        <div className="flex flex-col gap-8 mt-4">
                            <p className="text-[#F7F7F5]/90 leading-relaxed max-w-2xl">
                                Droga Physiotherapy Specialty Clinic was established in 2015 in Addis Ababa by a group of health care professionals, who have an interest in developing the scientific back ground of physiotherapy in Ethiopia.
                            </p>
                            <p className="text-[#F7F7F5]/90 leading-relaxed max-w-2xl">
                                We are striving to increase the number of branches in the capital and regional cities. Currently the clinic is serving the community with its two branches located in Addis Ababa Arat kilo next to tourist hotel and Around the former Japan Embassy.
                            </p>
                        </div>
                    </div>

                    {/* Right Image Container - Carousel with Fade Effects */}
                    <div className="relative group overflow-hidden rounded-sm shadow-2xl aspect-[4/3]">
                        {[AboutSectionImg, StatImg1, StatImg3].map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`About Us Carousel ${idx + 1}`}
                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                                    currentAboutImg === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                                } group-hover:scale-105`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ACCREDITATION SECTION */}
            <section className="bg-[#745893] w-full px-24 py-24 border-t border-[#F7F7F5]/10">
                <div className="flex flex-col gap-10">
                    {/* Top Content (Right Aligned) */}
                    <div className="flex flex-col items-end text-right gap-6">
                        <div className="flex items-center gap-4 w-full">
                            <div className="flex items-center flex-1 justify-end gap-4">
                                <span className="text-[#FFF200] font-medium tracking-widest text-lg uppercase">Accreditation</span>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-[#F7F7F5] rotate-45 -mr-1"></div>
                                    <div className="h-[1.25px] bg-[#F7F7F5] w-50"></div>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-white text-[clamp(2.5rem,6vw,3rem)] leading-[0.9] uppercase max-w-4xl">
                            Our Accreditation. Nationally
                        </h2>

                        <p className="text-[#F7F7F5]/90 leading-relaxed max-w-2xl">
                            We take pride in being nationally accredited for maintaining the highest standards of physiotherapy care and patient satisfaction.
                        </p>
                    </div>

                    {/* Stats Gallery Grid - Inspired Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-6 w-full h-auto lg:h-[500px]">
                        
                        {/* Item 1 - Left Tall (Row Span 2) */}
                        <div className="relative group overflow-hidden h-[400px] lg:h-full lg:row-span-2 rounded-3xl shadow-2xl">
                            <img
                                src={StatImg1}
                                alt="Treatment"
                                className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-[#745893]/30 group-hover:bg-black/50 transition-colors duration-300"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <StatValue value="90%" />
                                <span className="text-[#FFF200] font-bold tracking-[0.2em] text-lg uppercase mt-2">
                                    Treatment
                                </span>
                            </div>
                        </div>

                        {/* Item 2 - Top Middle */}
                        <div className="relative group overflow-hidden h-[300px] lg:h-full rounded-3xl shadow-2xl">
                            <img
                                src={StatImg2}
                                alt="Service"
                                className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-[#745893]/30 group-hover:bg-black/50 transition-colors duration-300"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <StatValue value="15+" />
                                <span className="text-[#FFF200] font-bold tracking-[0.2em] text-lg uppercase mt-2">
                                    Service
                                </span>
                            </div>
                        </div>

                        {/* Item 3 - Top Right */}
                        <div className="relative group overflow-hidden h-[300px] lg:h-full rounded-3xl shadow-2xl">
                            <img
                                src={StatImg3}
                                alt="Therapist"
                                className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-[#745893]/30 group-hover:bg-black/50 transition-colors duration-300"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <StatValue value="40+" />
                                <span className="text-[#FFF200] font-bold tracking-[0.2em] text-lg uppercase mt-2">
                                    Therapist
                                </span>
                            </div>
                        </div>

                        {/* Item 4 - Bottom Wide (Col Span 2) */}
                        <div className="relative group overflow-hidden h-[300px] lg:h-full lg:col-span-2 rounded-3xl shadow-2xl">
                            <img
                                src={StatImg4}
                                alt="Facilities"
                                className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-[#745893]/30 group-hover:bg-black/50 transition-colors duration-300"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <StatValue value="80%" />
                                <span className="text-[#FFF200] font-bold tracking-[0.2em] text-lg uppercase mt-2">
                                    Facilities
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* COMBINED MISSION & VISION SLIDER SECTION */}
            <section ref={sliderRef} className="relative w-full h-[50vh] min-h-[450px] overflow-hidden">
                <div
                    className="flex w-[200%] h-full transition-transform duration-1000 ease-in-out"
                    style={{ transform: `translateX(${isMission ? '0%' : '-50%'})` }}
                >
                    {/* MISSION VIEW */}
                    <div className="relative w-1/2 h-full overflow-hidden">
                        <div className="absolute inset-0">
                            <img src={StatImg2} alt="Mission BG" className="w-full h-full object-cover blur-[8px] scale-110" />
                            <div className="absolute inset-0 bg-[#745893]/50"></div>
                        </div>
                        <div className="relative z-20 px-24 h-full flex flex-col justify-center gap-6">
                            <div className="flex justify-between items-end">
                                <h2 className="text-white text-[clamp(3.5rem,8vw,7rem)] leading-[1.0] uppercase opacity-90 tracking-tighter">
                                    Our<br />Mission
                                </h2>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setIsMission(false)}
                                        className="mb-1 mr-[-8px] cursor-pointer group"
                                        aria-label="Next"
                                    >
                                        <svg width="48" height="48" viewBox="0 0 20 20" fill="none" className="transition-transform group-hover:translate-x-1">
                                            <path d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699" stroke="#FFF200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="relative flex flex-col gap-2 mt-4">
                                
                                <div className="h-[1px] bg-[#FFF200] w-full"></div>
                                <div className="flex justify-end mt-4">
                                    <p className="text-white/90 text-lg leading-[1.6] max-w-xl text-right">
                                        Continuing to be quality driven clinic in Ethiopia while providing high quality, effective, and affordable services.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* VISION VIEW */}
                    <div className="relative w-1/2 h-full overflow-hidden">
                        <div className="absolute inset-0">
                            <img src={StatImg1} alt="Vision BG" className="w-full h-full object-cover blur-[8px] scale-110" />
                            <div className="absolute inset-0 bg-[#745893]/50"></div>
                        </div>
                        <div className="relative z-20 px-24 h-full flex flex-col justify-center gap-6">
                            <div className="flex justify-between items-end">
                                <div className="flex justify-start">
                                    <button
                                        onClick={() => setIsMission(true)}
                                        className="mb-1 ml-[-8px] cursor-pointer group"
                                        aria-label="Previous"
                                    >
                                        <svg width="48" height="48" viewBox="0 0 20 20" fill="none" className="rotate-180 transition-transform group-hover:-translate-x-1">
                                            <path d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699" stroke="#FFF200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <h2 className="text-white text-[clamp(4.5rem,10vw,7rem)] leading-[1.0] uppercase text-right opacity-90 tracking-tighter">
                                    Our<br />Vision
                                </h2>
                            </div>

                            <div className="relative flex flex-col gap-2 mt-4">
                                <div className="h-[1px] bg-[#FFF200] w-full"></div>
                                <div className="flex justify-start mt-4">
                                    <p className="text-white/90 text-lg leading-[1.6] max-w-2xl text-left">
                                        Develop scientifically advanced physiotherapy and rehabilitation center in Ethiopia. We aspire to be the leading physiotherapy clinic in the nation and beyond in 2025 GC.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* OUR VALUES SECTION */}
            <section className="relative w-full h-screen overflow-hidden flex flex-col bg-gradient-to-b from-[#745893] from-65% to-[#F7F7F5] to-5%">
                {/* Branding Header Area (Top portion of purple) */}
                <div className="flex-none h-[25%] flex items-center justify-center">
                    <h2 className="text-white text-[clamp(3rem,10vw,3rem)] leading-none uppercase">
                        Our Values
                    </h2>
                </div>

                {/* Values Grid Area (Centered across the split) */}
                <div className="flex-1 flex items-center justify-center px-12 pb-12">
                    <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">

                        {/* Card 1 */}
                        <div className="flex flex-col gap-5 max-w-[350px] w-full">
                            <div className="aspect-square w-full overflow-hidden rounded-sm shadow-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" 
                                    alt="Commitment" 
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <h3 className="text-[#745893] text-2xl uppercase">
                                    01 / Integrity
                                </h3>
                                <p className="text-[#745893] text-base leading-relaxed line-clamp-4">
                                    <p>Do The Right Thing</p>
                                    <p>Walk The Talk</p>
                                    <p>Foster Sound Decisions</p>
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="flex flex-col gap-5 max-w-[350px] w-full">
                            <div className="aspect-square w-full overflow-hidden rounded-sm shadow-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800" 
                                    alt="Integrity" 
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <h3 className="text-[#745893] text-2xl uppercase">
                                    02 / Customer Centric
                                </h3>
                                <p className="text-[#745893] text-base leading-relaxed line-clamp-4">
                                    <p>Listen First</p>
                                    <p>Go The Extra Mile</p>
                                    <p>Innovate To Add Value</p>
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="flex flex-col gap-5 max-w-[350px] w-full">
                            <div className="aspect-square w-full overflow-hidden rounded-sm shadow-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800" 
                                    alt="Commitment" 
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <h3 className="text-[#745893] text-2xl uppercase">
                                    03 / Care
                                </h3>
                                <p className="text-[#745893] text-base leading-relaxed line-clamp-4">
                                    <p>Care For Us (Employee and Terms)</p>
                                    <p>Care For Community</p>
                                    <p>Care For The Planet</p>
                                </p>
                            </div>
                        </div>

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

                    <Link to="/appointment" className="bg-white text-[#745893] px-10 py-5 rounded-full flex items-center gap-3 font-medium text-sm transition-all hover:scale-105 hover:bg-[#F7F7F5] shadow-xl group">
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

export default About