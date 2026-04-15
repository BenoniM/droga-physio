import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ServiceImg from '../assets/serv/ServiceImg.png'
import CtaBgImg from '../assets/about/cta_background.png'
import gsap from 'gsap'

// Import 12 specialized service images
import Serv1 from '../assets/serv/IMG_3638.jpg'
import Serv2 from '../assets/serv/IMG_3640.JPG'
import Serv3 from '../assets/serv/IMG_3660.JPG'
import Serv4 from '../assets/serv/anthony-soberal-IVXtVwMRJY0-unsplash.jpg'
import Serv5 from '../assets/serv/chidy-young-a-Ml4ndeqos-unsplash.jpg'
import Serv6 from '../assets/serv/Gemini_Generated_Image_ez5a9yez5a9yez5a.png'
import Serv7 from '../assets/serv/nexa-black-UK8S5JAf6XE-unsplash.jpg'
import Serv8 from '../assets/serv/photo_2026-03-27_09-28-57.jpg'
import Serv9 from '../assets/serv/photo_2026-03-27_11-05-13.jpg'
import Serv10 from '../assets/serv/tobias-nii-kwatei-quartey-eGdGkZAI6h4-unsplash.jpg'
import Serv11 from '../assets/serv/valdhy-mbemba-aFpoiwITRr4-unsplash.jpg'
import Serv12 from '../assets/serv/zyanya-bmo-wGuuU0nRYiE-unsplash.jpg'

const BUBBLE_COUNT = 60

const baseSizes = Array.from({ length: BUBBLE_COUNT }, (_, i) => {
    return 300 * Math.pow(1 - i / BUBBLE_COUNT, 1.6)
})

