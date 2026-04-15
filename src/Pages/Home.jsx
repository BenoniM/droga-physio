import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import vid1 from '../assets/videos/6023241-uhd_3840_2160_25fps.mp4';
import vid2 from '../assets/videos/6111019-uhd_3840_2160_25fps.mp4';
import vid3 from '../assets/videos/8480310-hd_1920_1080_25fps.mp4';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import IMG_3575 from '../assets/home/IMG_3575.JPG';
import IMG_3651 from '../assets/home/IMG_3651.JPG';

import img1 from "../assets/home/photo_2026-03-27_11-04-18.jpg";
import img2 from "../assets/home/photo_2026-03-27_11-04-45.jpg";
import img3 from "../assets/home/photo_2026-04-14_13-29-56.jpg";
import img4 from "../assets/home/photo_2026-04-14_13-30-05.jpg";
import img5 from "../assets/home/photo_2026-04-14_13-30-50.jpg";
import img6 from "../assets/home/photo_2026-04-14_14-23-03.jpg";

import NewsImg1 from '../assets/news/01K8AJ4CXG6T09EWPPD69R0TB51.png';
import NewsImg2 from '../assets/news/01K8AJ4CXG6T09EWPPD69R0TB52.jpg';
import NewsImg3 from '../assets/news/01K87YZQNX503SN3TQKZEP7S4W.png';
import NewsImg4 from '../assets/news/01K87Z1KWNJPC3BN1T6TMQ8YPR1.png';
import NewsImg5 from '../assets/news/01K87Z1KWNJPC3BN1T6TMQ8YPR2.png';
import NewsImg6 from '../assets/news/01K87Z55XY4P3JZJD9ZS34C9ZX1.png';

import boleImg from '../assets/contact/Bole.jpg';
import kiloImg from '../assets/contact/4Kilo.jpg';
import kebenaImg from '../assets/contact/Kebena.jpg';
import lebuImg from '../assets/contact/Lebu.jpg';
import summitImg from '../assets/contact/Summit.jpg';

