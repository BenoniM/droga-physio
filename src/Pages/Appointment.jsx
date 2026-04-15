import React, { useState, useEffect, useRef } from 'react'
import GoogleMapReact from 'google-map-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import pinSvg from '../assets/appointment/Pin.svg'

export default function Appointment() {
  const [scrollY, setScrollY] = useState(0)
  const editorRef = useRef(null)
  
  const [mapZoom, setMapZoom] = useState(12)
  const [mapCenter, setMapCenter] = useState({ lat: 9.0054, lng: 38.7636 })
  const [activePin, setActivePin] = useState(null)
  const [mapType, setMapType] = useState('roadmap')

  const branches = [
    {
      id: "arat-kilo",
      name: "Arat Kilo Branch",
      rating: "4.8",
      users: "185",
      desc: "Infront of Tourist Hotel, Arat Kilo. Main center for routine physiotherapy.",
      lat: 9.0345, 
      lng: 38.7634
    },
    {
      id: "bole",
      name: "Around The Former Japan Embassy",
      rating: "5.0",
      users: "243",
      desc: "Our premium Bole branch located next to the Japan Embassy.",
      lat: 8.9961, 
      lng: 38.7891
    },
    {
      id: "lebu",
      name: "Lebu Varnero",
      rating: "4.9",
      users: "312",
      desc: "Lebu Varnero Infront of Chanoly Noodles. Specializing in sports recovery.",
      lat: 8.9554, 
      lng: 38.7303
    },
    {
      id: "bel-air",
      name: "Droga Pediatric Center",
      rating: "5.0",
      users: "420",
      desc: "From Addis View Hotel 200 meters. Dedicated to pediatric physiotherapy.",
      lat: 9.0416, 
      lng: 38.7753
    }
  ]

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Re-used formatting function from Contact for the rich text editor overlay
  const handleFormat = (e, command) => {
    e.preventDefault(); 
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

  return (
    <div className="min-h-screen bg-white overflow-x-hidden text-[#1A1A1A]">
      {/* Navbar exactly matching the Contact page tracking scroll */}
      <div className="w-full fixed top-0 z-200 transition-all duration-300">
        <Navbar scrollY={scrollY} />
      </div>

      <div className="pt-24 md:pt-32 pb-16 md:pb-24 px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-24 mt-8 md:mt-12">
          
          {/* ── LEFT COLUMN: BOOKING FORM ──────────────────────────────── */}
          <div className="flex flex-col xl:pr-6">
            
            <h1 className="text-2xl sm:text-3xl md:text-[2.2rem] lg:text-[2.6rem] xl:text-[2.8rem] font-medium leading-[1.3] text-[#111] mb-8 md:mb-12">
              Book Appointment
            </h1>

            <form className="w-full flex flex-col" onSubmit={(e) => e.preventDefault()}>
              
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full pb-3 mb-6 md:mb-10 text-[15px] xl:text-[17px] border-b border-[#E1DDE6] placeholder-[#A29CA8] text-[#333] outline-none focus:border-[#745893] transition-colors bg-transparent font-light"
              />
              
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full pb-3 mb-6 md:mb-10 text-[15px] xl:text-[17px] border-b border-[#E1DDE6] placeholder-[#A29CA8] text-[#333] outline-none focus:border-[#745893] transition-colors bg-transparent font-light"
              />
              
              <input 
                type="text" 
                placeholder="Phone (Optional)" 
                className="w-full pb-3 mb-6 md:mb-10 text-[15px] xl:text-[17px] border-b border-[#E1DDE6] placeholder-[#A29CA8] text-[#333] outline-none focus:border-[#745893] transition-colors bg-transparent font-light"
              />
              
              <div className="relative w-full mb-6 md:mb-10">
                <select className="w-full pb-3 text-[15px] xl:text-[17px] border-b border-[#E1DDE6] text-[#A29CA8] outline-none focus:border-[#745893] transition-colors bg-transparent font-light appearance-none cursor-pointer">
                  <option value="" disabled selected>Select Branch</option>
                  <option value="arat-kilo">Arat Kilo</option>
                  <option value="bole">Bole (Japan Embassy)</option>
                  <option value="lebu">Lebu Varnero</option>
                  <option value="bel-air">Bel Air Kebena</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>

              {/* Date Input with full border */}
              <input 
                type="date" 
                className="w-full p-3.5 mb-8 md:mb-12 text-[15px] xl:text-[17px] border border-[#E1DDE6] rounded-xl text-[#A29CA8] outline-none focus:border-[#745893] transition-colors bg-transparent font-light"
              />

              {/* Rich Text Editor */}
              <div className="w-full border border-[#E1DDE6] rounded-xl mb-8 md:mb-10 overflow-hidden bg-white focus-within:border-[#745893] transition-colors shadow-sm">
                <div className="border-b border-[#E1DDE6] px-4 md:px-5 py-2.5 md:py-3 flex items-center gap-4 md:gap-5 text-gray-500 bg-[#FAF7FB] overflow-x-auto no-scrollbar">
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
                  className="w-full p-4 md:p-5 outline-none bg-transparent font-sans text-[15px] text-[#333] min-h-[140px] md:min-h-[160px] cursor-text empty:before:content-[attr(data-placeholder)] empty:before:text-[#A29CA8]"
                ></div>
              </div>

              {/* Submit Button */}
              <div>
                <button type="submit" className="bg-[#FFF200] text-black font-semibold text-[13px] md:text-[13px] px-8 md:px-9 py-3.5 md:py-4 rounded-full flex items-center justify-center gap-3 hover:scale-[1.03] active:scale-95 transition-all w-full sm:w-[240px] shadow-sm">
                  Book An Appointment
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>

            </form>
          </div>


          {/* ── RIGHT COLUMN: INTERACTIVE MAP OVERLAY ────────────────────────*/}
          <div className="relative w-full h-[500px] md:h-[650px] lg:h-full min-h-[500px] md:min-h-[700px] rounded-[20px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.06)] bg-[#f3f4f6]">
            
            {/* The Map Background Implementation */}
            <div className="absolute inset-0 z-0">
                <GoogleMapReact
                 bootstrapURLKeys={{ key: "" }} 
                 center={mapCenter}
                 zoom={mapZoom}
                 onChange={({ zoom, center }) => {
                   setMapZoom(zoom);
                   setMapCenter(center);
                 }}
                 onChildClick={(childKey) => {
                   setActivePin(activePin === childKey ? null : childKey);
                 }}
                 options={{
                   disableDefaultUI: true, 
                   zoomControl: false,
                   mapTypeId: mapType
                 }}
               >
                 {branches.map(b => (
                   <CustomPin 
                     key={b.id} 
                     lat={b.lat} 
                     lng={b.lng} 
                     data={b} 
                     isActive={activePin === b.id}
                     onClick={() => setActivePin(activePin === b.id ? null : b.id)}
                   />
                 ))}
               </GoogleMapReact>
            </div>

            {/* Light tint overlay pointer events none to keep asthetic somewhat intact without blocking clicks */}
            <div className="absolute inset-0 bg-transparent mix-blend-color pointer-events-none"></div>

            {/* View In Maps Badge */}
            <a
              href="https://www.google.com/maps?q=9.03,38.74"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 md:top-6 left-4 md:left-6 bg-[#745893] text-white text-[12px] md:text-[13px] font-medium px-4 md:px-5 py-2.5 md:py-3 rounded flex items-center gap-2 hover:bg-[#5b4375] transition shadow-md z-10 tracking-wide"
            >
              View In Maps
              <svg width="12" height="12" md:width="14" md:height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>

            {/* Floating Widget - Layers (Bottom Left) */}
            <div 
              onClick={() => setMapType(prev => prev === 'roadmap' ? 'satellite' : 'roadmap')}
              className="absolute bottom-4 md:bottom-6 left-4 md:left-6 w-[60px] h-[60px] md:w-[70px] md:h-[70px] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.15)] border-[2px] md:border-[3px] border-white cursor-pointer group z-10 bg-black"
            >
              <img 
                src={mapType === 'roadmap' ? "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgclfTNkUcsfC0c2bVoKVjELv2pki_YYLCSD99BpC5IfzU9W9sH6kG7JcF07c6bxsVD4LnAH2PDkUQrN24mT_uedwjGm6onOmAJNMRbptuzkgAXqsTVFbFB4W6XkPaGuwDpflBf6ULJQhKs/w1200-h630-p-k-no-nu/1.jpg" : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmHHwmdcOUhPI-bknLxBFKmrB1kkaMSjUVOQ&s"} 
                alt="Layers" 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-90" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-1">
                <div className="flex items-center gap-1 text-white">
                  <svg width="8" height="8" md:width="10" md:height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                  <span className="text-[9px] md:text-[10px] font-bold tracking-wide">Layers</span>
                </div>
              </div>
            </div>

            {/* Zoom Controls (Bottom Right) */}
            <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 flex flex-col rounded-[10px] overflow-hidden shadow-lg z-10 bg-[#745893]">
              <button 
                onClick={(e) => { e.preventDefault(); setMapZoom(z => Math.min(z + 1, 20)) }}
                className="w-9 h-9 md:w-11 md:h-11 text-white flex items-center justify-center hover:bg-[#62497d] transition text-lg md:text-xl cursor-pointer">
                +
              </button>
              <div className="w-full h-[1px] bg-white/20"></div>
              <button 
                onClick={(e) => { e.preventDefault(); setMapZoom(z => Math.max(z - 1, 1)) }}
                className="w-9 h-9 md:w-11 md:h-11 text-white flex items-center justify-center hover:bg-[#62497d] transition text-xl md:text-2xl leading-none pt-[-2px] cursor-pointer">
                -
              </button>
            </div>
          </div>

        </div>
      </div>

      <Footer/>
    </div>
  )
}

const CustomPin = ({ lat, lng, data, isActive, $hover, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const showCard = isActive || $hover || isHovered;

  // Google maps marker sits top-left natively unless translated
  return (
    <div 
      className="relative group cursor-pointer z-30" 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transform: 'translate(-50%, -100%)' }}
    >
      
      {/* The Uploaded Pin SVG Graphic */}
      <div className={`relative z-10 transition-transform duration-300 ease-out origin-bottom ${showCard ? 'scale-110 drop-shadow-2xl' : 'drop-shadow-xl'}`}>
        <img src={pinSvg} alt="Droga Marker" className="w-[45px] md:w-[60px] h-auto mix-blend-normal" />
      </div>

      {/* THE OVERLAPPING INFO CARD (Toggled via Hover or Click) */}
      {showCard && (
        <div className="absolute left-1/2 -translate-x-1/2 md:left-[80%] bottom-[110%] md:top-1/2 md:-translate-y-1/2 md:bottom-auto mb-2 md:mb-0 md:ml-4 w-[260px] sm:w-[280px] md:w-[320px] bg-white rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.15)] p-4 md:p-5 z-20 cursor-default" onClick={(e) => e.stopPropagation()}>
          
          <div className="flex justify-between items-start mb-2.5">
            <h3 className="text-[#745893] font-bold text-[14px] md:text-[14.5px] leading-[1.2] pr-2">{data.name}</h3>
            <span className="text-gray-400 text-[10px] md:text-[11px] font-medium shrink-0 pt-[2px]">{data.dist}</span>
          </div>
          
          <div className="flex items-center gap-2 text-[11px] md:text-[12px] font-bold text-[#222] mb-3">
            <div className="flex text-[#FFF200] text-[12px] md:text-[13px] tracking-widest gap-0.5">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <span>{data.rating} <span className="font-light text-gray-400 text-[10px] md:text-[11px] ml-0.5">({data.users} User)</span></span>
          </div>
          
          <p className="text-[#888] text-[10px] md:text-[11px] leading-relaxed">
            {data.desc}
          </p>

        </div>
      )}
    </div>
  )
}

      <Footer />
