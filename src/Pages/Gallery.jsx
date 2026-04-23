import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CtaBgImg from '../assets/about/cta_background.png'

gsap.registerPlugin(ScrollTrigger);

const imageGlob = import.meta.glob(
  ['../assets/gallery/*.png', '../assets/gallery/*.jpg', '../assets/gallery/*.jpeg',
   '../assets/gallery/*.JPG', '../assets/gallery/*.webp'],
  { eager: true }
);
const images = Object.values(imageGlob).map((m) => m?.default).filter(Boolean);

// The tick logic is now inside the component to handle responsiveness


export default function Gallery() {
  const { t } = useLanguage();
  const containerRef   = useRef(null);
  const trackRef       = useRef(null);
  const timelineBarRef = useRef(null);
  const stRef          = useRef(null);
  const tickRefs       = useRef([]); // one ref per tick
  const lastActiveIdx  = useRef(-1);
  const [scrollY, setScrollY] = useState(0);
  const [tickCount, setTickCount] = useState(window.innerWidth < 768 ? 60 : 110);

  useEffect(() => {
    const handleResize = () => {
      setTickCount(window.innerWidth < 768 ? 60 : 110);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tickHeights = React.useMemo(() => {
    return Array.from({ length: tickCount }, (_, i) => {
      return i % 10 === 0 ? 1.0 : 0.55;
    });
  }, [tickCount]);


  // Navbar
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Imperatively update only the changed ticks — no re-render needed
  const updateTicks = useCallback((progress) => {
    const activeIdx = Math.round(Math.max(0, Math.min(progress, 1)) * (tickCount - 1));
    if (activeIdx === lastActiveIdx.current) return;

    // Reset the previous active tick back to its original height
    const prev = lastActiveIdx.current;
    if (prev >= 0 && tickRefs.current[prev]) {
      const el = tickRefs.current[prev];
      el.style.backgroundColor = '#745893';
      el.style.height = `${Math.round((tickHeights[prev] || 0.55) * 30)}px`; // restore original
      el.style.width = '1.5px'; // restore original
    }

    // Activate the new tick — taller and yellow
    const el = tickRefs.current[activeIdx];
    if (el) {
      el.style.backgroundColor = '#FFF200';
      el.style.height = '45px';
      el.style.width = '3.5px';
    }

    lastActiveIdx.current = activeIdx;
  }, [tickCount, tickHeights]);


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
    <div className="min-h-screen bg-[#F7F7F5] text-[#333] overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full z-200">
        <Navbar scrollY={scrollY} />
      </div>

      <div ref={containerRef} className="relative h-screen w-full flex items-center overflow-hidden">

        {/* Title — inverts over images */}
        <div
                    className="absolute bottom-80 md:bottom-105 inset-0 flex flex-col items-center justify-center font-bold pointer-events-none z-20"
                    style={{ mixBlendMode: 'difference' }}
                >
                    <h1 className="gap-2 flex flex-col uppercase text-center" style={{ color: '#745893' }}>
                        <span className="text-2xl sm:text-3xl md:text-5xl">{t.galleryPage.titleLine1}</span>
                        <span className="text-lg sm:text-lg md:text-3xl tracking-widest">{t.galleryPage.titleLine2}</span>
                    </h1>
                </div>


        {/* Horizontal image track */}
        <div ref={trackRef} className="relative z-10 flex items-center gap-[10vw] md:gap-[6vw] pl-[15vw] md:pl-[10vw] pr-[30vw] md:pr-[20vw] h-[75vh] md:h-[70vh] w-max mt-20">
          {images.map((src, idx) => {
            const aligns = ['self-start mt-4', 'self-center', 'self-end mb-12', 'self-center mt-20'];
            const widths = [
                'w-[70vw] md:w-[30vw]', 
                'w-[80vw] md:w-[40vw]', 
                'w-[65vw] md:w-[25vw]', 
                'w-[85vw] md:w-[45vw]', 
                'w-[75vw] md:w-[35vw]'
            ];
            return (
              <div key={idx} className={`relative flex-shrink-0 z-20 hover:z-30 md:hover:scale-105 transition-transform duration-500 shadow-2xl ${aligns[idx % aligns.length]} ${widths[idx % widths.length]}`}>
                <img src={src} alt={`${t.galleryPage.altText} ${idx + 1}`} className="w-full h-auto object-cover object-center max-h-[65vh] md:max-h-[60vh] rounded-sm" />
              </div>
            );
          })}
        </div>


        {/* ── Waveform timeline bar ── */}
        <div className="absolute mx-6 md:mx-24 bottom-6 md:bottom-8 left-2 md:left-10 right-2 md:right-10 z-30 select-none">

          <div
            ref={timelineBarRef}
            className="relative flex justify-between items-end w-full cursor-grab active:cursor-grabbing touch-none overflow-visible"
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
                  height: `${Math.round(h * 30)}px`,
                  backgroundColor: '#745893',
                  transition: 'height 0.15s ease, background-color 0.15s ease',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>

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
              <h2 
                  className="text-white text-3xl sm:text-4xl md:text-[clamp(2.5rem,8vw,3.5rem)] leading-[1.2] uppercase max-w-5xl mb-8 md:mb-12"
                  dangerouslySetInnerHTML={{ __html: t.galleryPage.cta.title }}
              />

              <Link to="/appointment" className="bg-white text-[#745893] px-8 md:px-10 py-4 md:py-5 rounded-full flex items-center gap-3 font-medium text-sm transition-all hover:scale-105 hover:bg-[#F7F7F5] shadow-xl group">
                  {t.galleryPage.cta.button}
                  <svg width="25" height="25" viewBox="0 0 20 20" fill="none" className="transition-transform group-hover:translate-x-1">
                      <path d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699" stroke="#745893" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
              </Link>
          </div>
      </section>

      <Footer />
    </div>
  );
}