import { User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
const bgVideos = [vid1, vid2, vid3];

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [showHero, setShowHero] = useState(false);
  const [bgStyles, setBgStyles] = useState({ droga: {}, physio: {} });
  const [scrollY, setScrollY] = useState(0);
  const [showRed, setShowRed] = useState(false);

  const drogaRef = useRef(null);
  const physioRef = useRef(null);
  const imgDims = useRef(null);
  const animFrameRef = useRef(null);
  const servicesRef = useRef(null);
  const scaleX = 1.29;

  const [vidIdx, setVidIdx] = useState(0);
  const videoRefs = useRef([]);
  const canvasRef = useRef(document.createElement('canvas'));

  const serviceTargetProgress = useRef(0);
  const serviceSmoothProgress = useRef(0);
  const frameCountRef = useRef(0);
  const [serviceProgress, setServiceProgress] = useState(0);

  const sectionRef = useRef(null);
  const missionTitleRef = useRef(null);
  const visionTitleRef = useRef(null);
  const contentRef = useRef(null);

  const serviceImages = [img1, img2, img3, img4, img5, img6];

  // Initial loading & hero slide
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const timer1 = setTimeout(() => setIsLoading(false), 400);
    const timer2 = setTimeout(() => {
      updateBgPositions();
      setShowHero(true);
    }, 1150);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Update background positions based on element rects
  const updateBgPositions = useCallback(() => {
    if (!drogaRef.current || !physioRef.current) return;
    const activeVideo = videoRefs.current[vidIdx];
    if (!activeVideo || activeVideo.readyState < 2) return;

    const iw = activeVideo.videoWidth;
    const ih = activeVideo.videoHeight;
    imgDims.current = { w: iw, h: ih };

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const ratio = Math.max(vw / iw, vh / ih);
    const bgW = iw * ratio;
    const bgH = ih * ratio;

    const coverOffX = (vw - bgW) / 2;
    const coverOffY = (vh - bgH) / 2;

    const drogaRect = drogaRef.current.getBoundingClientRect();
    const physioRect = physioRef.current.getBoundingClientRect();

    // Render video to canvas for text background clipping
    if (window.scrollY <= window.innerHeight * 1.5) {
      frameCountRef.current += 1;
      if (frameCountRef.current % 4 === 0) {
        const canvas = canvasRef.current;
        if (canvas.width !== 640) {
          canvas.width = 640;
          canvas.height = (640 / iw) * ih;
        }
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(activeVideo, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.15);
        document.documentElement.style.setProperty('--dynamic-text-bg', `url(${dataUrl})`);
      }
    }

    setBgStyles({
      droga: {
        backgroundSize: `${bgW / scaleX}px ${bgH}px`,
        backgroundPosition: `${(coverOffX - drogaRect.left) / scaleX}px ${coverOffY - drogaRect.top
          }px`,
      },
      physio: {
        backgroundSize: `${bgW / scaleX}px ${bgH}px`,
        backgroundPosition: `${(coverOffX - physioRect.left - 7) / scaleX}px ${coverOffY - physioRect.top
          }px`,
      },
    });
  }, [vidIdx]);

  // Video initialization handling
  useEffect(() => {
    const activeVideo = videoRefs.current[vidIdx];
    if (activeVideo) {
      activeVideo.play().catch(() => { });
    }
  }, [vidIdx]);

  // Continuous updates during hero slide
  useEffect(() => {
    if (showHero) {
      const animate = () => {
        updateBgPositions();
        animFrameRef.current = requestAnimationFrame(animate);
      };
      animFrameRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animFrameRef.current);
    }
  }, [showHero, updateBgPositions]);

  // Update positions on resize or fonts ready
  useEffect(() => {
    document.fonts?.ready?.then(updateBgPositions);
    window.addEventListener('resize', updateBgPositions);
    return () => window.removeEventListener('resize', updateBgPositions);
  }, [updateBgPositions]);

  // Track scroll smoothly using requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    let rafId;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;

        rafId = requestAnimationFrame(() => {
          setScrollY(window.scrollY);

          if (servicesRef.current) {
            const rect = servicesRef.current.getBoundingClientRect();
            const scrollDistance = rect.height - window.innerHeight;

            if (scrollDistance > 0) {
              const rawProgress = -rect.top / scrollDistance;
              serviceTargetProgress.current = Math.max(0, Math.min(1, rawProgress));
            }
          }

          ticking = false;
        });
      }
    };

    let progressRafId;
    const animateProgress = () => {
      serviceSmoothProgress.current +=
        (serviceTargetProgress.current - serviceSmoothProgress.current) * 0.08;

      setServiceProgress(serviceSmoothProgress.current);
      progressRafId = requestAnimationFrame(animateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    animateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(progressRafId);
    };
  }, []);

  // Trigger red slide after background animation threshold is crossed
  const bgScrollThreshold = window.innerHeight * 0.75;
  const isPastHero = scrollY > bgScrollThreshold;

  useEffect(() => {
    if (isPastHero) {
      const timer = setTimeout(() => setShowRed(true), 550);
      return () => clearTimeout(timer);
    } else {
      setShowRed(false);
    }
  }, [isPastHero]);

  // Base style for text fill with background image
  const textBaseStyle = {
    backgroundImage: `linear-gradient(
      rgba(247, 247, 245, 0.15),
      rgba(247, 247, 245, 0.15)
    ), var(--dynamic-text-bg, none)`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
  };

  // TitleLine component
  const TitleLine = ({ text, refEl, bgStyle }) => (
    <div className="relative w-full">
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 block font-compacta text-[17cqi] leading-[0.9] origin-left blur-[0.5px]"
        style={{
          ...textBaseStyle,
          ...bgStyle,
          opacity: 0.9,
          transform: `scaleX(${scaleX})`,
          whiteSpace: 'nowrap'
        }}
      >
        {text}
      </span>
      <span
        ref={refEl}
        className="relative block font-compacta text-[17cqi] leading-[0.9] origin-left"
        style={{
          color: 'rgba(247, 247, 245, 0.78)',
          WebkitTextFillColor: 'rgba(247, 247, 245, 0.78)',
          transform: `scaleX(${scaleX})`,
          whiteSpace: 'nowrap'
        }}
      >
        {text}
      </span>
    </div>
  );

  // Hero transform: initial slide + scroll offset
  const heroTransform = showHero
    ? `translateY(${Math.max(-scrollY, -window.innerHeight * 0.75)}px)`
    : 'translateY(-200%)';

  // Background transform when hero scrolls out
  const bgTransform = isPastHero
    ? `translateX(${window.innerWidth * 0.2}px) scale(0.7)`
    : 'translateX(0) scale(1)';

  // Red slide transform
  const redLeft = showRed ? '0' : '-100%';

  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = t.testimonials.map((item, idx) => ({
    ...item,
    image: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800",
    ][idx]
  }));

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        }
      });

      // Background Card Reveal
      tl.fromTo(".mv-card",
        { opacity: 0, y: 100, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power4.out" }
      );

      // Typography Slide-ins
      tl.from(missionTitleRef.current, { x: 100, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.5");
      tl.from(visionTitleRef.current, { x: -100, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.8");

      // Text Stagger
      tl.from(".mv-text", { y: 30, opacity: 0, stagger: 0.2, duration: 0.6 }, "-=0.4");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // add near your other useState hooks
  const [activeBranchIndex, setActiveBranchIndex] = useState(1);

  const branches = t.branches;

  const activeBranch = branches[activeBranchIndex];

  const newsData = t.news.map((item, idx) => ({
    ...item,
    img: [NewsImg1, NewsImg2, NewsImg3, NewsImg4, NewsImg5, NewsImg6][idx]
  }));

  const bufferedNews = [...newsData.slice(-3), ...newsData, ...newsData.slice(0, 3)];
  const [currentIndex, setCurrentIndex] = useState(3);
  const sliderTrackRef = useRef(null);
  const isTransitioning = useRef(false);

  const nextSlide = () => {
    if (isTransitioning.current) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (isTransitioning.current) return;
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // GSAP Sliding Animation
  useEffect(() => {
    if (sliderTrackRef.current) {
      isTransitioning.current = true;

      const track = sliderTrackRef.current;
      // Dynamically calculate the gap applied by CSS classes (gap-4 vs gap-10)
      const computedGap = parseFloat(window.getComputedStyle(track).gap) || 0;
      const cardWidth = track.children[0].offsetWidth + computedGap;

      gsap.to(track, {
        x: -currentIndex * cardWidth,
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => {
          isTransitioning.current = false;

          // Infinite Loop Reset
          if (currentIndex >= newsData.length + 3) {
            gsap.set(track, { x: -3 * cardWidth });
            setCurrentIndex(3);
          } else if (currentIndex <= 0) {
            gsap.set(track, { x: -newsData.length * cardWidth });
            setCurrentIndex(newsData.length);
          }
        }
      });
    }
  }, [currentIndex, newsData.length]);

  return (
    <div className="relative w-full overflow-x-clip bg-[#F7F7F5]">
      {/* Loading overlay */}
      <div
        className={`fixed inset-0 z-100 bg-[#745893] transition-transform duration-700 ease-in-out ${isLoading ? 'translate-y-0' : '-translate-y-full'
          }`}
      />

      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-200">
        <Navbar scrollY={scrollY} />
      </div>

      {/* Hero section */}
      <div
        className="absolute left-0 top-0 z-40 flex h-[75vh] w-full flex-col justify-end bg-[#745893] pb-24 md:pb-16"
        style={{
          transform: heroTransform,
          transition: scrollY === 0 ? 'transform 0.7s ease-out' : 'none',
        }}
      >
        {/* Desktop title block */}
        <div className="hidden md:block px-6 md:px-12 lg:px-24 mb-4 lg:-mb-12 w-full" style={{ containerType: 'inline-size' }}>
          <div className="relative flex flex-col items-start w-full">
            <TitleLine text={t.hero.title1} refEl={drogaRef} bgStyle={bgStyles.droga} />

            {/* Extra text positioned above PHYSIOTHERAPY on the right */}
            <span
              className="font-semibold scale-x-100 text-sm md:text-lg lg:text-xl xl:text-xl text-[#FFF200] absolute right-0 bottom-[55%] z-10 translate-y-[20%] tracking-wide"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
            >
              "{t.hero.tagline}"
            </span>

            <TitleLine
              text={t.hero.title2}
              refEl={physioRef}
              bgStyle={bgStyles.physio}
            />
          </div>
        </div>

        {/* Mobile title block — centered */}
        <div className="flex md:hidden flex-col items-center w-full px-6 mb-14">
          {/* Centered DROGA & PHYSIOTHERAPY on mobile — scaleX expands left+right from center */}
          <div style={{ transform: `scaleX(${scaleX})`, transformOrigin: 'center' }} className="relative">
            <span className="block font-compacta text-[15vw] leading-[0.95] text-center text-[rgba(247,247,245,0.78)]">
              {t.hero.title1}
            </span>

            <span className="block font-compacta text-[15vw] leading-[0.95] text-center text-[rgba(247,247,245,0.78)]">
              {t.hero.title2}
            </span>
          </div>

          {/* Taglines */}
          <div className="flex flex-col items-center mt-6 gap-2 w-full text-center">
            <span className="font-medium text-xl text-[#FFF200] drop-shadow-md">
              "{t.hero.tagline}"
            </span>

            <p className="text-[#F7F7F5] text-base max-w-[85vw] leading-snug mt-1 opacity-90 font-light">
              {t.hero.description}
            </p>
          </div>
        </div>

        {/* Description paragraph — desktop only (positioned strictly against the left grid) */}
        <p className="hidden md:block absolute left-6 md:left-12 lg:left-24 top-[82vh] text-[#F7F7F5] capitalize font-medium text-sm md:text-lg lg:text-xl xl:text-2xl max-w-[280px] lg:max-w-lg xl:max-w-2xl tracking-wide">
          {t.hero.description}
        </p>

        {/* Special offer box — desktop: pinned flush right | mobile: absolute overlapping bottom edge */}
        <div className="absolute left-1/2 md:left-auto right-auto md:right-12 lg:right-24 bottom-0 md:bottom-auto md:top-[67vh] -translate-x-1/2 md:translate-x-0 translate-y-[45%] md:translate-y-0 w-[80%] max-w-[320px] lg:w-[310px] bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-4 lg:p-6 opacity-90 border border-white/20 transition-all hover:shadow-xl scale-100 origin-bottom-right md:origin-top-right">
          <div className="text-center md:text-left">
            <h3 className="text-[#755893] font-bold text-sm uppercase tracking-wider">
              {t.specialOffer.title}
            </h3>
            <div className="text-3xl md:text-4xl font-black text-[#745893] my-1">
              {t.specialOffer.discount}
            </div>
            <p className="text-[#745893] text-xs md:text-sm mt-1 leading-relaxed">
              {t.specialOffer.description}
            </p>
            <Link to="/appointment" className="mt-4 w-full bg-[#FFF200] hover:bg-[#5d3e78] text-[#333] hover:text-[#F7F7F5] font-semibold py-2.5 px-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-sm text-sm">
              {t.specialOffer.button}
              <svg
                className="w-4 h-4 transition-colors duration-300 group-hover:text-[#F7F7F5]"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Background videos with transform */}
      <div
        className="fixed top-0 left-0 h-screen w-full z-0 overflow-hidden"
        style={{
          transform: bgTransform,
          transition: 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
          filter: 'brightness(0.5)',
        }}
      >
        {bgVideos.map((vid, idx) => (
          <video
            key={vid}
            ref={(el) => (videoRefs.current[idx] = el)}
            src={vid}
            playsInline
            muted
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${vidIdx === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            onEnded={() => setVidIdx((prev) => (prev + 1) % bgVideos.length)}
          />
        ))}
      </div>

      {/* About Us Panel (Fixed alongside background image) */}
      <div
        className="fixed px-6 md:px-24 h-auto md:h-[60vh] top-[15vh] md:top-[20vh] w-full md:w-1/2 flex flex-col justify-center gap-4 md:gap-5 z-0 transition-opacity"
        style={{
          left: redLeft,
          transition: 'left 1s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div className="flex flex-col justify-center gap-3 md:gap-5 bg-white/45 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-5 sm:p-6 md:p-0 rounded-xl md:rounded-none md:shadow-none border border-white/45 md:border-transparent mt-[8vh] md:mt-0 max-w-full md:max-w-none">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center">
              <div className="h-[2px] bg-[#745893] w-50 md:w-50"></div>
              <div className="w-2 h-2 bg-[#745893] rotate-45 -mr-1"></div>
            </div>

            <span className="text-sm md:text-lg font-medium tracking-widest uppercase text-[#333]">{t.about.subtitle}</span>
          </div>

          <div className={"text-[#745893] text-[7.5vw] md:text-[2.9vw] leading-[1.15] md:leading-[1.2] uppercase font-[700] md:font-semibold drop-shadow-sm md:drop-shadow-none tracking-wide whitespace-pre-line max-w-full md:max-w-lg" + (language === 'amh' ? ' font-compacta' : '')}>
            {t.about.title}
          </div>

          <div className="w-full text-xs sm:text-sm md:text-md leading-relaxed font-light md:font-regular max-w-full md:max-w-sm text-[#444] md:text-[#333] pt-1 md:pt-0">
            {t.about.description}
          </div>

          <div className="mt-3 md:mt-0">
            <Link to="/about" className="group flex items-center gap-3 px-5 md:px-6 py-2.5 md:py-3 rounded-full bg-[#FFF200] text-black hover:bg-[#745893] hover:text-white transition-all duration-300 w-fit shadow-md hover:shadow-lg hover:-translate-y-0.5">
              <span className="text-sm md:text-base font-semibold">{t.about.button}</span>
              <svg
                className="w-4 h-4 md:w-5 md:h-5 transition-colors duration-300 group-hover:text-white"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Scrolling Content Area */}
      <div className="relative z-10 flex flex-col w-full pointer-events-none">
        {/* Massive transparent spacer */}
        <div className="h-[230vh] w-full" />

        {/* HORIZONTAL SCROLLING SERVICES CONTAINER — unified (desktop + mobile) */}
        <div ref={servicesRef} className="w-full h-[500vh] relative z-20 pointer-events-auto">
          <div className="w-full h-screen sticky top-0 bg-[#745893] overflow-hidden flex flex-col justify-between py-6 md:py-16 px-0 md:px-24">

            {/* ── DESKTOP filmstrip ── */}
            <div
              className="hidden md:flex absolute top-25 left-30 h-[65vh]"
              style={{
                width: `${t.services.length * 100}vw`,
                transform: `translateX(-${serviceProgress * (t.services.length - 1) * 103}vw)`
              }}
            >
              {t.services.map((service, idx) => (
                <div key={idx} className="w-screen px-24 flex justify-between items-start relative h-full">
                  <div className="flex flex-col z-20">
                    <div className="text-[#FFF200] text-xl tracking-widest uppercase font-light mb-4">
                      {language === 'amh' ? 'አገልግሎት' : 'SERVICE'} {service.id}
                    </div>
                    <div className={"flex flex-col gap-[0.1em] text-[#FFF200] text-[4vw] leading-[1] opacity-95 drop-shadow-lg max-w-lg tracking-wide" + (language === 'amh' ? ' font-compacta' : '')}>
                      {(service.title.includes('\n') ? service.title.split('\n') : service.title.split(' ')).map((word, i) => (
                        <span key={i}>{word.trim()}</span>
                      ))}
                    </div>
                  </div>
                  <div
                    className={`absolute left-[28%] top-0 w-[45%] h-full bg-cover bg-center shadow-2xl z-10`}
                    style={{
                      backgroundImage: `url(${serviceImages[idx]})`
                    }}
                  />
                  <div className="w-[25%] max-w-sm h-full flex items-end z-20 pl-12">
                    <p className="text-white text-sm tracking-wider leading-relaxed font-light">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── MOBILE filmstrip ── */}
            <div
              className="flex md:hidden absolute inset-x-0 top-0 h-[calc(100vh-80px)]"
              style={{
                width: `${t.services.length * 100}vw`,
                transform: `translateX(-${serviceProgress * (t.services.length - 1) * 100}vw)`
              }}
            >
              {t.services.map((service, idx) => (
                <div key={idx} className="relative w-screen h-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${serviceImages[idx]})`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#745893] via-[#745893]/60 to-[#745893]/10" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 pb-12">
                    <div className="flex flex-col gap-3">
                      <div className="text-[#FFF200] text-[3.5vw] tracking-widest uppercase font-semibold">
                        {language === 'amh' ? 'አገልግሎት' : 'SERVICE'} {service.id}
                      </div>
                      <div className="text-[#FFF200] text-[11vw] leading-[1.1] uppercase font-black drop-shadow-lg whitespace-pre-line">
                        {service.title}
                      </div>
                      <p className="text-white/80 text-xs leading-relaxed font-light max-w-[75vw]">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom footer bar — shared */}
            <div className="w-full mt-auto z-20 px-6 md:px-0">
              {/* Progress line */}
              <div className="w-full h-[2px] bg-white/30 mb-4 relative">
                <div
                  className="absolute top-0 left-0 h-full w-full bg-[#F7F7F5] origin-left transition-transform duration-150 ease-out"
                  style={{ transform: `scaleX(${Math.max(0.02, serviceProgress)})` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="text-white text-base md:text-xl font-light tracking-widest">
                  [{Math.min(t.services.length, Math.round(serviceProgress * (t.services.length - 1)) + 1)}/{t.services.length}]
                </div>
                <Link to="/service" className="flex items-center gap-2 md:gap-3 text-[#FFF200] text-sm md:text-xl font-light tracking-wide hover:opacity-80 transition-opacity">
                  {language === 'amh' ? 'ሁሉንም አገልግሎቶች ይመልከቱ' : 'View All Services'}
                  <svg className="w-5 h-5 md:w-7 md:h-7 -rotate-45" viewBox="0 0 20 20" fill="none">
                    <path d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ========== TESTIMONIAL SECTION ========== */}
        <section className="relative z-10 bg-[#F7F7F5] min-h-screen py-16 md:py-16 overflow-hidden flex items-center pointer-events-auto">
          <div className="mx-auto px-6 md:px-24 flex flex-col items-center">
            {/* Heading */}
            <h2 className="text-[#745893] text-2xl md:text-3xl lg:text-5xl leading-tight mb-5 text-center">
              {language === 'amh' ? 'ታካሚዎቻችን ምን ይላሉ?' : 'What Our Patients Say'}
            </h2>

            {/* Subheading */}
            <p className="text-gray-600 text-center text-sm md:text-base max-w-2xl mb-12">
              {language === 'amh'
                ? 'በእኛ ቁርጠኝነት እና ሙያዊ አጋርነት የግል ብራንዳቸውን እና የሕክምና ባለሥልጣናቸውን የቀየሩ ባለሙያዎች እውነተኛ ታሪኮች።'
                : 'Real stories from professionals who transformed their personal brand and editorial authority through our dedicated strategic partnership.'}
            </p>

            {/* Main testimonial layout */}
            <div className="w-full max-w-6xl flex flex-col md:flex-row items-stretch gap-8 md:gap-0 mt-4 md:mt-0">

              {/* Left: Image Stack */}
              <div className="relative md:bottom-3 scale-100 md:scale-95 w-full md:w-1/2 h-[280px] md:h-[450px] lg:h-[500px] flex items-center justify-center">
                {testimonials.map((item, index) => {
                  const isFront = index === activeIndex;
                  const isMiddle = index === (activeIndex + 1) % testimonials.length;
                  const isBack = index === (activeIndex + 2) % testimonials.length;

                  return (
                    <div
                      key={index}
                      className={`absolute inset-0 m-auto w-[85%] md:w-3/5 h-[90%] md:h-full rounded-[15px] overflow-hidden transition-all duration-500 ease-in-out border-b-[4px] md:border-b-5 border-[#F7F7F5]
                  ${isFront ? 'z-30 translate-y-0 scale-100 opacity-100 shadow-xl' : ''}
                  ${isMiddle ? 'z-20 translate-y-4 md:translate-y-8 scale-[0.98] opacity-100' : ''}
                  ${isBack ? 'z-10 translate-y-8 md:translate-y-16 scale-[0.95] opacity-100' : 'opacity-0'}
                `}
                      style={{
                        backgroundColor: isFront ? 'transparent' : '#D1C6E0',
                      }}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className={`w-full h-full object-cover transition-opacity duration-500 ${isFront ? 'opacity-100' : 'opacity-40'}`}
                        />
                      ) : (
                        <div className={`w-full h-full flex flex-col items-center justify-center bg-[#D1C6E0] transition-opacity duration-500 ${isFront ? 'opacity-100' : 'opacity-40'}`}>
                          <User size={250} strokeWidth={1} className="text-[#745893]/70" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right: Content Block */}
              <div className="w-full md:w-1/2 h-auto md:h-[450px] lg:h-[500px] flex flex-col justify-between text-center md:text-left p-2 md:p-8 shrink-0">
                {/* Top content */}
                <div className="space-y-4 md:space-y-6">
                  <p className="text-[#333] text-base md:text-xl leading-relaxed md:leading-relaxed font-light italic px-2 md:px-0">
                    "{testimonials[activeIndex].quote}"
                  </p>

                  <div className="pt-2 md:pt-0">
                    <h4 className="text-[#745893] font-bold text-lg md:text-xl">
                      {testimonials[activeIndex].name}
                    </h4>
                    <p className="text-gray-400 text-xs tracking-widest uppercase mt-1">
                      {testimonials[activeIndex].role}
                    </p>
                  </div>
                </div>

                {/* Bottom controls */}
                <div className="flex items-center justify-between w-full mt-6 md:mt-0 px-4 md:px-0 pb-4 md:pb-0">
                  <div className="flex gap-4">
                    <button
                      onClick={handlePrev}
                      className="w-12 h-12 rounded-full border border-[#745893] text-[#745893] flex items-center justify-center hover:bg-[#745893] hover:text-white transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-[#745893] rotate-180 transition-colors duration-300 group-hover:text-[#FFF200]"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={handleNext}
                      className="w-12 h-12 rounded-full bg-[#745893] text-white flex items-center justify-center hover:bg-[#5d4677] transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-[#F7F7F5] transition-colors duration-300 group-hover:text-[#FFF200]"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {testimonials.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${i === activeIndex ? 'bg-[#745893]' : 'bg-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== Mission & Vision ========== */}
        <section
          ref={sectionRef}
          className="relative z-30 bg-[#745893] py-15 px-6 md:px-24 flex items-center justify-center overflow-hidden pointer-events-auto"
        >
          <div className="mv-card relative w-full max-w-7xl backdrop-blur-sm rounded-[20px] overflow-hidden flex flex-col md:flex-row md:h-3/4">

            {/* LEFT PANEL: VISION */}
            <div className="relative w-full md:w-1/2 min-h-[50vh] xl:min-h-[60vh] flex flex-col justify-between p-8 md:p-12 lg:p-16 group">
              {/* Background Image Layer */}
              <div className="absolute inset-0 z-0 opacity-30 grayscale group-hover:grayscale-0 transition-all group-hover:opacity-60 duration-700">
                {/* Replace with your local asset */}
                <img src={IMG_3575} alt="Vision" className="w-full h-full object-cover" />
              </div>

              <div className='flex flex-col gap-10 md:gap-20 justify-center flex-1'>
                <div className="relative z-10">
                  <p className="mv-text text-white/90 text-lg max-w-md font-light leading-relaxed mb-4">
                    {language === 'amh'
                      ? '“በእንቅስቃሴ እና በእንክብካቤ የላቀ ውጤት በማስመዝገብ የሰዎችን ሕይወት የሚቀይር የኢትዮጵያ ቀዳሚ የፊዚዮቴራፒ እና የመልሶ ማቋቋም አገልግሎት አቅራቢ መሆን።”'
                      : '“To be Ethiopia’s leading physiotherapy and rehabilitation provider, transforming lives through excellence in movement and care.”'}
                  </p>
                </div>

                <div className="relative z-10">
                  <h2
                    ref={visionTitleRef}
                    className="text-6xl md:text-8xl font-semibold text-[#FFF200] leading-none uppercase select-none opacity-80"
                  >
                    {language === 'amh' ? 'ራዕይ' : 'VISION'}
                  </h2>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL: MISSION */}
            <div className="relative w-full md:w-1/2 min-h-[50vh] xl:min-h-[60vh] flex flex-col justify-between p-8 md:p-12 lg:p-16 group">
              {/* Background Image Layer */}
              <div className="absolute inset-0 z-0 opacity-30 grayscale group-hover:grayscale-0 transition-all group-hover:opacity-60 duration-700">
                {/* Replace with your local asset */}
                <img src={IMG_3651} alt="Vision" className="w-full h-full object-cover" />
              </div>

              <div className='flex flex-col gap-10 md:gap-20 justify-center flex-1'>
                <div className="relative z-10">
                  <h2
                    ref={missionTitleRef}
                    className="text-6xl md:text-8xl font-semibold text-[#FFF200] leading-none uppercase select-none opacity-80"
                  >
                    {language === 'amh' ? 'ተልዕኮ' : 'MISSION'}
                  </h2>
                </div>

                <div className="relative z-10">
                  <p className="mv-text text-white/90 text-lg max-w-md font-light leading-relaxed mb-4">
                    {language === 'amh'
                      ? '“ተግባርን ወደ ነበረበት የሚመልሱ፣ ህመምን የሚቀንሱ እና የኑሮ ጥራትን የሚያሻሽሉ በማስረጃ ላይ የተመሰረቱ፣ ታካሚን ማዕከል ያደረጉ የፊዚዮቴራፒ አገልግሎቶችን በባለሙያዎች እና በፈጠራ የመልሶ ማቋቋም መፍትሄዎች እንሰጣለን።”'
                      : '“We deliver evidence-based, patient-centered physiotherapy services that restore function, reduce pain, and enhance quality of life through skilled professionals and innovative rehabilitation solutions.”'}
                  </p>
                </div>
              </div>
            </div>

            {/* Overlapping Center Accent */}
            <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-4/5 bg-white/20 z-20" />
          </div>
        </section>

        {/* ========== NEWS SECTION ========== */}
        <section className="relative z-10 bg-[#F7F7F5] min-h-screen py-16 px-6 md:px-24 flex flex-col justify-center pointer-events-auto">
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
              <h2 className="text-[#745893] font-medium text-xl md:text-3xl lg:text-4xl leading-tight">
                {language === 'amh'
                  ? <>ድሮጋ ፊዚዮቴራፒ<br className="hidden md:block" /> የማህበራዊ ሚዲያ ልጥፎች</>
                  : <>Droga Physiotherapy<br className="hidden md:block" /> Social Media Posts</>}
              </h2>

              <Link to="/news" className="bg-[#745893] text-white px-4 md:px-5 py-2 md:py-2.5 rounded-full flex items-center gap-2 hover:bg-[#5d4677] transition shadow-md w-fit text-sm md:text-base">
                {language === 'amh' ? 'ተጨማሪ ይመልከቱ' : 'View More'}
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>

            {/* Cards Slider Track */}
            <div className="relative overflow-hidden -mx-6 md:-mx-0 px-6 md:px-0">
              <div
                ref={sliderTrackRef}
                className="flex gap-4 md:gap-10 transition-none"
                style={{ width: 'max-content' }}
              >
                {bufferedNews.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="flex flex-col gap-4 md:gap-5 w-[80vw] sm:w-[320px] md:w-[380px] lg:w-[420px] xl:w-[480px] shrink-0"
                  >
                    {/* Image Header */}
                    <div
                      className="rounded-2xl overflow-hidden h-[200px] md:h-[250px] flex items-end p-5 md:p-6 text-white bg-cover bg-center relative group"
                      style={{ backgroundImage: `url(${item.img})` }}
                    >
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                      <p className="relative z-10 text-lg md:text-xl font-bold whitespace-pre-line leading-tight">
                        {item.title}
                      </p>
                    </div>

                    {/* Tag & Social Icon */}
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] md:text-xs font-semibold border border-[#745893]/30 px-3 py-1 rounded-full text-[#745893] uppercase tracking-wider">
                        {language === 'amh' ? '# ዜና' : '# News'}
                      </span>

                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#745893] bg-[#745893] flex items-center justify-center cursor-pointer transition-all hover:bg-[#5d4677] hover:scale-110 shadow-md">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-[#F7F7F5]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5zM.22 8h4.54v14H.22V8zm7.56 0h4.35v1.92h.06c.61-1.16 2.1-2.38 4.33-2.38 4.63 0 5.48 3.05 5.48 7.02V22h-4.54v-6.93c0-1.65-.03-3.78-2.3-3.78-2.3 0-2.65 1.8-2.65 3.66V22H7.78V8z" />
                        </svg>
                      </div>
                    </div>

                    {/* Content Snippet */}
                    <p className="text-[#5F5A66] text-xs md:text-sm leading-relaxed line-clamp-3">
                      {item.content}
                    </p>

                    {/* Footer */}
                    <div className="flex justify-between items-center text-[10px] md:text-xs mt-auto border-t border-gray-100 pt-3 md:pt-4 pb-2 md:pb-0">
                      <span className="text-gray-400 font-medium tracking-wide">{item.date}</span>
                      <Link to="/news" className="text-[#745893] font-bold cursor-pointer hover:underline underline-offset-4 flex items-center gap-1 group/more">
                        {language === 'amh' ? 'ተጨማሪ ያንብቡ' : 'Read More'}
                        <span className="transition-transform group-hover/more:translate-x-1">→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons Row - Positioned at the bottom right */}
            <div className="flex justify-end items-center gap-4 md:gap-6 mt-6 md:mt-4">
              {/* Previous Button */}
              <button
                onClick={prevSlide}
                aria-label="Previous News"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-[#745893]/20 flex items-center justify-center text-[#745893] hover:bg-[#745893] hover:text-[#F7F7F5] hover:border-[#745893] transition-all duration-500 group shadow-sm hover:shadow-xl"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 rotate-180 transition-transform duration-500 group-hover:-translate-x-1"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                aria-label="Next News"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#745893] text-[#F7F7F5] flex items-center justify-center hover:bg-[#5d4677] transition-all duration-500 group shadow-md hover:shadow-2xl hover:-translate-y-1"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-500 group-hover:translate-x-1"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* ========== LOCATIONS SECTION ========== */}
        <section className="relative z-10 bg-[#F7F7F5] min-h-[calc(100vh-80px)] px-6 md:px-24 py-10 overflow-hidden flex flex-col pointer-events-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-[#745893] font-semibold text-2xl md:text-4xl leading-none uppercase">
              {language === 'amh' ? 'የእንክብካቤ አውታረ መረባችን' : 'Our Network of Care'}
            </h2>
            <p className="text-[#5F5A66] text-sm mt-2">
              {language === 'amh' ? 'ሙሉ መረጃ ለማየት ቅርንጫፍ ላይ ጠቅ ያድርጉ።' : 'Click on a branch to view full information.'}
            </p>
          </div>

          {/* Main Layout */}
          <div className="flex flex-col md:flex-row flex-1 gap-6 overflow-visible md:overflow-hidden">

            {/* LEFT LIST / MOBILE TABS */}
            <div className="w-full md:w-[220px] flex flex-row md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 pr-0 md:pr-2 hide-scrollbar shrink-0">
              {branches.map((branch, index) => {
                const isActive = index === activeBranchIndex;

                return (
                  <button
                    key={branch.name}
                    onClick={() => setActiveBranchIndex(index)}
                    className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 text-left bg-white transition rounded-2xl md:rounded-sm shrink-0 whitespace-nowrap
                      ${isActive ? "border-b-4 md:border-b-0 md:border-l-4 border-[#745893] shadow-sm bg-[#F6EAF8]" : "hover:shadow-sm border-b-4 md:border-b-0 md:border-l-4 border-transparent"}
                    `}
                  >
                    <div className={`w-7 h-7 md:w-9 md:h-9 rounded-full ${isActive ? "bg-[#745893]" : "bg-[#745893]/10"} flex items-center justify-center shrink-0`}>
                      <svg className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isActive ? "text-[#F7F7F5]" : "text-[#745893]"}`} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      </svg>
                    </div>

                    <span className={`text-sm font-medium ${isActive ? "text-[#745893]" : ""}`}>
                      {branch.name.replace(" Branch", "")}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex-1 bg-white rounded-xl shadow-sm flex flex-col md:flex-row overflow-hidden min-h-[400px]">

              {/* DETAILS */}
              <div className="flex-1 relative min-h-[400px] overflow-hidden">
                <img
                  src={[boleImg, kiloImg, kebenaImg, lebuImg, summitImg][activeBranchIndex]}
                  alt={activeBranch.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/30" />

                <div className="relative z-10 h-full p-5 md:p-6 flex flex-col justify-between text-white">
                  <div>
                    <h3 className="text-xl md:text-2xl tracking-wider font-semibold uppercase drop-shadow">
                      {activeBranch.name}
                    </h3>

                    <p className="text-xs md:text-sm mt-2 md:mt-3 leading-relaxed max-w-xl text-white/90">
                      {activeBranch.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 text-sm">
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
                        <span className="text-[10px] md:text-xs text-white/70 uppercase">
                          {language === 'amh' ? 'ስልክ' : 'Phone'}
                        </span>
                        <p className="font-medium tracking-widest mt-1">{activeBranch.phone}</p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
                        <span className="text-[10px] md:text-xs text-white/70 uppercase">
                          {language === 'amh' ? 'አድራሻ' : 'Address'}
                        </span>
                        <p className="font-medium tracking-wider mt-1 pr-2">{activeBranch.address}</p>
                      </div>

                      <div className="col-span-1 sm:col-span-2 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
                        <span className="text-[10px] md:text-xs text-white/70 uppercase">
                          {language === 'amh' ? 'ሰዓታት' : 'Hours'}
                        </span>
                        <p className="font-medium tracking-wider whitespace-pre-line mt-1">
                          {activeBranch.hours}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Link
                      to="/appointment"
                      className="bg-[#FFF200] px-5 py-2.5 md:py-2 rounded-full text-center text-sm font-semibold hover:bg-[#745893] hover:text-white transition-colors text-black"
                    >
                      {language === 'amh' ? 'ቀጠሮ ይያዙ' : 'Set Appointment'}
                    </Link>

                    <Link
                      to="/appointment"
                      className="bg-white/15 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 md:py-2 rounded-full text-center text-sm hover:bg-white/25 transition-colors"
                    >
                      {language === 'amh' ? 'ካርታ ይመልከቱ' : 'View Map'}
                    </Link>
                  </div>
                </div>
              </div>

              {/* SERVICES */}
              <div className="w-full md:w-[240px] lg:w-[280px] bg-[#F6EAF8] p-5 md:p-6 flex flex-col border-t md:border-t-0 md:border-l border-[#745893]/10">
                <h4 className="text-lg md:text-xl text-[#745893] uppercase tracking-wider font-semibold">
                  {language === 'amh' ? 'አገልግሎቶች' : 'Services'}
                </h4>

                <div className="mt-4 space-y-3 md:space-y-4 text-xs md:text-sm overflow-y-auto pr-1 flex-1">
                  {activeBranch.unavailable ? (
                    <p className="text-gray-500 italic">
                      {language === 'amh' ? 'የአገልግሎት ዝርዝር አልተገኘም።' : 'Service list unavailable.'}
                    </p>
                  ) : (
                    activeBranch.services.map((service) => (
                      <div key={service} className="flex gap-2 items-start">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#745893] rounded-full mt-1.5 md:mt-2 shrink-0" />
                        <span className="text-[#333] leading-snug font-light break-words">{service}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========== FOOTER ========== */}
        <div className="pointer-events-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Home;