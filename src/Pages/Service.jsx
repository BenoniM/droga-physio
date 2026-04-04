import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import ServiceImg from '../assets/serv/ServiceImg.png'
import physioLogoFooter from '../assets/general/physioLogo2.svg'
import CtaBgImg from '../assets/about/cta_background.png'
import gsap from 'gsap'

// Import branch images
import BoleImg from '../assets/serv/Bole.jpg'
import KiloImg from '../assets/serv/4Kilo.jpg'
import KebenaImg from '../assets/serv/Kebena.jpg'
import LebuImg from '../assets/serv/Lebu.jpg'
import SummitImg from '../assets/serv/Summit.jpg'

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
    const [isInside, setIsInside] = useState(false)
    const [maskStyle, setMaskStyle] = useState('')

    // Hover state for branch cards
    const [hoveredBranchIdx, setHoveredBranchIdx] = useState(null)
    const [displayBranchIdx, setDisplayBranchIdx] = useState(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const cardRef = useRef(null)

    const services = [
        {
            title: "Pain Management and Relief",
            description: "Chronic Back and Neck Pain, Joint Pain (Shoulder, Knee, Hip), Headache and Migraine Relief."
        },
        {
            title: "Injury Rehabilitation",
            description: "Sports Injuries, Post-Surgical Rehabilitation, Work-Related Injuries, Motor Vehicle Accident Recovery."
        },
        {
            title: "Neurological Rehabilitation",
            description: "Regain strength, balance, and coordination to improve independence after a stroke, Specialized programs like LSVT BIG to improve mobility, balance, and quality of life, Maintain function, manage fatigue, and enhance mobility throughout the progression of neurological conditions, Address dizziness and unsteadiness caused by neurological issues to prevent falls and build confidence."
        },
        {
            title: "Strength and Conditioning",
            description: "Muscle Imbalance Correction, Core Strengthening, Pre- and Post-Natal Care."
        },
        {
            title: "Specialized Programs",
            description: "Arthritis Management, Balance and Fall Prevention, Vestibular Rehabilitation (for Vertigo), Posture Correction and Ergonomic Training."
        },
        {
            title: "Mobility and Movement Restoration",
            description: "Gait Analysis and Re-training, Restoring Range of Motion."
        },
        {
            title: "Gross Motor Skills Development",
            description: "Milestone Achievement: Helping infants and toddlers reach key motor milestones like rolling, sitting, crawling, and walking. Coordination and Balance: Improving skills for running, jumping, and playing safely with peers. Gait (Walking) Training: Correcting toe-walking, in-toeing, and other irregular walking patterns. Strength and Endurance Building: Building core and limb strength for daily activities and sports."
        },
        {
            title: "Neurodevelopmental Support",
            description: "Cerebral Palsy Management: Enhancing mobility, managing spasticity, and improving functional independence. Torticollis and Plagiocephaly: Using gentle stretching and positioning techniques to correct head tilt and flat head syndrome. Genetic Condition Support: (e.g., Down Syndrome) Improving low muscle tone, coordination, and motor planning. Brain and Spinal Cord Injury Rehab: Regaining movement and function through targeted exercises."
        },
        {
            title: "Rehabilitation and Injury Care",
            description: "Sports Injury Rehab: Safe return to play after sprains, strains, and growth plate injuries. Post-Surgical Recovery: Rehabilitation following procedures like fracture repairs or muscle lengthening. Bracing and Equipment Assessment: Recommending and training for orthotics, walkers, and other assistive devices."
        },
        {
            title: "Fine Motor and School Skills",
            description: "Handwriting Improvement: Developing pencil grip, letter formation, and writing endurance. Scissor Skills and Tool Use: Mastering the fine motor control needed for classroom and craft activities. Sensory Processing: Helping children who are over-responsive or under-responsive to sensory input (sounds, textures, movement) to better participate in daily life."
        },
        {
            title: "Activities of Daily Living (ADLs)",
            description: "Self-Care Independence: Building skills for dressing, feeding, and grooming. Organization and Executive Functioning: Strategies to improve planning, task initiation, and time management. Play Skills Development: Encouraging appropriate, imaginative, and interactive play."
        },
        {
            title: "Regulation and Behavior",
            description: "Emotional Regulation: Teaching children to identify feelings and use calming strategies effectively. Focus and Attention: Increasing engagement and task completion, especially for children with ADHD."
        }
    ]

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll, { passive: true })
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

    const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY })
    }



    const branches = [
        {
            name: "Bole Branch",
            image: BoleImg,
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
            image: KiloImg,
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
            image: KebenaImg,
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
            image: LebuImg,
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
            image: SummitImg,
            services: []
        }
    ]

    return (
        <div className="min-h-screen bg-[#F7F7F5] overflow-x-hidden" onMouseMove={handleMouseMove}>
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
                        Explore our range of specialized services <br /> designed to meet your unique needs
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
                            Explore our range of specialized services <br /> designed to meet your unique needs
                        </h1>
                    </div>
                </div>
            </section>

            {/* INTERACTIVE SERVICES SECTION */}
            <section className="bg-[#F7F7F5] py-10 px-24 flex flex-col items-center gap-8 overflow-hidden h-85">
                <div className="flex justify-between items-end w-full">
                    <h2 
                        key={activeServiceIndex + "-title"}
                        className="text-[#745893] text-[clamp(3rem,8vw,2rem)] leading-[1] tracking-tighter max-w-4xl animate-in fade-in slide-in-from-left-8 duration-700"
                    >
                        {services[activeServiceIndex].title.split(' and ').map((part, i, arr) => (
                            <span key={i}>
                                {part}
                                {i < arr.length - 1 && <> And </>}
                            </span>
                        ))}
                    </h2>

                    <div className="flex gap-4">
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

                <div className="flex justify-end w-full">
                    <p 
                        key={activeServiceIndex + "-desc"}
                        className="text-[#745893] text-sm md:text-base font-light max-w-2xl text-right leading-relaxed animate-in fade-in slide-in-from-right-8 duration-700"
                    >
                        {services[activeServiceIndex].description}
                    </p>
                </div>
            </section>

            {/* BRANCH SERVICES SECTION */}
            <section className="bg-[#F7F7F5] py-5 px-24 flex flex-col gap-12">
                <header className="flex justify-between items-center w-full">
                    <div className="flex-1 flex items-center gap-4 group">
                        <div className="flex items-center">
                            <div className="h-[1.25px] bg-[#745893] w-50"></div>
                            <div className="w-2 h-2 bg-[#745893] rotate-45 -mr-1"></div>
                        </div>
                        <h3 className="text-[#745893] font-medium tracking-[0.2em] uppercase text-xl whitespace-nowrap">
                            OUR SERVICES
                        </h3>
                    </div>
                    
                    <button className="flex items-center gap-3 bg-[#745893] text-[#F7F7F5] px-8 py-4 rounded-full font-medium transition-all hover:bg-[#5d3e78] group ml-12">
                        Book An Appointment
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="transition-transform group-hover:translate-x-1">
                            <path 
                                d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699" 
                                stroke="#F7F7F5" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                            />
                        </svg>
                    </button>
                </header>

                <div className="flex flex-col relative">
                    {/* Floating Hover Card */}
                    <div 
                        ref={cardRef}
                        className="fixed z-[100] pointer-events-none overflow-hidden rounded opacity-0 scale-0"
                        style={{
                            width: '320px',
                            height: '220px',
                            left: `${mousePos.x + 20}px`,
                            top: `${mousePos.y + 20}px`,
                        }}
                    >
                        {branches.map((branch, idx) => (
                            <img 
                                key={idx}
                                src={branch.image} 
                                alt={branch.name}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
                                    displayBranchIdx === idx 
                                        ? 'opacity-100 visible' 
                                        : 'opacity-0 invisible'
                                }`}
                            />
                        ))}
                    </div>

                    {branches.map((branch, idx) => (
                        <div 
                            key={idx} 
                            className="group border-b border-[#745893] py-12 first:border-t-0 cursor-pointer"
                            onMouseEnter={() => setHoveredBranchIdx(idx)}
                            onMouseLeave={() => setHoveredBranchIdx(null)}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-[#745893] text-[clamp(2rem,4vw,2rem)] tracking-tighter">
                                        {branch.name.includes('(Pediatric)') ? (
                                            <>
                                                {branch.name.split(' (')[0]}
                                                <span className="block text-xl font-light text-[#745893] tracking-normal -mt-2">
                                                    (Pediatric)
                                                </span>
                                            </>
                                        ) : (
                                            branch.name
                                        )}
                                    </h4>
                                </div>

                                <div className="flex flex-wrap md:justify-end gap-3 max-w-3xl">
                                    {branch.services.map((service, sIdx) => (
                                        <div 
                                            key={sIdx}
                                            className="px-6 py-2 rounded-full border border-[#333]/20 text-[#666] text-sm font-light transition-all hover:bg-[#745893]/5 hover:border-[#745893]/20"
                                        >
                                            {service.toUpperCase()}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
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

export default Service
