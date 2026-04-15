import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AbtImg from '../assets/about/landingBg.jpg'
import AboutSectionImg from '../assets/about/photo_2026-04-14_13-30-05.jpg'
import StatImg1 from '../assets/about/photo_2026-04-14_13-29-56.jpg'
import StatImg2 from '../assets/home/IMG_3651.JPG'
import StatImg3 from '../assets/home/enh.png'
import StatImg4 from '../assets/home/photo_2026-03-27_11-04-18.jpg'
import CtaBgImg from '../assets/about/cta_background.png'
import NebiyouImg from '../assets/about/Nebiyou.JPG'
import EmnetImg from '../assets/about/Emnet.png'
import LewamImg from '../assets/about/Lewam.png'
import TesfaImg from '../assets/about/Tesfa.png'
import YaredImg from '../assets/about/Yared.png'
import KitaImg from '../assets/about/Kitachew.png'
import CustomerCentricImg from '../assets/about/photo_2026-04-14_14-01-25.jpg'
import CareImg from '../assets/about/photo_2026-04-14_14-02-17.jpg'

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
    const [activeIndex, setActiveIndex] = useState(0)
    const [valuesIndex, setValuesIndex] = useState(1)
    const [valuesTransitioning, setValuesTransitioning] = useState(true)
    const [transitioning, setTransitioning] = useState(true)
    const [currentAboutImg, setCurrentAboutImg] = useState(0)
    const sliderRef = useRef(null)
    const [isResponsive, setIsResponsive] = useState(window.innerWidth < 1024)

    // put these near the top of About() or above it
    const MISSION_IMG =
        "https://images.pexels.com/photos/9301297/pexels-photo-9301297.jpeg?cs=srgb&dl=pexels-mikhail-nilov-9301297.jpg&fm=jpg";

    const VISION_IMG =
        "https://images.pexels.com/photos/8550846/pexels-photo-8550846.jpeg?cs=srgb&dl=pexels-edmond-dantes-8550846.jpg&fm=jpg";

    // Automatic blobs for high-fidelity fluid motion
    // We use more points for better "stringiness"
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

    // SLOWER AUTO-INTERCHANGE
    useEffect(() => {
    const missionInterval = setInterval(() => {
        handleNextSlide();
    }, 5500); // slower than 3500

    const valuesInterval = setInterval(() => {
        if (window.innerWidth < 1024) {
        setValuesTransitioning(true);
        setValuesIndex(prev => prev + 1);
        }
    }, 4000);

    const aboutImgInterval = setInterval(() => {
        setCurrentAboutImg(prev => (prev + 1) % 3);
    }, 2500);

    return () => {
        clearInterval(missionInterval);
        clearInterval(valuesInterval);
        clearInterval(aboutImgInterval);
    };
    }, []);

    // Scroll tracking for Navbar
    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Animation loop
    useEffect(() => {
        let rafId
        const el = heroRef.current

        const animate = () => {
            const rect = el?.getBoundingClientRect()
            const width = rect?.width || window.innerWidth
            const height = rect?.height || 600

            if (isResponsive) {
                // HIGH FIDELITY MOBILE MODE: SVG Metaballs
                blobsRef.current.forEach((blob, i) => {
                    const circleEl = document.getElementById(`blob-${i}`)
                    if (!circleEl) return

                    // Automatic movement
                    blob.x += blob.vx
                    blob.y += blob.vy

                    // Bounce off boundaries (soft bounce)
                    if (blob.x < -50 || blob.x > width + 50) blob.vx *= -1
                    if (blob.y < -50 || blob.y > height + 50) blob.vy *= -1

                    // Subtle organic oscillation
                    blob.x += Math.sin(Date.now() * 0.0005 + i) * 0.4
                    blob.y += Math.cos(Date.now() * 0.0005 + i) * 0.4

                    // Apply to SVG element
                    circleEl.setAttribute('cx', blob.x)
                    circleEl.setAttribute('cy', blob.y)
                    circleEl.setAttribute('r', blob.r)
                })

                if (!isInside) setIsInside(true) // Force reveal on mobile
            } else {
                // ORIGINAL DESKTOP MODE: Cursor Trail
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
            }

            rafId = requestAnimationFrame(animate)
        }

        rafId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(rafId)
    }, [isResponsive, isInside])

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

    // Leave hero: hide trail (but keep active on mobile)
    const handleLeave = () => {
        if (window.innerWidth < 768) return;
        setIsInside(false)
        targetRef.current = { x: -1000, y: -1000 }
        historyRef.current = Array(BUBBLE_COUNT).fill({ x: -1000, y: -1000 })
    }

    const handleNextSlide = () => {
        setTransitioning(true);
        setActiveIndex(prev => prev + 1);
    };

    const handlePrevSlide = () => {
        setTransitioning(true);
        setActiveIndex(prev => prev - 1);
    };

    // LOOP SNAP TIMING — match the slower transition
    useEffect(() => {
    if (activeIndex === 2) {
        const timer = setTimeout(() => {
        setTransitioning(false);
        setActiveIndex(0);
        }, 1400); // was 1000
        return () => clearTimeout(timer);
    }

    if (activeIndex === -1) {
        const timer = setTimeout(() => {
        setTransitioning(false);
        setActiveIndex(1);
        }, 1400); // was 1000
        return () => clearTimeout(timer);
    }
    }, [activeIndex]);

    // Values Slider Loop Check
    useEffect(() => {
        if (valuesIndex === 4) {
            // After the slide animation to the clone (Integrity) completes
            const timer = setTimeout(() => {
                setValuesTransitioning(false); // Disable transition for snap
                setValuesIndex(1); // Snap back to original Integrity
            }, 5000);
            return () => clearTimeout(timer);
        }
        if (valuesIndex === 0) {
            // Handle going backward (if user adds buttons)
            const timer = setTimeout(() => {
                setValuesTransitioning(false);
                setValuesIndex(3);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [valuesIndex]);

    // Auto-motion for mobile
    useEffect(() => {
        const checkMobile = () => {
            if (window.innerWidth < 768) {
                setIsInside(true);
                // Initialize target to center if it's the first time
                if (targetRef.current.x === -1000) {
                    const x = window.innerWidth / 2;
                    const y = window.innerHeight * 0.375; // 75vh center
                    targetRef.current = { x, y };
                    historyRef.current = Array(BUBBLE_COUNT).fill({ x, y });
                }
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        let autoMotionRaf;
        let time = 0;

        const moveAuto = () => {
            if (window.innerWidth < 768) {
                time += 0.005;
                const rect = heroRef.current?.getBoundingClientRect();
                if (rect) {
                    const cx = rect.width / 2;
                    const cy = rect.height / 2;
                    // Fluid, non-linear motion using multiple sines
                    targetRef.current = {
                        x: cx + Math.sin(time) * cx * 0.6 + Math.cos(time * 0.8) * cx * 0.2,
                        y: cy + Math.cos(time * 0.7) * cy * 0.5 + Math.sin(time * 1.2) * cy * 0.1
                    };
                }
            }
            autoMotionRaf = requestAnimationFrame(moveAuto);
        };

        moveAuto();

        return () => {
            window.removeEventListener('resize', checkMobile);
            cancelAnimationFrame(autoMotionRaf);
        };
    }, []);

    const EXPERTS_DATA = [
        {
            name: "Nebiyou Tesfaye Haile",
            title: "Physiotherapy Director",
            image: NebiyouImg,
            branch: "Headquarters",
            isHead: true,
        },
        {
            name: "Lewam Mamo Tewabe",
            title: "Bole Physiotherapy Clinic Branch Manager",
            image: LewamImg,
            branch: "Bole Branch"
        },
        {
            name: "Emnet Worku Sime",
            title: "4 Kilo Physiotherapy Clinic Branch Manager",
            image: EmnetImg,
            branch: "4 Kilo Branch"
        },
        {
            name: "Tesfaye Woyesa Fano",
            title: "Qebena Physiotherapy Clinic Branch Manager",
            image: TesfaImg,
            branch: "Qebena Branch"
        },
        {
            name: "Yared Tekelemariam Megersa",
            title: "Lebu Physiotherapy Clinic Branch Manager",
            image: YaredImg,
            branch: "Lebu Branch"
        },
        {
            name: "Kitachew H/Michael Tessema",
            title: "Summit Physiotherapy Clinic Branch Manager",
            image: KitaImg,
            branch: "Summit Branch"
        }
    ]

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
                                <circle
                                    key={i}
                                    id={`blob-${i}`}
                                    r="80"
                                    fill="white"
                                />
                            ))}
                        </g>
                    </mask>
                </defs>
            </svg>

            {/* HERO DESCRIPTION SECTION */}
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
                        className="max-w-6xl text-[#F7F7F5] text-[clamp(1.8rem,5.5vw,3rem)] md:text-[clamp(2.5rem,5.5vw,4rem)] md:font-semibold leading-[0.9] uppercase animate-fade-up"
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
                        WebkitMaskImage: isResponsive ? 'url(#hero-mask)' : maskStyle,
                        maskImage: isResponsive ? 'url(#hero-mask)' : maskStyle,
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        WebkitMaskSize: isResponsive ? '100% 100%' : 'auto',
                        maskSize: isResponsive ? '100% 100%' : 'auto',
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
                            className="max-w-6xl md:font-semibold text-[#FFF200] text-[clamp(1.8rem,5.5vw,3rem)] md:text-[clamp(2.5rem,5.5vw,4rem)] leading-[0.9] uppercase animate-fade-up"
                            style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
                        >
                            Discover our mission to provide exceptional <br /> physiotherapy services
                        </h1>
                    </div>
                </div>
            </section>

            {/* ABOUT US DESCRIPTION SECTION */}
            <section className="bg-[#745893] w-full px-6 md:px-12 lg:px-24 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
                    {/* Left Content */}
                    <div className="flex h-full flex-col justify-between">
                        <div className="flex flex-col gap-4 md:gap-6">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                    <div className="h-[1.25px] bg-[#F7F7F5] w-35 sm:w-35 md:w-32 lg:w-48"></div>
                                    <div className="w-2 h-2 bg-[#F7F7F5] rotate-45 -mr-1"></div>
                                </div>

                                <span className="text-[#FFF200] font-medium tracking-widest text-base md:text-lg uppercase whitespace-nowrap">About Us</span>
                            </div>

                            <h2 className="text-[#F7F7F5] text-3xl sm:text-4xl md:text-5xl lg:text-[3.2vw] xl:text-[3.8rem] leading-[1.1] uppercase mt-2 md:-mt-4">
                                Droga <br/> Physiotherapy
                            </h2>
                        </div>

                        <div className="flex flex-col gap-6 md:gap-8 mt-6 md:mt-4 text-sm md:text-base">
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
                        {[AboutSectionImg, StatImg3, StatImg1].map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`About Us Carousel ${idx + 1}`}
                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${currentAboutImg === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                                    } group-hover:scale-105`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ACCREDITATION SECTION */}
            <section className="bg-[#745893] w-full px-6 md:px-12 lg:px-24 py-16 md:py-24 border-t border-[#F7F7F5]/10">
                <div className="flex flex-col gap-8 md:gap-10">
                    {/* Top Content (Right Aligned on Desktop) */}
                    <div className="flex flex-col items-end text-right gap-4 md:gap-6">
                        <div className="flex items-center gap-4 w-full">
                            <div className="flex items-center flex-1 justify-end gap-3 md:gap-4">
                                <span className="text-[#FFF200] font-medium tracking-widest text-base md:text-lg uppercase whitespace-nowrap">Accreditation</span>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-[#F7F7F5] rotate-45 -mr-1"></div>
                                    <div className="h-[1.25px] bg-[#F7F7F5] w-12 sm:w-20 md:w-32 lg:w-48"></div>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3vw] xl:text-[3rem] leading-[1.1] md:leading-[0.9] uppercase max-w-4xl">
                            Our Accreditation. Nationally
                        </h2>

                        <p className="text-[#F7F7F5]/90 text-sm md:text-base leading-relaxed max-w-2xl">
                            We take pride in being nationally accredited for maintaining the highest standards of physiotherapy care and patient satisfaction.
                        </p>
                    </div>

                    {/* Stats Gallery Grid - Inspired Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-4 md:gap-6 w-full h-auto lg:h-[500px]">

                        {/* Item 1 - Left Tall (Row Span 2) */}
                        <div className="relative group overflow-hidden h-[300px] md:h-[400px] lg:h-full lg:row-span-2 rounded-2xl md:rounded-3xl shadow-2xl">
                            <img
                                src={StatImg1}
                                alt="Treatment"
                                className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-[#745893]/30 group-hover:bg-black/50 transition-colors duration-300"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <StatValue value="90%" />
                                <span className="text-[#FFF200] font-bold tracking-[0.2em] text-base md:text-lg uppercase mt-2">
                                    Treatment
                                </span>
                            </div>
                        </div>

                        {/* Item 2 - Top Middle */}
                        <div className="relative group overflow-hidden h-[250px] md:h-[300px] lg:h-full rounded-2xl md:rounded-3xl shadow-2xl">
                            <img
                                src={StatImg2}
                                alt="Service"
                                className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-[#745893]/30 group-hover:bg-black/50 transition-colors duration-300"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <StatValue value="15+" />
                                <span className="text-[#FFF200] font-bold tracking-[0.2em] text-base md:text-lg uppercase mt-2">
                                    Service
                                </span>
                            </div>
                        </div>

                        {/* Item 3 - Top Right */}
                        <div className="relative group overflow-hidden h-[250px] md:h-[300px] lg:h-full rounded-2xl md:rounded-3xl shadow-2xl">
                            <img
                                src={StatImg3}
                                alt="Therapist"
                                className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-[#745893]/30 group-hover:bg-black/50 transition-colors duration-300"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <StatValue value="40+" />
                                <span className="text-[#FFF200] font-bold tracking-[0.2em] text-base md:text-lg uppercase mt-2">
                                    Therapist
                                </span>
                            </div>
                        </div>

                        {/* Item 4 - Bottom Wide (Col Span 2) */}
                        <div className="relative group overflow-hidden h-[250px] md:h-[300px] lg:h-full lg:col-span-2 rounded-2xl md:rounded-3xl shadow-2xl">
                            <img
                                src={StatImg4}
                                alt="Facilities"
                                className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-[#745893]/30 group-hover:bg-black/50 transition-colors duration-300"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <StatValue value="80%" />
                                <span className="text-[#FFF200] font-bold tracking-[0.2em] text-base md:text-lg uppercase mt-2">
                                    Facilities
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* COMBINED MISSION & VISION SLIDER SECTION */}
            <section ref={sliderRef} className="relative w-full h-[70vh] md:h-[50vh] min-h-[500px] md:min-h-[450px] overflow-hidden">
            <div
                className={`flex flex-col md:flex-row h-[300%] md:h-full w-full md:w-[300%] ${
                transitioning ? 'transition-transform duration-[1400ms] ease-in-out' : 'transition-none'
                }`}
                style={{
                transform:
                    window.innerWidth < 768
                    ? `translateY(${-activeIndex * (100 / 3.01)}%)`
                    : `translateX(${-activeIndex * (100 / 3.01)}%)`,
                }}
            >
                {/* MISSION VIEW */}
                <div className="relative h-1/3 md:h-full w-full md:w-1/3 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                    src={MISSION_IMG}
                    alt="Mission BG"
                    className="w-full h-full object-cover scale-110"
                    />
                    <div className="absolute inset-0 bg-black/55"></div>
                </div>

                <div className="relative z-20 px-6 md:px-12 lg:px-24 h-full flex flex-col justify-center gap-4 md:gap-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
                    <div className="flex flex-col">
                        <span className="text-[#FFF200] font-medium tracking-[0.2em] text-xs md:text-sm uppercase mb-2">
                        Service / Purpose
                        </span>
                        <h2 className="text-white text-[3.5rem] sm:text-[4.5rem] md:text-[clamp(3.5rem,8vw,5rem)] leading-[1.0] uppercase opacity-90">
                        Our<br />Mission
                        </h2>
                    </div>
                    </div>

                    <div className="relative flex flex-col gap-2 mt-4 max-w-xl self-end">
                    <div className="h-[1px] bg-[#FFF200] w-full"></div>
                    <div className="flex justify-end mt-4">
                        <p className="text-white/90 text-sm md:text-lg leading-[1.6] text-right">
                        Continuing to be quality driven clinic in Ethiopia while providing high quality, effective, and affordable services.
                        </p>
                    </div>
                    </div>
                </div>
                </div>

                {/* VISION VIEW */}
                <div className="relative h-1/3 md:h-full w-full md:w-1/3 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                    src={VISION_IMG}
                    alt="Vision BG"
                    className="w-full h-full object-cover scale-110"
                    />
                    <div className="absolute inset-0 bg-black/55"></div>
                </div>

                <div className="relative z-20 px-6 md:px-12 lg:px-24 h-full flex flex-col justify-center gap-4 md:gap-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
                    <div className="flex justify-start order-2 md:order-1"></div>

                    <div className="flex flex-col order-1 md:order-2 items-end w-full md:w-auto">
                        <span className="text-[#FFF200] font-medium tracking-[0.2em] text-xs md:text-sm uppercase mb-2 text-right">
                        Service / Future Focus
                        </span>
                        <h2 className="text-white text-[3.5rem] sm:text-[4.5rem] md:text-[clamp(4.5rem,10vw,5rem)] leading-[1.0] uppercase text-right opacity-90">
                        Our<br />Vision
                        </h2>
                    </div>
                    </div>

                    <div className="relative flex flex-col gap-2 mt-4 max-w-2xl">
                    <div className="h-[1px] bg-[#FFF200] w-full"></div>
                    <div className="flex justify-start mt-4">
                        <p className="text-white/90 text-sm md:text-lg leading-[1.6] text-left">
                        To be Ethiopia’s leading physiotherapy and rehabilitation provider, transforming lives through excellence in movement and care.
                        </p>
                    </div>
                    </div>
                </div>
                </div>

                {/* CLONE MISSION VIEW */}
                <div className="relative h-1/3 md:h-full w-full md:w-1/3 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                    src={MISSION_IMG}
                    alt="Mission BG"
                    className="w-full h-full object-cover scale-110"
                    />
                    <div className="absolute inset-0 bg-black/55"></div>
                </div>

                <div className="relative z-20 px-6 md:px-12 lg:px-24 h-full flex flex-col justify-center gap-4 md:gap-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
                    <div className="flex flex-col">
                        <span className="text-[#FFF200] font-medium tracking-[0.2em] text-xs md:text-sm uppercase mb-2">
                        Service / Purpose
                        </span>
                        <h2 className="text-white text-[3.5rem] sm:text-[4.5rem] md:text-[clamp(3.5rem,8vw,5rem)] leading-[1.0] uppercase opacity-90">
                        Our<br />Mission
                        </h2>
                    </div>
                    </div>

                    <div className="relative flex flex-col gap-2 mt-4 max-w-xl self-end">
                    <div className="h-[1px] bg-[#FFF200] w-full"></div>
                    <div className="flex justify-end mt-4">
                        <p className="text-white/90 text-sm md:text-lg leading-[1.6] text-right">
                        We deliver evidence-based, patient-centered physiotherapy services that restore function, reduce pain, and enhance quality of life through skilled professionals and innovative rehabilitation solutions.
                        </p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </section>

            {/* OUR VALUES SECTION */}
            <section className="relative w-full h-auto py-16 md:py-24 overflow-hidden flex flex-col bg-gradient-to-b from-[#745893] from-65% to-[#F7F7F5] to-10% duration-700">
                {/* Branding Header Area */}
                <div className="flex-none h-auto flex flex-col items-center justify-center mb-10 md:mb-16 px-6">
                    <div className="flex items-center gap-4 mb-4 md:mb-6">
                        <div className="h-[1px] bg-white/40 w-12 md:w-20" />
                        <span className="text-white/80 font-medium tracking-[0.3em] text-[10px] md:text-xs uppercase">
                            Core Beliefs
                        </span>
                        <div className="h-[1px] bg-white/40 w-12 md:w-20" />
                    </div>
                    <h2 className="text-white text-4xl sm:text-5xl md:text-[clamp(3rem,10vw,3rem)] leading-none uppercase text-center font-bold">
                        Our Values
                    </h2>
                </div>

                {/* Values Scroll/Grid Area */}
                <div className="flex-1 flex flex-col items-center w-full overflow-hidden">
                    <div
                        className={`w-full flex md:grid md:grid-cols-3 md:max-w-7xl md:mx-auto gap-8 md:gap-12 px-0 md:px-12 ${valuesTransitioning ? 'transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1)' : 'transition-none'} md:transform-none`}
                        style={{
                            transform: isResponsive && window.innerWidth < 1024
                                ? `translateX(calc(10vw - (${valuesIndex} * (80vw + 32px))))`
                                : 'none'
                        }}
                    >
                        {/* Card 3 Clone (For infinite loop peeking) */}
                        <div className="flex flex-col gap-6 min-w-[80vw] md:min-w-0 w-full md:hidden snap-center group/card">
                            <div className="aspect-square md:aspect-square md:max-w-[300px] mx-auto w-full overflow-hidden rounded-2xl shadow-2xl relative">
                                <img
                                    src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800"
                                    alt="Care Clone"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20"></div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <h3 className="text-[#745893] text-xl md:text-2xl uppercase font-bold">
                                    03 / Care
                                </h3>
                                <div className="text-[#745893]/80 text-base md:text-lg leading-relaxed font-regular">
                                    <p className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#FFF200] rounded-full"></span>
                                        Care For Us (Employee and Terms)
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#FFF200] rounded-full"></span>
                                        Care For Community
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#FFF200] rounded-full"></span>
                                        Care For The Planet
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 1 */}
                        <div className="flex flex-col gap-6 min-w-[80vw] md:min-w-0 w-full snap-center group/card">
                            <div className="aspect-square md:aspect-square md:max-w-[300px] mx-auto w-full overflow-hidden rounded-2xl shadow-2xl relative">
                                <img
                                    src={AbtImg}
                                    alt="Integrity"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/0 transition-colors duration-500"></div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <h3 className="text-[#745893] md:group-hover:text-[#745893] transition-colors duration-300 text-xl md:text-2xl uppercase font-bold">
                                    01 / Integrity
                                </h3>
                                <div className="text-[#745893]/80 md:text-[#745893]/80 text-base md:text-lg leading-relaxed font-regular">
                                    <p className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#FFF200] rounded-full"></span>
                                        Do The Right Thing
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#FFF200] rounded-full"></span>
                                        Walk The Talk
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#FFF200] rounded-full"></span>
                                        Foster Sound Decisions
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="flex flex-col gap-6 min-w-[80vw] md:min-w-0 w-full snap-center group/card">
                            <div className="aspect-square md:aspect-square md:max-w-[300px] mx-auto w-full overflow-hidden rounded-2xl shadow-2xl relative">
                                <img
                                    src={CustomerCentricImg}
                                    alt="Customer Centric"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/0 transition-colors duration-500"></div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <h3 className="text-[#745893] md:group-hover:text-[#745893] transition-colors duration-300 text-xl md:text-2xl uppercase font-bold">
                                    02 / Customer Centric
                                </h3>
                                <div className="text-[#745893]/80 md:text-[#745893]/80 text-base md:text-lg leading-relaxed font-regular">
                                    <p className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#FFF200] rounded-full"></span>
                                        Listen First
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#FFF200] rounded-full"></span>
                                        Go The Extra Mile
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#FFF200] rounded-full"></span>
                                        Innovate To Add Value
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="flex flex-col gap-6 min-w-[80vw] md:min-w-0 w-full snap-center group/card">
                            <div className="aspect-square md:aspect-square md:max-w-[300px] mx-auto w-full overflow-hidden rounded-2xl shadow-2xl relative">
                                <img
                                    src={CareImg}
                                    alt="Care"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/0 transition-colors duration-500"></div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <h3 className="text-[#745893] md:group-hover:text-[#745893] transition-colors duration-300 text-xl md:text-2xl uppercase font-bold">
                                    03 / Care
                                </h3>
                                <div className="text-[#745893]/80 md:text-[#745893]/80 text-base md:text-lg leading-relaxed font-regular">
                                    <p className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#FFF200] rounded-full"></span>
                                        Care For Us (Employee and Terms)
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#FFF200] rounded-full"></span>
                                        Care For Community
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#FFF200] rounded-full"></span>
                                        Care For The Planet
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 1 Clone (Infinite Loop) */}
                        <div className="flex flex-col gap-6 min-w-[80vw] md:min-w-0 w-full md:hidden snap-center group/card">
                            <div className="aspect-square md:aspect-square md:max-w-[300px] mx-auto w-full overflow-hidden rounded-2xl shadow-2xl relative">
                                <img
                                    src={AbtImg}
                                    alt="Integrity Clone"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20"></div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <h3 className="text-[#745893] text-xl md:text-2xl uppercase font-bold">
                                    01 / Integrity
                                </h3>
                                <div className="text-[#745893]/80 text-base md:text-lg leading-relaxed font-regular">
                                    <p className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#FFF200] rounded-full"></span>
                                        Do The Right Thing
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#FFF200] rounded-full"></span>
                                        Walk The Talk
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#FFF200] rounded-full"></span>
                                        Foster Sound Decisions
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Progress Dots */}
                    <div className="flex lg:hidden items-center gap-3 mt-10">
                        {[0, 1, 2].map((idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setValuesTransitioning(true);
                                    setValuesIndex(idx + 1);
                                }}
                                className={`h-1.5 transition-all duration-500 rounded-full ${valuesIndex === idx + 1 || (valuesIndex === 4 && idx === 0) || (valuesIndex === 0 && idx === 2) ? 'w-8 bg-[#745893]' : 'w-2 bg-[#745893]/30'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* OUR EXPERTS SECTION */}
            <section className="relative w-full py-5 bg-[#F7F7F5] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    {/* Section Header */}
                    <div className="flex flex-col items-center mb-5">
                        <div className="flex items-center gap-4 mb-2 animate-fade-in">
                            <div className="h-[1px] bg-[#745893]/30 w-12 md:w-20" />
                            <span className="text-[#745893] font-medium tracking-[0.3em] text-[10px] md:text-xs uppercase">
                                Professional Team
                            </span>
                            <div className="h-[1px] bg-[#745893]/30 w-12 md:w-20" />
                        </div>
                        <h2 className="text-[#745893] text-4xl sm:text-5xl md:text-6xl font-bold uppercase text-center leading-none">
                            Our Experts
                        </h2>
                    </div>

                    {/* Department Head - Top Featured Card */}
                    <div className="w-full flex justify-center mb-12">
                        {EXPERTS_DATA.filter(e => e.isHead).map((head, idx) => (
                            <div
                                key={idx}
                                className="group flex flex-col animate-fade-in-up w-full max-w-[280px] md:max-w-[320px] mx-auto text-center items-center"
                            >
                                <div className="aspect-[3/4] overflow-hidden rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl relative group w-full">
                                    <img
                                        src={head.image}
                                        alt={head.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#745893]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-4 md:p-6">
                                        <span className="text-[#FFF200] font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] text-center">
                                            {head.title}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-1 px-1 mt-2">
                                    <h4 className="text-[#745893] text-center font-bold text-lg md:text-xl uppercase group-hover:text-[#745893]/70 transition-colors">
                                        {head.name}
                                    </h4>
                                    <div className="flex items-center gap-2 justify-center">
                                        <div className="w-3 md:w-4 h-[1px] bg-[#FFF200]" />
                                        <span className="text-[#745893]/60 text-xs md:text-sm font-bold uppercase tracking-widest">
                                            Physiotherapy Director
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Branch Leads - 2 Column Mobile, 5 Column Desktop */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8 group/grid max-w-6xl mx-auto">
                        {EXPERTS_DATA.filter(e => !e.isHead).map((lead, idx) => (
                            <div
                                key={idx}
                                className={`group flex flex-col gap-3 animate-fade-in-up ${idx === 4 ? 'col-span-2 lg:col-span-1 flex flex-col items-center justify-center' : ''}`}
                                style={{ animationDelay: `${0.1 * idx}s` }}
                            >
                                <div className={`aspect-[3/4] overflow-hidden rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl relative group ${idx === 4 ? 'w-[calc(50%-8px)] md:w-[calc(50%-16px)] lg:w-full' : 'w-full'}`}>
                                    <img
                                        src={lead.image}
                                        alt={lead.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#745893]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4 md:p-6">
                                        <span className="text-[#FFF200] font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
                                            {lead.title}
                                        </span>
                                    </div>
                                </div>
                                <div className={`flex flex-col items-center gap-1 px-1 ${idx === 4 ? 'items-center w-[calc(50%-8px)] md:w-[calc(50%-16px)] lg:w-full' : ''}`}>
                                    <h4 className="text-[#745893] text-center font-bold text-sm md:text-base uppercase group-hover:text-[#745893]/70 transition-colors">
                                        {lead.name}
                                    </h4>
                                    <div className={`flex items-center gap-2 ${idx === 4 ? 'justify-center' : ''}`}>
                                        <div className="w-3 md:w-4 h-[1px] bg-[#FFF200]" />
                                        <span className="text-[#745893]/60 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                                            {lead.branch}
                                        </span>
                                    </div>
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

export default About