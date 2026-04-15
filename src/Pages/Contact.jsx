import React, { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import gsap from 'gsap'

// Import branch images
import BoleImg from '../assets/contact/Bole.jpg'
import KiloImg from '../assets/contact/4Kilo.jpg'
import KebenaImg from '../assets/contact/Kebena.jpg'
import LebuImg from '../assets/contact/Lebu.jpg'
import SummitImg from '../assets/contact/Summit.jpg'

export default function Contact() {
  const [scrollY, setScrollY] = useState(0)
  const editorRef = useRef(null)
  
  // Hover state for branch cards
  const [hoveredBranchIdx, setHoveredBranchIdx] = useState(null)
  const [displayBranchIdx, setDisplayBranchIdx] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

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

  const handleFormat = (e, command) => {
    e.preventDefault(); // Prevent focus loss from editor
    if (command === 'createLink') {
      const url = prompt('Enter link URL:');
      if (url) document.execCommand(command, false, url);
    } else if (command === 'insertImage') {
      const url = prompt('Enter image URL:');
      if (url) document.execCommand(command, false, url);
    } else {
      document.execCommand(command, false, null);
    }
  }

  const locations = [
    {
      name: "Arat Kilo",
      address: "Arat kilo Infront of Tourist Hotel",
      leadDoctor: "Emnet Worku Sime",
      phone: "+251115578906 / +251965757526",
      image: KiloImg
    },
    {
      name: "Bole",
      address: "Bole Next to Japan Embassy",
      leadDoctor: "Lewam Mamo Tewab",
      phone: "+251965757523 / +251116687006",
      image: BoleImg
    },
    {
      name: "Lebu Varnero",
      address: "Lebu Varnero Infront of Chanoly Noodles",
      leadDoctor: "Yared Tekelemariam Megersa",
      phone: "+251935999777",
      image: LebuImg
    },
    {
      name: "Bel Air Kebena",
      address: "Droga Pediatric physiotherapy center",
      leadDoctor: "Tesfaye Woyesa Fano",
      phone: "+251940332122",
      image: KebenaImg
    },
    {
      name: "Summit",
      address: "Summit Safeway area",
      leadDoctor: "Kitachew H/Michael Tessema",
      phone: "+251965757523",
      image: SummitImg
    }
  ]

  return (
    <div className="min-h-screen bg-white font-['Delight'] overflow-x-hidden text-[#1A1A1A]" onMouseMove={handleMouseMove}>
      <div className="w-full fixed top-0 z-200 transition-all duration-300">
        <Navbar scrollY={scrollY} />
      </div>

      <div className="pt-24 md:pt-32 pb-16 md:pb-24 px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto min-h-screen relative">
        {/* Floating Hover Card */}
        <div 
            ref={cardRef}
            className="fixed z-[100] pointer-events-none overflow-hidden rounded opacity-0 scale-0 hidden lg:block"
            style={{
                width: '320px',
                height: '220px',
                left: `${mousePos.x + 20}px`,
                top: `${mousePos.y + 20}px`,
            }}
        >
            {locations.map((loc, idx) => (
                <img 
                    key={idx}
                    src={loc.image} 
                    alt={loc.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
                        displayBranchIdx === idx 
                            ? 'opacity-100 visible' 
                            : 'opacity-0 invisible'
                    }`}
                />
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-12 xl:gap-28 mt-8 md:mt-12">

          {/* ── Left COLUMN: CONTACT FORM ───────────────────────────────────── */}
          <div className="flex flex-col xl:pl-10 mt-6 md:mt-8 lg:mt-0">
            <form className="w-full flex flex-col pt-2" onSubmit={(e) => e.preventDefault()}>
              
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full pb-3 mb-6 md:mb-10 text-[16px] md:text-[17px] border-b border-[#D1CBD8] placeholder-[#A29CA8] text-[#333] outline-none focus:border-[#745893] transition-colors bg-transparent font-light"
              />
              
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full pb-3 mb-6 md:mb-10 text-[16px] md:text-[17px] border-b border-[#D1CBD8] placeholder-[#A29CA8] text-[#333] outline-none focus:border-[#745893] transition-colors bg-transparent font-light"
              />
              
              <input 
                type="text" 
                placeholder="Phone (Optional)" 
                className="w-full pb-3 mb-6 md:mb-10 text-[16px] md:text-[17px] border-b border-[#D1CBD8] placeholder-[#A29CA8] text-[#333] outline-none focus:border-[#745893] transition-colors bg-transparent font-light"
              />
              
              <input 
                type="text" 
                placeholder="Subject" 
                className="w-full pb-3 mb-8 md:mb-12 text-[16px] md:text-[17px] border-b border-[#D1CBD8] placeholder-[#A29CA8] text-[#333] outline-none focus:border-[#745893] transition-colors bg-transparent font-light"
              />

              {/* Rich Text Editor Functional */}
              <div className="w-full border border-[#D1CBD8] rounded-md mb-8 md:mb-10 overflow-hidden bg-white focus-within:border-[#745893] transition-colors">
                <div className="border-b border-[#D1CBD8] px-4 md:px-5 py-2.5 md:py-3 flex items-center gap-4 text-gray-500 bg-[#FCF7FD] overflow-x-auto no-scrollbar">
                  <button onMouseDown={(e) => handleFormat(e, 'bold')} type="button" className="hover:text-[#745893] transition-colors p-1" title="Bold">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>
                  </button>
                  <button onMouseDown={(e) => handleFormat(e, 'italic')} type="button" className="hover:text-[#745893] transition-colors p-1" title="Italic">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>
                  </button>
                  <button onMouseDown={(e) => handleFormat(e, 'insertUnorderedList')} type="button" className="hover:text-[#745893] transition-colors p-1" title="Bullet List">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                  </button>
                  <button onMouseDown={(e) => handleFormat(e, 'createLink')} type="button" className="hover:text-[#745893] transition-colors p-1" title="Link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                  </button>
                  <button onMouseDown={(e) => handleFormat(e, 'insertImage')} type="button" className="hover:text-[#745893] transition-colors p-1" title="Image">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  </button>
                </div>
                <div 
                  ref={editorRef}
                  contentEditable
                  data-placeholder="Write Your Message"
                  className="w-full p-4 md:p-5 outline-none bg-transparent font-sans text-[16px] md:text-[17px] text-[#333] min-h-[150px] md:min-h-[180px] cursor-text empty:before:content-[attr(data-placeholder)] empty:before:text-[#A29CA8]"
                ></div>
              </div>

              {/* Submit Button */}
              <div className="mt-2">
                <button type="submit" className="bg-[#FFF200] text-black font-semibold text-[14px] md:text-[15px] px-8 py-3.5 md:py-4 rounded-full flex items-center justify-center gap-3 hover:scale-[1.03] active:scale-95 transition-all duration-300 w-full sm:w-auto inline-flex shadow-sm">
                  Send Message
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>

            </form>
          </div>

          {/* ── Right COLUMN: INFO & LOCATIONS ──────────────────────────────── */}
          <div className="flex flex-col">
            {/* Header Area */}
            <div className="mb-10 md:mb-5">
              <div className="flex items-center gap-0 mb-6">
                <div className="relative flex items-center">
                  <div className="h-[1px] bg-[#745893] w-24 md:w-56"></div>
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#745893] absolute right-0 translate-x-1/2"></div>
                </div>
                <span className="text-[#745893] text-sm md:text-lg font-medium tracking-[0.1em] uppercase ml-6">
                  CONTACT
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-[1.6rem] xl:text-[2rem] font-medium leading-[1.3] text-[#222]">
                Ready To Take The First Step Toward Better Health? Contact Us Today To Book An Appointment.
              </h1>
            </div>

            {/* Locations List */}
            <div className="flex flex-col border-t border-[#745893]/10">
              {locations.map((loc, i) => (
                <div 
                  key={i} 
                  className="group border-b border-[#745893]/10 py-8 lg:py-10 transition-colors hover:bg-[#745893]/[0.02]"
                  onMouseEnter={() => setHoveredBranchIdx(i)}
                  onMouseLeave={() => setHoveredBranchIdx(null)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-[#745893] text-[clamp(1.5rem,3vw,2rem)]">
                        {loc.name}
                      </h3>
                      <p className="text-[#745893]/60 text-sm font-light max-w-sm">
                        {loc.address}
                      </p>
                      <p className="text-[#745893]/80 text-[13px] md:text-[14px] font-medium mt-1">
                        Lead: {loc.leadDoctor}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-[#745893] font-medium text-[13px] md:text-[15px]">
                      <div className="w-8 h-8 rounded-full bg-[#745893]/5 flex items-center justify-center shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                      <span className="tracking-wide">{loc.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
