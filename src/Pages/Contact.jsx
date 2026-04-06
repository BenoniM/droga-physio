import React, { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Contact() {
  const [scrollY, setScrollY] = useState(0)
  const editorRef = useRef(null)

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

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
      phone: "+251115578906 / +251965757526"
    },
    {
      name: "Bole",
      address: "Bole Next to Japan Embassy",
      phone: "+251965757523 / +251116687006"
    },
    {
      name: "Lebu Varnero",
      address: "Lebu Varnero Infront of Chanoly Noodles",
      phone: "+251935999777"
    },
    {
      name: "Bel Air Kebena",
      address: "Droga Pediatric physiotherapy center (From Addis view hotel 200 meters by the road leading to the palace)",
      phone: "+251940332122"
    }
  ]

  return (
    <div className="min-h-screen bg-white font-['Delight'] overflow-x-hidden text-[#1A1A1A]">
      <div className="w-full fixed top-0 z-50 transition-all duration-300">
        <Navbar scrollY={scrollY} />
      </div>

      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 xl:gap-28 mt-12">
          
          {/* ── LEFT COLUMN: INFO & LOCATIONS ──────────────────────────────── */}
          <div className="flex flex-col">
            
            {/* Header Area */}
            <div className="mb-14">
              <div className="flex items-center gap-0 mb-6">
                <div className="relative flex items-center">
                  <div className="h-[1px] bg-[#745893] w-32 md:w-56"></div>
                  <div className="w-[6px] h-[6px] rotate-45 bg-[#745893] absolute right-0 translate-x-1/2"></div>
                </div>
                <span className="text-[#745893] text-lg font-medium tracking-[0.1em] uppercase ml-6">
                  CONTACT
                </span>
              </div>
              <h1 className="text-xl md:text-[1.6rem] xl:text-[2rem] font-medium leading-[1.3] text-[#222]">
                Ready To Take The First Step Toward Better Health? Contact Us Today To Book An Appointment.
              </h1>
            </div>

            {/* Locations List */}
            <div className="flex flex-col gap-[2px]">
              {locations.map((loc, i) => (
                <div 
                  key={i} 
                  className={`p-6 xl:p-8 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors ${i % 2 !== 0 ? 'bg-[#FCF7FD]' : 'bg-white'}`}
                >
                  <div className="flex items-start gap-5 max-w-[100%] md:max-w-[65%]">
                    <div className="w-12 h-12 rounded-full bg-[#F3E8F5] flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#745893" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div className="flex flex-col pt-1">
                      <h3 className="font-bold text-lg md:text-xl text-[#111] mb-1">{loc.name}</h3>
                      <p className="text-sm md:text-[15px] text-gray-500 font-light leading-snug pr-4">{loc.address}</p>
                    </div>
                  </div>

                  {loc.phone && (
                    <div className="flex items-start md:items-center gap-2 text-[#745893] font-medium text-[13px] md:text-sm shrink-0 md:pl-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-[2px] md:mt-0">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <span className="tracking-wide leading-tight max-w-[140px] md:max-w-none">{loc.phone}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>


          {/* ── RIGHT COLUMN: CONTACT FORM ───────────────────────────────────── */}
          <div className="flex flex-col xl:pl-10 mt-4 md:mt-8 lg:mt-0">
            <form className="w-full flex flex-col pt-2" onSubmit={(e) => e.preventDefault()}>
              
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full pb-4 mb-10 text-[17px] border-b border-[#D1CBD8] placeholder-[#A29CA8] text-[#333] outline-none focus:border-[#745893] transition-colors bg-transparent font-light"
              />
              
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full pb-4 mb-10 text-[17px] border-b border-[#D1CBD8] placeholder-[#A29CA8] text-[#333] outline-none focus:border-[#745893] transition-colors bg-transparent font-light"
              />
              
              <input 
                type="text" 
                placeholder="Phone (Optional)" 
                className="w-full pb-4 mb-10 text-[17px] border-b border-[#D1CBD8] placeholder-[#A29CA8] text-[#333] outline-none focus:border-[#745893] transition-colors bg-transparent font-light"
              />
              
              <input 
                type="text" 
                placeholder="Subject" 
                className="w-full pb-4 mb-12 text-[17px] border-b border-[#D1CBD8] placeholder-[#A29CA8] text-[#333] outline-none focus:border-[#745893] transition-colors bg-transparent font-light"
              />

              {/* Rich Text Editor Functional */}
              <div className="w-full border border-[#D1CBD8] rounded-md mb-8 overflow-hidden bg-white focus-within:border-[#745893] transition-colors">
                <div className="border-b border-[#D1CBD8] px-5 py-3 flex items-center gap-4 text-gray-500 bg-[#FCF7FD]">
                  <button onMouseDown={(e) => handleFormat(e, 'bold')} type="button" className="hover:text-[#745893] transition-colors" title="Bold">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>
                  </button>
                  <button onMouseDown={(e) => handleFormat(e, 'italic')} type="button" className="hover:text-[#745893] transition-colors" title="Italic">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>
                  </button>
                  <button onMouseDown={(e) => handleFormat(e, 'insertUnorderedList')} type="button" className="hover:text-[#745893] transition-colors" title="Bullet List">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                  </button>
                  <button onMouseDown={(e) => handleFormat(e, 'createLink')} type="button" className="hover:text-[#745893] transition-colors" title="Link">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                  </button>
                  <button onMouseDown={(e) => handleFormat(e, 'insertImage')} type="button" className="hover:text-[#745893] transition-colors" title="Image">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  </button>
                </div>
                <div 
                  ref={editorRef}
                  contentEditable
                  data-placeholder="Write Your Message"
                  className="w-full p-5 outline-none bg-transparent font-sans text-[17px] text-[#333] min-h-[180px] cursor-text empty:before:content-[attr(data-placeholder)] empty:before:text-[#A29CA8]"
                ></div>
              </div>

              {/* Submit Button */}
              <div className="mt-2">
                <button type="submit" className="bg-[#FFF200] text-black font-semibold text-[15px] px-8 py-4 rounded-full flex items-center justify-center gap-3 hover:scale-105 transition-transform duration-300 w-auto inline-flex">
                  Book An Appointment
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
