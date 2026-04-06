import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import landingBg from '../assets/home/landingBg.jpg';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import IMG_3575 from '../assets/home/IMG_3575.JPG';
import IMG_3651 from '../assets/home/IMG_3651.JPG';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Home() {
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

  const serviceTargetProgress = useRef(0);
  const serviceSmoothProgress = useRef(0);
  const [serviceProgress, setServiceProgress] = useState(0);

  const sectionRef = useRef(null);
  const missionTitleRef = useRef(null);
  const visionTitleRef = useRef(null);
  const contentRef = useRef(null);

  // Initial loading & hero slide
  useEffect(() => {
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
    if (!imgDims.current || !drogaRef.current || !physioRef.current) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const { w: iw, h: ih } = imgDims.current;

    const ratio = Math.max(vw / iw, vh / ih);
    const bgW = iw * ratio;
    const bgH = ih * ratio;

    const coverOffX = (vw - bgW) / 2;
    const coverOffY = (vh - bgH) / 2;

    const drogaRect = drogaRef.current.getBoundingClientRect();
    const physioRect = physioRef.current.getBoundingClientRect();

    setBgStyles({
      droga: {
        backgroundSize: `${bgW / scaleX}px ${bgH}px`,
        backgroundPosition: `${(coverOffX - drogaRect.left) / scaleX}px ${
          coverOffY - drogaRect.top
        }px`,
      },
      physio: {
        backgroundSize: `${bgW / scaleX}px ${bgH}px`,
        backgroundPosition: `${(coverOffX - physioRect.left - 7) / scaleX}px ${
          coverOffY - physioRect.top
        }px`,
      },
    });
  }, []);

  // Load image and store natural dimensions
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgDims.current = { w: img.naturalWidth, h: img.naturalHeight };
      updateBgPositions();
    };
    img.src = landingBg;
  }, [updateBgPositions]);

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

    const animateProgress = () => {
      serviceSmoothProgress.current +=
        (serviceTargetProgress.current - serviceSmoothProgress.current) * 0.08;

      setServiceProgress(serviceSmoothProgress.current);
      requestAnimationFrame(animateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    animateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
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
    ), url(${landingBg})`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
  };

  // TitleLine component
  const TitleLine = ({ text, refEl, bgStyle }) => (
    <div className="relative inline-block">
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 block font-['Compacta'] text-[15vw] leading-[0.95] origin-left blur-[0.5px]"
        style={{
          ...textBaseStyle,
          ...bgStyle,
          opacity: 0.9,
          transform: `scaleX(${scaleX})`,
        }}
      >
        {text}
      </span>
      <span
        ref={refEl}
        className="relative block font-['Compacta'] text-[15vw] leading-[0.95] origin-left"
        style={{
          color: 'rgba(247, 247, 245, 0.78)',
          WebkitTextFillColor: 'rgba(247, 247, 245, 0.78)',
          transform: `scaleX(${scaleX})`,
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

  const testimonials = [
    {
      name: "Ermiyas T.",
      role: "PATIENT",
      quote: "Droga Physiotherapy Clinic gave me my life back. I came in with severe lower-back pain that had been affecting my work and sleep for months. The therapists took time to understand my condition, created a personalized treatment plan, and guided me through every step. After a few sessions, the improvement was unbelievable. I can now move freely and pain-free. Highly recommended!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800", // Placeholder for the image in your reference
    },
    {
      name: "Aster B.",
      role: "PATIENT",
      quote: "I am very impressed with the professionalism and care at Droga Physiotherapy Clinic. The team is friendly, knowledgeable, and truly dedicated to patient recovery. Their modern equipment and clean environment made every visit comfortable. I felt supported from my first consultation to my final session. This clinic is definitely the best choice for physiotherapy.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Semira Mukhtar",
      role: "PATIENT",
      quote: "As an athlete, I needed a physiotherapy clinic that understood sports injuries — and Droga Physiotherapy Clinic exceeded my expectations. They helped me recover from a knee injury and guided me through strengthening exercises that improved my performance. I’m now back on the field stronger than ever. Thank you to the entire Droga team for their outstanding care!",
      image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

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

  const branches = [
    {
      name: "Bole Branch",
      description: "focus on the bone therapy",
      phone: "+251965757523",
      address: "Bole Next to Japan Embassy",
      hours: "Monday - Saturday:\n08:00 - 09:00",
      services: [
        "Mobility & Movement Restoration",
        "Specialized Programs",
        "Strength & Conditioning",
        "Neurological Rehabilitation",
        "Injury Rehabilitation",
        "Pain Management & Relief",
      ],
    },
    {
      name: "4-Kilo Branch",
      description:
        "Arat kilo branch is our second branch opened at 2022 GC. This branch constitutes Senior health professionals and Experts at the field.",
      phone: "+251965757526",
      address: "4-Kilo Besides Tourist hotel at Nib bank building.",
      hours: "Monday-Saturday:\n08:00 - 09:00",
      services: [
        "Pain Management & Relief",
        "Injury Rehabilitation",
        "Neurological Rehabilitation",
        "Strength & Conditioning",
        "Specialized Programs",
        "Mobility & Movement Restoration",
      ],
    },
    {
      name: "Kebena Branch (Pediatric)",
      description: "Droga Pediatric physiotherapy center",
      phone: "+251940332122",
      address:
        "Bel Air Kebena (From Addis view hotel 200 meters by the road leading to the palace)",
      hours: "Monday - Saturday:\n08:00 - 09:00\nThis Branch is Only for Childern.",
      services: [
        "Gross Motor Skills Development",
        "Neurodevelopmental Support",
        "Rehabilitation & Injury Care",
        "Fine Motor & School Skills",
        "Activities of Daily Living (ADLs)",
        "Regulation & Behavior",
      ],
    },
    {
      name: "Lebu Branch",
      description:
        "Our Lebu branch is our Third adult physiotherapy branch opened at 2024 GC. This branch constitutes Senior health professionals and Experts at the field",
      phone: "+251935999777",
      address: "Lebu Varnero Infront of Chanoly Noodles",
      hours: "Monday - Saturday:\n08:00 - 09:00",
      services: [
        "Mobility & Movement Restoration",
        "Specialized Programs",
        "Strength & Conditioning",
        "Neurological Rehabilitation",
        "Injury Rehabilitation",
        "Pain Management & Relief",
      ],
    },
    {
      name: "Summit Branch",
      description:
        "Our Summit branch is our fifth adult physiotherapy branch opened at 2026 GC. This branch constitutes Senior health professionals and Experts at the field.",
      phone: "0912414697",
      address: "Summit Around 72",
      hours: "Monday - Saturday:",
      services: [],
      unavailable: true,
    },
  ];

  const activeBranch = branches[activeBranchIndex];

  const newsData = [
    {
      title: "ከቀዶ ጥገና በኋላ \n የማገገሚያ ምክሮች",
      content: "ከቀዶ ጥገና ማገገም ፈታኝ ሊሆን ይችላል...",
      date: "2025-10-24",
      img: "src/assets/news/01K8AJ4CXG6T09EWPPD69R0TB51.png",
    },
    {
      title: "የልጆች ህክምና \n ጥቅሞች",
      content: "የሕፃናት ሕክምና ልጆች ሙሉ አቅማቸውን...",
      date: "2025-10-23",
      img: "src/assets/news/01K8AJ4CXG6T09EWPPD69R0TB52.jpg",
    },
    {
      title: "Geriatric Therapy",
      content: "Aging doesn’t mean slowing down...",
      date: "2025-10-23",
      img: "src/assets/news/01K87YZQNX503SN3TQKZEP7S4W.png",
    },
    {
      title: "Sports Injury Recovery",
      content: "Recover faster and stronger with guided therapy...",
      date: "2025-10-22",
      img: "src/assets/news/01K87Z1KWNJPC3BN1T6TMQ8YPR1.png",
    },
    {
      title: "Back Pain Relief Tips",
      content: "Simple exercises to reduce chronic back pain...",
      date: "2025-10-21",
      img: "src/assets/news/01K87Z1KWNJPC3BN1T6TMQ8YPR2.png",
    },
    {
      title: "Posture Correction",
      content: "Improve your posture and avoid long-term damage...",
      date: "2025-10-20",
      img: "src/assets/news/01K87Z55XY4P3JZJD9ZS34C9ZX1.png",
    },
  ];

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
        const cardWidth = sliderTrackRef.current.children[0].offsetWidth + 40; // width + gap
        
        gsap.to(sliderTrackRef.current, {
            x: -currentIndex * cardWidth,
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: () => {
                isTransitioning.current = false;
                
                // Infinite Loop Reset
                if (currentIndex >= newsData.length + 3) {
                    gsap.set(sliderTrackRef.current, { x: -3 * cardWidth });
                    setCurrentIndex(3);
                } else if (currentIndex <= 0) {
                    gsap.set(sliderTrackRef.current, { x: -newsData.length * cardWidth });
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
        className={`fixed inset-0 z-100 bg-[#745893] transition-transform duration-700 ease-in-out ${
          isLoading ? 'translate-y-0' : '-translate-y-full'
        }`}
      />

      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar scrollY={scrollY} />
      </div>

      {/* Hero section */}
      <div
        className="absolute left-0 top-0 z-40 flex h-[75vh] w-full flex-col justify-end bg-[#745893] pb-16"
        style={{
          transform: heroTransform,
          transition: scrollY === 0 ? 'transform 0.7s ease-out' : 'none',
        }}
      >
        <div className="px-24 -mb-12">
          <TitleLine text="DROGA" refEl={drogaRef} bgStyle={bgStyles.droga} />
          <TitleLine
            text="PHYSIOTHERAPY"
            refEl={physioRef}
            bgStyle={bgStyles.physio}
          />
        </div>

        {/* Extra text from second version */}
        <span
          className="font-semibold text-3xl md:text-4xl lg:text-5xl text-white uppercase drop-shadow-md absolute left-243 top-60 w-full"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
        >
          PAIN FREE MOBILITY!
        </span>

        <p className="absolute ml-24 top-145 text-[#F7F7F5] capitalize font-semibold text-lg md:text-2xl max-w-2xl">
          DROGA Physiotherapy is the biggest physiotherapy clinic in Ethiopia.
        </p>

        {/* Special offer box */}
        <div className="absolute scale-80 left-268 top-110 w-full md:w-auto max-w-sm bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 opacity-90 border border-white/20 transition-all hover:shadow-xl">
          <div className="text-center md:text-left">
            <h3 className="text-[#FFF200] font-semibold text-base uppercase tracking-wider">
              SPECIAL OFFER
            </h3>
            <div className="text-4xl md:text-5xl font-black text-[#745893] my-2">
              15% OFF
            </div>
            <p className="text-[#745893] text-sm md:text-base mt-1 leading-relaxed">
              Your first consultation session. Limited slots available this month.
            </p>
            <Link to="/appointment" className="mt-6 w-full bg-[#FFF200] hover:bg-[#5d3e78] text-[#333] hover:text-[#F7F7F5] font-semibold py-3 px-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-md">
              Book An Appointment
              <svg
                className="w-5 h-5 transition-colors duration-300 group-hover:text-[#F7F7F5]"
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

      {/* Background image with transform */}
      <div
        className="fixed top-0 left-0 h-screen w-full bg-center bg-cover bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${landingBg})`,
          transform: bgTransform,
          transition: 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
          filter: 'brightness(0.75)',
        }}
      />

      {/* About Us Panel (Fixed alongside background image) */}
      <div
        className="fixed px-24 h-[60vh] top-[20vh] w-1/2 flex flex-col justify-center gap-5 z-0"
        style={{
          left: redLeft,
          transition: 'left 1s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="h-[1.25px] bg-[#745893] w-50"></div>
            <div className="w-2 h-2 bg-[#745893] rotate-45 -mr-1"></div>
          </div>

          <span className="text-lg font-semibold tracking-widest uppercase text-[#333]">ABOUT US</span>
        </div>

        <div className="text-[#745893] text-[3vw] leading-[1.2] uppercase">
          DROGA PHYSIOTHERAPY SPECIALITY CLINIC
        </div>

        <div className="w-110 text-md leading-relaxed font-light max-w-lg text-[#333]">
          Droga Physiotherapy Specialty Clinic was established in 2015 in Addis Ababa by a group
          of health care professionals, who have an interest in developing the scientific background
          of physiotherapy in Ethiopia.
        </div>

        <div>
          <Link to="/about" className="flex items-center gap-3 border border-[#745893] px-6 py-3 rounded-full bg-[#745893] text-white hover:text-[#FFF200] transition-all duration-300 w-fit">
            View More
            <svg
                className="w-5 h-5 transition-colors duration-300 group-hover:text-[#FFF200]"
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

      {/* Primary Scrolling Content Area */}
      <div className="relative z-10 flex flex-col w-full pointer-events-none">
        {/* Massive transparent spacer */}
        <div className="h-[230vh] w-full" />

        {/* HORIZONTAL SCROLLING SERVICES CONTAINER */}
        <div ref={servicesRef} className="w-full h-[300vh] relative z-20 pointer-events-auto">
          <div className="w-full h-screen sticky top-0 bg-[#745893] overflow-hidden flex flex-col justify-between px-24 py-16">
            
            {/* Horizontal Sliding Filmstrip */}
            <div 
              className="absolute top-25 left-30 h-[65vh] w-[300vw] flex"
              style={{ transform: `translateX(-${serviceProgress * 220}vw)` }}
            >
              {/* SLIDE 1 */}
              <div className="w-screen px-24 flex justify-between items-start relative h-full">
                <div className="flex flex-col z-20">
                  <div className="text-white text-xl tracking-widest uppercase font-light mb-4">SERVICE 01</div>
                  <div className="flex flex-col gap-[0.1em] text-[#FFF200] text-[5vw] leading-[1] opacity-95 drop-shadow-lg">
                    <span>Regulation And</span>
                    <span>Behavior</span>
                  </div>
                </div>
                <div className="absolute left-[28%] top-0 w-[45%] h-full bg-[url('./assets/home/photo_2026-03-27_11-04-18.jpg')] bg-cover bg-center shadow-2xl z-10" />
                <div className="w-[25%] max-w-sm h-full flex items-end z-20 pl-12">
                  <p className="text-white text-sm leading-relaxed font-light">
                    Emotional Regulation: Teaching children to identify feelings and use calming strategies effectively. Focus & Attention: Increasing engagement and task completion, especially for children with ADHD.
                  </p>
                </div>
              </div>

              {/* SLIDE 2 */}
              <div className="w-screen px-24 flex justify-between items-start relative h-full">
                <div className="flex flex-col z-20">
                  <div className="text-white text-xl tracking-widest uppercase font-light mb-4">SERVICE 02</div>
                  <div className="flex flex-col gap-[0.1em] text-[#FFF200] text-[5vw] leading-[1] opacity-95 drop-shadow-lg">
                    <span>Activities Of</span>
                    <span>Daily Living</span>
                    <span>(ADLs)</span>
                  </div>
                </div>
                <div className="absolute left-[28%] top-0 w-[45%] h-full bg-[url('./assets/home/enh.png')] bg-cover bg-center shadow-2xl z-10" />
                <div className="w-[25%] max-w-sm h-full flex items-end z-20 pl-12">
                  <p className="text-white text-sm leading-relaxed font-light">
                    Self-Care Independence: Building skills for dressing, feeding, and grooming. Organization & Executive Functioning: Strategies to improve planning, task initiation, and time management. Play Skills Development: Encouraging appropriate, imaginative, and interactive play.
                  </p>
                </div>
              </div>

              {/* SLIDE 3 */}
              <div className="w-screen px-24 flex justify-between items-start relative h-full">
                <div className="flex flex-col z-20">
                  <div className="text-white text-xl tracking-widest uppercase font-light mb-4">SERVICE 03</div>
                  <div className="flex flex-col gap-[0.1em] text-[#FFF200] text-[5vw] leading-[1] opacity-95 drop-shadow-lg">
                    <span>Fine Motor</span>
                    <span>And</span>
                    <span>School Skills</span>
                  </div>
                </div>
                <div className="absolute left-[28%] top-0 w-[45%] h-full bg-[url('./assets/home/photo_2026-03-27_11-04-45.jpg')] bg-cover bg-center shadow-2xl z-10" />
                <div className="w-[25%] max-w-sm h-full flex items-end z-20 pl-12">
                  <p className="text-white text-sm leading-relaxed font-light">
                    Handwriting Improvement: Developing pencil grip, letter formation, and writing endurance. Scissor Skills & Tool Use: Mastering the fine motor control needed for classroom and craft activities. Sensory Processing: Helping children who are over-responsive or under-responsive to sensory input (sounds, textures, movement) to better participate in daily life.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Footer Area (STATIC) */}
            <div className="w-full relative top-5 mt-auto z-20">
              {/* Dynamic Progress line */}
              <div className="w-full h-[2px] bg-white/30 mb-6 relative">
                <div 
                  className="absolute top-0 left-0 h-full w-full bg-[#F7F7F5] origin-left transition-transform duration-150 ease-out"
                  style={{ transform: `scaleX(${Math.max(0.02, serviceProgress)})` }}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-white text-xl font-light tracking-widest">
                  [{Math.round(serviceProgress * 2) + 1}/3]
                </div>
                <Link to="/service" className="flex items-center gap-3 text-[#FFF200] text-xl font-light tracking-wide hover:opacity-80 transition-opacity">
                  View All Services
                  <svg
                    className="w-7 h-7 text-[#FFF200] transition-colors duration-300 -rotate-45 group-hover:text-[#FFF200]"
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
        </div>

        {/* ========== NEW TESTIMONIAL SECTION ========== */}
        <section className="relative z-10 bg-[#F7F7F5] h-screen py-16 overflow-hidden pointer-events-auto">
          <div className="mx-auto px-6 md:px-24 flex flex-col items-center">
            {/* Heading */}
            <h2 className="text-[#745893] text-3xl md:text-4xl lg:text-6xl leading-tight mb-2 text-center">
              What Our Patients Say
            </h2>

            {/* Subheading */}
            <p className="text-gray-600 text-center text-sm md:text-base max-w-2xl mb-12">
              Real stories from professionals who transformed their personal brand and editorial authority through our dedicated strategic partnership.
            </p>

            {/* Main testimonial layout */}
            <div className="w-full max-w-6xl flex flex-col md:flex-row items-stretch">
              
              {/* Left: Blue div */}
              <div className="relative bottom-3 scale-95 w-full md:w-1/2 h-[300px] md:h-[400px] flex items-center justify-center">
          {testimonials.map((item, index) => {
            const isFront = index === activeIndex;
            const isMiddle = index === (activeIndex + 1) % testimonials.length;
            const isBack = index === (activeIndex + 2) % testimonials.length;

            return (
              <div
                key={index}
                className={`absolute inset-0 m-auto w-3/5 h-full rounded-[15px] overflow-hidden transition-all duration-500 ease-in-out border-b-5 border-[#F7F7F5]
                  ${isFront ? 'z-30 translate-y-0 scale-100 opacity-100 shadow-xl' : ''}
                  ${isMiddle ? 'z-20 translate-y-6 scale-[0.98] opacity-100' : ''}
                  ${isBack ? 'z-10 translate-y-12 scale-[0.95] opacity-100' : 'opacity-0'}
                `}
                style={{
                  backgroundColor: isFront ? 'transparent' : '#D1C6E0',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    isFront ? 'opacity-100' : 'opacity-40'
                  }`}
                />
              </div>
            );
          })}
        </div>

              {/* Right: Red div */}
              <div className="w-full md:w-1/2 h-[300px] md:h-[400px] flex flex-col justify-between  text-left">
                {/* Top content */}
                <div className="space-y-6">
                  <p className="text-[#333] text-lg md:text-xl leading-relaxed font-light italic">
                    "{testimonials[activeIndex].quote}"
                  </p>

                  <div>
                    <h4 className="text-[#745893] font-bold text-xl">
                      {testimonials[activeIndex].name}
                    </h4>
                    <p className="text-gray-400 text-xs tracking-widest uppercase">
                      {testimonials[activeIndex].role}
                    </p>
                  </div>
                </div>

                {/* Bottom controls */}
                <div className="flex items-center justify-between w-full">
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
                        className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                          i === activeIndex ? 'bg-[#745893]' : 'bg-gray-300'
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
            <div className="relative w-full md:w-1/2 h-[55vh] flex flex-col justify-between p-12 group">
              {/* Background Image Layer */}
              <div className="absolute inset-0 z-0 opacity-30 grayscale group-hover:grayscale-0 transition-all group-hover:opacity-60 duration-700">
                {/* Replace with your local asset */}
                <img src={IMG_3575} alt="Vision" className="w-full h-full object-cover" />
              </div>

              <div className='flex flex-col gap-20 justify-center'> 
                <div className="relative z-10 h-1/2 h-30">
                  <p className="mv-text text-white/90 text-lg max-w-md font-light leading-relaxed mb-4">
                    “To be Ethiopia’s leading physiotherapy and rehabilitation provider,
                    transforming lives through excellence in movement and care.”
                  </p>
                </div>

                <div className="relative z-10">
                  <h2 
                    ref={visionTitleRef}
                    className="text-6xl md:text-8xl font-semibold text-[#FFF200] leading-none uppercase select-none opacity-80"
                  >
                    VISSION
                  </h2>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL: MISSION */}
            <div className="relative w-full md:w-1/2 h-[55vh] flex flex-col justify-between p-12 group">
              {/* Background Image Layer */}
              <div className="absolute inset-0 z-0 opacity-30 grayscale group-hover:grayscale-0 transition-all group-hover:opacity-60 duration-700">
                {/* Replace with your local asset */}
                <img src={IMG_3651} alt="Vision" className="w-full h-full object-cover" />
              </div>

              <div className='flex flex-col gap-20 justify-center'> 
                <div className="relative z-10">
                <h2 
                  ref={missionTitleRef}
                  className="text-6xl md:text-8xl font-semibold text-[#FFF200] leading-none uppercase select-none opacity-80"
                >
                  MISSION
                </h2>
              </div>

              <div className="relative z-10 h-1/2 h-30">
                <p className="mv-text text-white/90 text-lg max-w-md font-light leading-relaxed mb-4">
                  “We deliver evidence-based, patient-centered physiotherapy services
                  that restore function, reduce pain, and enhance quality of life through
                  skilled professionals and innovative rehabilitation solutions.”
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
            <div className="flex justify-between items-end">
              <h2 className="text-[#745893] font-semibold text-2xl md:text-4xl lg:text-5xl uppercase">
                Droga Physiotherapy Social <br /> Media Posts
              </h2>

              <Link to="/news" className="bg-[#745893] text-white px-4 py-2.5 rounded-full flex items-center gap-2 hover:bg-[#5d4677] transition shadow-md">
                View More
                <svg
                  className="w-5 h-5"
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
                    className="flex gap-10 transition-none"
                    style={{ width: 'max-content' }}
                >
                    {bufferedNews.map((item, index) => (
                        <div 
                            key={`${item.title}-${index}`} 
                            className="flex flex-col gap-5 w-[calc(100vw-48px)] md:w-[380px] shrink-0"
                        >
                            {/* Image Header */}
                            <div
                                className="rounded-2xl overflow-hidden h-[250px] flex items-end p-6 text-white bg-cover bg-center relative group"
                                style={{ backgroundImage: `url(${item.img})` }}
                            >
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                                <p className="relative z-10 text-xl font-bold whitespace-pre-line leading-tight">
                                    {item.title}
                                </p>
                            </div>

                            {/* Tag & Social Icon */}
                            <div className="flex items-center justify-between w-full">
                                <span className="text-xs font-semibold border border-[#745893]/30 px-3 py-1 rounded-full text-[#745893] uppercase tracking-wider">
                                    # News
                                </span>

                                <div className="w-10 h-10 rounded-full border border-[#745893] bg-[#745893] flex items-center justify-center cursor-pointer transition-all hover:bg-[#5d4677] hover:scale-110 shadow-md">
                                    <svg className="w-5 h-5 text-[#F7F7F5]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5zM.22 8h4.54v14H.22V8zm7.56 0h4.35v1.92h.06c.61-1.16 2.1-2.38 4.33-2.38 4.63 0 5.48 3.05 5.48 7.02V22h-4.54v-6.93c0-1.65-.03-3.78-2.3-3.78-2.3 0-2.65 1.8-2.65 3.66V22H7.78V8z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Content Snippet */}
                            <p className="text-[#5F5A66] text-sm leading-relaxed line-clamp-3">
                                {item.content}
                            </p>

                            {/* Footer */}
                            <div className="flex justify-between items-center text-xs mt-auto border-t border-gray-100 pt-4">
                                <span className="text-gray-400 font-medium tracking-wide">{item.date}</span>
                                <Link to="/news" className="text-[#745893] font-bold cursor-pointer hover:underline underline-offset-4 flex items-center gap-1 group/more">
                                    Read More 
                                    <span className="transition-transform group-hover/more:translate-x-1">→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons Row - Positioned at the bottom right */}
            <div className="flex justify-end items-center gap-6 mt-4">
                {/* Previous Button */}
                <button
                    onClick={prevSlide}
                    aria-label="Previous News"
                    className="w-14 h-14 rounded-full border-2 border-[#745893]/20 flex items-center justify-center text-[#745893] hover:bg-[#745893] hover:text-[#F7F7F5] hover:border-[#745893] transition-all duration-500 group shadow-sm hover:shadow-xl"
                >
                    <svg
                        className="w-6 h-6 rotate-180 transition-transform duration-500 group-hover:-translate-x-1"
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
                    className="w-14 h-14 rounded-full bg-[#745893] text-[#F7F7F5] flex items-center justify-center hover:bg-[#5d4677] transition-all duration-500 group shadow-md hover:shadow-2xl hover:-translate-y-1"
                >
                    <svg
                        className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
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
              Our Network of Care
            </h2>
            <p className="text-[#5F5A66] text-sm mt-2">
              Click on a branch to view full information.
            </p>
          </div>

          {/* Main Layout */}
          <div className="flex flex-1 gap-6 overflow-hidden">

            {/* LEFT LIST */}
            <div className="w-[220px] flex flex-col gap-3 overflow-y-auto pr-2">
              {branches.map((branch, index) => {
                const isActive = index === activeBranchIndex;

                return (
                  <button
                    key={branch.name}
                    onClick={() => setActiveBranchIndex(index)}
                    className={`flex items-center gap-3 px-4 py-3 text-left bg-white transition rounded-sm
                      ${isActive ? "border-l-4 border-[#745893] shadow-sm" : "hover:shadow-sm"}
                    `}
                  >
                    <div className={`w-9 h-9 rounded-full ${isActive ? "bg-[#745893]" : "bg-[#745893]/10"} flex items-center justify-center`}>
                      <svg className={`w-4 h-4 ${isActive ? "text-[#F7F7F5]" : "text-[#745893]"}`} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      </svg>
                    </div>

                    <span className={`text-base font-medium ${isActive ? "text-[#745893]" : ""}`}>
                      {branch.name.replace(" Branch", "")}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex-1 bg-white rounded-xl shadow-sm flex overflow-hidden">

              {/* DETAILS */}
              <div className="flex-1 p-6 flex flex-col justify-between">

                <div>
                  <h3 className="text-2xl font-semibold text-[#745893] uppercase">
                    {activeBranch.name}
                  </h3>

                  <p className="text-sm text-[#6D6576] mt-3 leading-relaxed max-w-xl">
                    {activeBranch.description}
                  </p>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
                    <div>
                      <span className="text-xs text-gray-400 uppercase">Phone</span>
                      <p className="font-semibold">{activeBranch.phone}</p>
                    </div>

                    <div>
                      <span className="text-xs text-gray-400 uppercase">Address</span>
                      <p className="font-semibold">{activeBranch.address}</p>
                    </div>

                    <div>
                      <span className="text-xs text-gray-400 uppercase">Hours</span>
                      <p className="font-semibold whitespace-pre-line">
                        {activeBranch.hours}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-4">
                  <Link to="/appointment" className="bg-[#FFF200] px-5 py-2 rounded-full text-sm font-semibold">
                    Set Appointment
                  </Link>

                  <Link to="/appointment" className="bg-[#745893] text-white px-5 py-2 rounded-full text-sm">
                    View Map
                  </Link>
                </div>
              </div>

              {/* SERVICES */}
              <div className="w-[240px] bg-[#F6EAF8] p-5 flex flex-col">
                <h4 className="text-xl text-[#745893] uppercase">
                  Services
                </h4>

                <div className="mt-4 space-y-3 text-sm overflow-y-auto pr-1">
                  {activeBranch.unavailable ? (
                    <p className="text-gray-500">
                      Service list unavailable.
                    </p>
                  ) : (
                    activeBranch.services.map((service) => (
                      <div key={service} className="flex gap-2 items-start">
                        <div className="w-2 h-2 bg-[#745893] rounded-full mt-1.5" />
                        <span>{service}</span>
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