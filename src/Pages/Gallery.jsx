import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'

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

      <Footer />
    </div>
  );
}
