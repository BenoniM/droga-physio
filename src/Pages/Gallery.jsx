import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import physioLogoFooter from '../assets/general/physioLogo2.svg'

gsap.registerPlugin(ScrollTrigger);

const imageGlob = import.meta.glob(
  ['../assets/gallery/*.png', '../assets/gallery/*.jpg', '../assets/gallery/*.jpeg',
   '../assets/gallery/*.JPG', '../assets/gallery/*.webp'],
  { eager: true }
);
const images = Object.values(imageGlob).map((m) => m?.default).filter(Boolean);

// Smooth sine wave — consistent up/down cycle every ~10 ticks
const TICK_COUNT = 110;
const tickHeights = Array.from({ length: TICK_COUNT }, (_, i) => {
  // sin maps -1..1 → 0..1, then scale to 0.15..1.0
  return i % 10 === 0 ? 1.0 : 0.55;
});

export default function Gallery() {
  const containerRef   = useRef(null);
  const trackRef       = useRef(null);
  const timelineBarRef = useRef(null);
  const stRef          = useRef(null);
  const tickRefs       = useRef([]); // one ref per tick
  const lastActiveIdx  = useRef(-1);
  const [scrollY, setScrollY] = useState(0);

  // Navbar
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Imperatively update only the changed ticks — no re-render needed
  const updateTicks = useCallback((progress) => {
    const activeIdx = Math.round(Math.max(0, Math.min(progress, 1)) * (TICK_COUNT - 1));
    if (activeIdx === lastActiveIdx.current) return;

    // Reset the previous active tick back to its original height
    const prev = lastActiveIdx.current;
    if (prev >= 0 && tickRefs.current[prev]) {
      const el = tickRefs.current[prev];
      el.style.backgroundColor = '#745893';
      el.style.height = `${Math.round(tickHeights[prev] * 20)}px`; // restore original
      el.style.width = '1.5px'; // restore original
    }

    // Activate the new tick — taller and yellow
    const el = tickRefs.current[activeIdx];
    if (el) {
      el.style.backgroundColor = '#FFF200';
      el.style.height = '35px';
      el.style.width = '3.5px';
    }

    lastActiveIdx.current = activeIdx;
  }, []);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const getScrollAmount = () => -(trackRef.current.scrollWidth - window.innerWidth);

    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        x: () => getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${Math.abs(getScrollAmount())}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            stRef.current = self;
            updateTicks(self.progress);
          },
          onRefresh(self) {
            updateTicks(self.progress);
          },
        },
      });
    }, containerRef);

    // Set tick 0 as active on mount
    requestAnimationFrame(() => updateTicks(0));

    return () => ctx.revert();
  }, [updateTicks]);

  // Drag-to-scroll
  const drag = useRef({ active: false, startX: 0, startScrollY: 0 });

  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    drag.current = { active: true, startX: e.clientX, startScrollY: window.scrollY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!drag.current.active || !stRef.current) return;
    const dx = e.clientX - drag.current.startX;
    const totalScroll = stRef.current.end - stRef.current.start;
    const barW = timelineBarRef.current?.offsetWidth ?? window.innerWidth;
    window.scrollTo({ top: drag.current.startScrollY - (dx / barW) * totalScroll, behavior: 'instant' });
  }, []);

  const onPointerUp = useCallback(() => { drag.current.active = false; }, []);

  return (
    <div className="bg-[#F7F7F5] text-[#333] font-sans overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar scrollY={scrollY} isLightBg={true} />
      </div>

      <div ref={containerRef} className="relative h-screen w-full flex items-center overflow-hidden">

        {/* Title — inverts over images */}
        <div
                    className="absolute bottom-90 inset-0 flex flex-col items-center justify-center font-['Compacta'] pointer-events-none z-20"
                    style={{ mixBlendMode: 'difference' }}
                >
                    <h1 className="gap-2 flex flex-col uppercase text-center" style={{ color: '#745893' }}>
                        <span className="text-7xl">DROGA PHYSIO LOOKBACK</span>
                        <span className="text-5xl tracking-widest">(GALLERY / 2026)</span>
                    </h1>
                </div>

        {/* Horizontal image track */}
        <div ref={trackRef} className="relative z-10 flex items-center gap-[6vw] pl-[10vw] pr-[20vw] h-[70vh] w-max mt-20">
          {images.map((src, idx) => {
            const aligns = ['self-start mt-4', 'self-center', 'self-end mb-12', 'self-center mt-20'];
            const widths = ['w-[30vw]', 'w-[40vw]', 'w-[25vw]', 'w-[45vw]', 'w-[35vw]'];
            return (
              <div key={idx} className={`relative flex-shrink-0 z-20 hover:z-30 hover:scale-105 transition-transform duration-500 shadow-2xl ${aligns[idx % aligns.length]} ${widths[idx % widths.length]}`}>
                <img src={src} alt={`Gallery image ${idx + 1}`} className="w-full h-auto object-cover object-center max-h-[60vh] rounded-sm" />
              </div>
            );
          })}
        </div>

        {/* ── Waveform timeline bar ── */}
        <div className="absolute mx-24 bottom-8 left-10 right-10 z-30 select-none">
          <div
            ref={timelineBarRef}
            className="relative flex justify-between items-end w-full border-b cursor-grab active:cursor-grabbing touch-none overflow-visible"
            style={{ borderColor: '#745893', height: '24px' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {tickHeights.map((h, i) => (
              <div
                key={i}
                ref={(el) => { tickRefs.current[i] = el; }}
                style={{
                  width: '1.5px',
                  height: `${Math.round(h * 20)}px`,
                  backgroundColor: '#745893',
                  transition: 'height 0.15s ease, background-color 0.15s ease',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>

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
  );
}