function Service() {
    const heroRef = useRef(null)
    const targetRef = useRef({ x: -1000, y: -1000 })
    const historyRef = useRef(Array(BUBBLE_COUNT).fill({ x: -1000, y: -1000 }))

    const [scrollY, setScrollY] = useState(0)
    const [activeServiceIndex, setActiveServiceIndex] = useState(0)
    const [activeLocationServiceIdx, setActiveLocationServiceIdx] = useState(0)
    const [locationTransitioning, setLocationTransitioning] = useState(false)
    const locationTransitioningRef = useRef(false)
    const [isInside, setIsInside] = useState(false)
    const [maskStyle, setMaskStyle] = useState('')
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

    // Hover state for branch cards
    const [hoveredBranchIdx, setHoveredBranchIdx] = useState(null)
    const [displayBranchIdx, setDisplayBranchIdx] = useState(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const cardRef = useRef(null)

    const services = [
        {
            title: "Pain Management and Relief",
            description: "Chronic Back and Neck Pain, Joint Pain (Shoulder, Knee, Hip), Headache and Migraine Relief.",
            image: Serv1
        },
        {
            title: "Injury Rehabilitation",
            description: "Sports Injuries, Post-Surgical Rehabilitation, Work-Related Injuries, Motor Vehicle Accident Recovery.",
            image: Serv2
        },
        {
            title: "Neurological Rehabilitation",
            description: "Regain strength, balance, and coordination to improve independence after a stroke.",
            image: Serv3
        },
        {
            title: "Strength and Conditioning",
            description: "Muscle Imbalance Correction, Core Strengthening, Pre- and Post-Natal Care.",
            image: Serv4
        },
        {
            title: "Specialized Programs",
            description: "Arthritis Management, Balance and Fall Prevention, Vestibular Rehabilitation (for Vertigo).",
            image: Serv5
        },
        {
            title: "Mobility and Movement Restoration",
            description: "Gait Analysis and Re-training, Restoring Range of Motion.",
            image: Serv6
        },
        {
            title: "Gross Motor Skills Development",
            description: "Milestone Achievement: Helping infants and toddlers reach key motor milestones.",
            image: Serv7
        },
        {
            title: "Neuro Developmental Support",
            description: "Cerebral Palsy Management, Torticollis and Plagiocephaly, Genetic Condition Support.",
            image: Serv8
        },
        {
            title: "Rehabilitation and Injury Care",
            description: "Sports Injury Rehab, Post-Surgical Recovery, Bracing and Equipment Assessment.",
            image: Serv9
        },
        {
            title: "Fine Motor and School Skills",
            description: "Handwriting Improvement, Scissor Skills and Tool Use, Sensory Processing.",
            image: Serv10
        },
        {
            title: "Activities of Daily Living (ADLs)",
            description: "Self-Care Independence, Organization and Executive Functioning, Play Skills Development.",
            image: Serv11
        },
        {
            title: "Regulation and Behavior",
            description: "Emotional Regulation, Focus and Attention, ADHD support.",
            image: Serv12
        }
    ]

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll, { passive: true })
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

    useEffect(() => {
        if (!cardRef.current) return;

        if (hoveredBranchIdx !== null) {
            if (displayBranchIdx !== null && displayBranchIdx !== hoveredBranchIdx) {
                // Shrink then grow for switching
                gsap.to(cardRef.current, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.45,
                    ease: "power2.inOut",
                    onComplete: () => {
                        setDisplayBranchIdx(hoveredBranchIdx);
                        gsap.to(cardRef.current, {
                            scale: 1,
                            opacity: 1,
                            duration: 0.55,
                            ease: "back.out(1.2)"
                        });
                    }
                });
            } else if (displayBranchIdx === null) {
                // Just grow for first entrance
                setDisplayBranchIdx(hoveredBranchIdx);
                gsap.fromTo(cardRef.current,
                    { scale: 0, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 0.3,
                        ease: "back.out(1.5)"
                    }
                );
            }
        } else {
            // Shrink to disappear
            gsap.to(cardRef.current, {
                scale: 0,
                opacity: 0,
                duration: 0.4,
                ease: "power2.inOut",
                onComplete: () => setDisplayBranchIdx(null)
            });
        }
    }, [hoveredBranchIdx]);

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

    const nextService = () => {
        setActiveServiceIndex((prev) => (prev + 1) % services.length)
    }

    const prevService = () => {
        setActiveServiceIndex((prev) => (prev - 1 + services.length) % services.length)
    }

    const nextLocationService = () => {
        if (locationTransitioningRef.current) return;
        locationTransitioningRef.current = true;
        setLocationTransitioning(true);
        setActiveLocationServiceIdx((prev) => (prev + 1) % services.length);
        setTimeout(() => {
            locationTransitioningRef.current = false;
            setLocationTransitioning(false);
        }, 800);
    }

    const prevLocationService = () => {
        if (locationTransitioningRef.current) return;
        locationTransitioningRef.current = true;
        setLocationTransitioning(true);
        setActiveLocationServiceIdx((prev) => (prev - 1 + services.length) % services.length);
        setTimeout(() => {
            locationTransitioningRef.current = false;
            setLocationTransitioning(false);
        }, 800);
    }

    // Auto-Play Feature - Stable Ref-based implementation
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!locationTransitioningRef.current) {
                setActiveLocationServiceIdx((prev) => (prev + 1) % services.length);
            }
        }, 3500);

        return () => clearInterval(intervalId);
    }, [services.length]);

    const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY })
    }



    const branches = [
        {
            name: "Bole Branch",
            services: [
                "Mobility and Movement Restoration",
                "Strength and Conditioning",
                "Injury Rehabilitation",
                "Specialized Programs",
                "Neurological Rehabilitation",
                "Pain Management and Relief"
            ]
        },
        {
            name: "4 Kilo Branch",
            services: [
                "Mobility and Movement Restoration",
                "Strength and Conditioning",
                "Injury Rehabilitation",
                "Specialized Programs",
                "Neurological Rehabilitation",
                "Pain Management and Relief"
            ]
        },
        {
            name: "Kebena Branch (Pediatric)",
            services: [
                "Gross Motor Skills Development",
                "Neurodevelopmental Support",
                "Rehabilitation and Injury Care",
                "Fine Motor and School Skills",
                "Activities of Daily Living (ADLs)",
                "Regulation and Behavior"
            ]
        },
        {
            name: "Lebu Branch",
            services: [
                "Mobility and Movement Restoration",
                "Strength and Conditioning",
                "Injury Rehabilitation",
                "Specialized Programs",
                "Neurological Rehabilitation",
                "Pain Management and Relief"
            ]
        },
        {
            name: "Summit Branch",
            services: []
        }
    ]

    return (
        <div className="min-h-screen bg-[#F7F7F5] overflow-x-hidden" onMouseMove={handleMouseMove}>
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
                        className="max-w-6xl md:font-semibold text-[#F7F7F5] text-[clamp(1.8rem,5.5vw,3rem)] md:text-[clamp(3.5rem,5.5vw,3rem)] leading-[0.9] uppercase animate-fade-up"
                        style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
                    >
                        Explore our range of specialized services <br /> designed to meet your unique needs
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
                            className="max-w-6xl md:font-semibold text-[#FFF200] text-[clamp(1.8rem,5.5vw,3rem)] md:text-[clamp(3.5rem,5.5vw,3rem)] leading-[0.9] uppercase animate-fade-up"
                            style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
                        >
                            Explore our range of specialized services <br /> designed to meet your unique needs
                        </h1>
                    </div>
                </div>
            </section>

            {/* INTERACTIVE SERVICES SECTION */}
            <section className="bg-[#F7F7F5] py-12 md:py-20 px-6 md:px-24 flex flex-col items-center gap-8 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-8">
                    <h2
                        key={activeServiceIndex + "-title"}
                        className="text-[#745893] text-[clamp(1.5rem,6vw,2.5rem)] leading-[1.1] max-w-4xl animate-in fade-in slide-in-from-left-8 duration-700 font-semibold"
                    >
                        {services[activeServiceIndex].title.split(' and ').map((part, i, arr) => (
                            <span key={i}>
                                {part}
                                {i < arr.length - 1 && <span> And </span>}
                            </span>
                        ))}
                    </h2>

                    <div className="flex gap-4 self-end md:self-auto">
                        <button
                            onClick={prevService}
                            className="w-16 h-16 rounded-full bg-[#745893] flex items-center justify-center group transition-all hover:scale-110 active:scale-95"
                        >
                            <svg width="32" height="32" viewBox="0 0 20 20" fill="none" className="rotate-180">
                                <path
                                    d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699"
                                    stroke="#FFF200"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={nextService}
                            className="w-16 h-16 rounded-full bg-[#745893] flex items-center justify-center group transition-all hover:scale-110 active:scale-95"
                        >
                            <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699"
                                    stroke="#FFF200"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="w-full h-[2px] bg-[#FFF200]"></div>

                <div className="flex justify-start md:justify-end w-full">
                    <p
                        key={activeServiceIndex + "-desc"}
                        className="text-[#745893] text-base md:text-lg font-light max-w-2xl text-left md:text-right leading-relaxed animate-in fade-in slide-in-from-right-8 duration-700"
                    >
                        {services[activeServiceIndex].description}
                    </p>
                </div>
            </section>

            {/* BRANCH SERVICES SECTION - INFINITE 3D COVERFLOW */}
            <section className="bg-[#745893] py-2 md:py-4 px-6 md:px-12 overflow-hidden relative flex flex-col items-center justify-center min-h-[85vh] md:min-h-[80vh]">
                <div className="flex flex-col items-center gap-0 mb-2">
                    <h3 className="text-white text-2xl md:text-3xl font-semibold uppercase leading-tight">Our Services</h3>
                </div>

                {/* ── THE COVERFLOW STACK ────────────────────────────────────────── */}
                <div
                    className="relative w-full max-w-[1280px] h-[300px] md:h-[270px] flex items-center justify-center mx-auto"
                    style={{ perspective: '1200px' }}
                >
                    {services.map((service, idx) => {
                        let offset = idx - activeLocationServiceIdx;
                        const total = services.length;

                        // Circular Offset Logic for Infinite Loop
                        if (offset > total / 2) offset -= total;
                        if (offset < -total / 2) offset += total;

                        const absOffset = Math.abs(offset);
                        const isActive = idx === activeLocationServiceIdx;

                        // Hide far-away items for cleaner visual
                        const isVisible = absOffset <= 2;

                        const xPos = offset * (isResponsive ? 180 : 320); 
                        const zPos = -absOffset * (isResponsive ? 160 : 250);
                        const rotateY = offset * -35; 
                        const opacity = isVisible ? 1 - (absOffset * 0.45) : 0;

                        return (
                            <div
                                key={idx}
                                onClick={() => setActiveLocationServiceIdx(idx)}
                                className={`absolute top-2/3 left-1/2 w-[240px] md:w-[400px] h-[260px] md:h-[320px] rounded-[2.5rem] overflow-hidden cursor-pointer transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'} ${isActive ? 'shadow-[0_20px_40px_-15px_rgba(255,242,0,0.3)] z-50' : 'shadow-2xl'}`}
                                style={{
                                    transform: `translate3d(-50%, -50%, 0) translateX(${xPos}px) translateZ(${zPos}px) rotateY(${rotateY}deg) `,
                                    zIndex: 50 - Math.round(absOffset * 10),
                                    opacity: opacity,
                                    visibility: isVisible ? 'visible' : 'hidden',
                                    willChange: 'transform, opacity'
                                }}
                            >
                                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                {/* Info on Active Card */}
                                <div className={`absolute inset-0 p-6 md:p-10 flex flex-col justify-end transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                    <span className="text-[#FFF200] font-bold text-4xl md:text-6xl mb-2 outline-text opacity-80">
                                        {(idx + 1).toString().padStart(2, '0')}
                                    </span>
                                    <h4 className="text-white text-xl md:text-3xl font-bold Capitalize tracking-wide leading-tight">
                                        {service.title}
                                    </h4>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── DETAILS PANEL ───────────────────────────── */}
                <div className="relative w-full max-w-4xl mt-25 flex flex-col items-center text-center z-50">
                    <div className="flex flex-col items-center gap-1 animate-in fade-in slide-in-from-bottom-8 duration-700" key={activeLocationServiceIdx}>
                        <p className="text-white/60 text-lg md:text-xl font-light italic max-w-2xl leading-relaxed min-h-[4rem] flex items-center justify-center">
                            {services[activeLocationServiceIdx].description}
                        </p>

                        <div className="flex flex-wrap justify-center gap-3 mt-4">
                            <span className="text-[#FFF200] uppercase text-[10px] tracking-widest font-bold w-full mb-2">Available At:</span>
                            {branches.filter(b => b.services.includes(services[activeLocationServiceIdx].title)).map((branch, bIdx) => (
                                <div key={bIdx} className="px-5 py-2 rounded-full border border-white/20 bg-white/5 text-white/80 text-sm font-medium backdrop-blur-sm">
                                    {branch.name}
                                </div>
                            ))}
                            {branches.filter(b => b.services.includes(services[activeLocationServiceIdx].title)).length === 0 && (
                                <span className="text-white/30 italic text-sm">Consultation at all branches.</span>
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-8 mt-4">
                        <button
                            onClick={prevLocationService}
                            className="bg-white/10 hover:bg-[#FFF200] w-10 h-10 rounded-full flex items-center justify-center group transition-all"
                            aria-label="Previous Service"
                        >
                            <svg width="25" height="25" viewBox="0 0 20 20" fill="none" className="rotate-180">
                                <path
                                    d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699"
                                    stroke="#FFF200"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        <div className="flex gap-2">
                            {services.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveLocationServiceIdx(idx)}
                                    className={`h-1 transition-all duration-300 rounded-full ${activeLocationServiceIdx === idx ? 'w-10 bg-[#FFF200]' : 'w-2 bg-white/20'}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextLocationService}
                            className="bg-white/10 hover:bg-[#FFF200] w-10 h-10 rounded-full flex items-center justify-center group transition-all"
                            aria-label="Next Service"
                        >
                            <svg width="25" height="25" viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699"
                                    stroke="#FFF200"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
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

export default Service
