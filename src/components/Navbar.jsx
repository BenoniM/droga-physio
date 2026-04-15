import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import physioLogo from '../assets/nav/physioLogo.svg'
import highlight from '../assets/nav/highlight.svg'
import { useLanguage } from '../context/LanguageContext'

function Navbar({ scrollY, isLightBg: propIsLightBg }) {
  const location = useLocation()
  const [animTrigger, setAnimTrigger] = useState(0)
  const [mediaOpen, setMediaOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()

  // Animation state for the language "swap" effect
  const [langAnim, setLangAnim] = useState({
    startX: 0,
    startY: 0,
    animating: false,
    prevLang: language
  })

  // Localized nav links
  const localizedNavLinks = [
    { label: t.navbar.home, path: '/' },
    { label: t.navbar.about, path: '/about' },
    { label: t.navbar.service, path: '/service' },
    { label: t.navbar.faq, path: '/faq' },
    {
      label: t.navbar.media,
      path: '/media',
      dropdown: [
        { label: t.navbar.gallery, path: '/gallery' },
        { label: t.navbar.news, path: '/news' },
        { label: t.navbar.blog, path: '/blog' },
      ],
    },
    { label: t.navbar.contact, path: '/contact' },
  ]
  
  const navRef = useRef(null)
  const [dynamicIsLightBg, setDynamicIsLightBg] = useState(true)
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollY = useRef(0)

  // ... (Keep existing useEffect hooks for scroll and background detection)
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [mobileMenuOpen])

  useEffect(() => {
    if (mobileMenuOpen) {
      setIsHidden(false)
      lastScrollY.current = scrollY
      return
    }
    const currentScrollY = scrollY < 0 ? 0 : scrollY
    const difference = currentScrollY - lastScrollY.current
    if (currentScrollY > 150 && difference > 0) {
      setIsHidden(true)
    } else if (difference < -5 || currentScrollY <= 150) {
      setIsHidden(false)
    }
    lastScrollY.current = currentScrollY
  }, [scrollY, mobileMenuOpen])

  useEffect(() => {
    const checkBg = () => {
      if (propIsLightBg !== undefined || location.pathname === '/') return;
      const x = window.innerWidth / 2;
      const y = 40; 
      const elements = document.elementsFromPoint(x, y);
      if (!elements || elements.length === 0) return;
      const targetEl = elements.find(el => !navRef.current?.contains(el));
      if (targetEl) {
        let currentEl = targetEl;
        let isLight = true; 
        while (currentEl && currentEl !== document.documentElement) {
          const bg = window.getComputedStyle(currentEl).backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            const rgba = bg.match(/\d+/g);
            if (rgba && rgba.length >= 3) {
              const a = rgba.length === 4 ? parseFloat(rgba[3]) / 255 : 1;
              if (a > 0.1) {
                const r = parseInt(rgba[0]); const g = parseInt(rgba[1]); const b = parseInt(rgba[2]);
                const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                isLight = luminance > 0.5; break;
              }
            }
          }
          currentEl = currentEl.parentElement;
        }
        setDynamicIsLightBg(isLight);
      }
    };
    checkBg();
  }, [scrollY, location.pathname, propIsLightBg]);

  const heroHeight = window.innerHeight * 0.75
  const homeLightBg = (scrollY > heroHeight && scrollY < 1575) || (scrollY > 3650 && scrollY < 4350) || scrollY > 4850
  const isLightBg = propIsLightBg !== undefined ? propIsLightBg : location.pathname === '/' ? homeLightBg : dynamicIsLightBg

  const linkColor = isLightBg ? '#745893' : '#F7F7F5'
  const navGlass = isLightBg
    ? 'bg-[#F7F7F5]/75 shadow-[0_10px_30px_rgba(116,88,147,0.12)]'
    : 'bg-[#745893]/20 shadow-[0_10px_30px_rgba(0,0,0,0.18)]'

  const isMediaRoute = ['/media', '/gallery', '/news', '/blog'].includes(location.pathname)

  // Language animation handler
  const handleLanguageToggle = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Vector from center to click point
    let dx = clickX - centerX;
    let dy = clickY - centerY;
    const mag = Math.sqrt(dx * dx + dy * dy) || 1;
    const travelDistance = 40; // Pixels to slide

    setLangAnim({
      startX: (dx / mag) * travelDistance,
      startY: (dy / mag) * travelDistance,
      animating: true,
      prevLang: language
    });

    toggleLanguage();
    setTimeout(() => setLangAnim(prev => ({ ...prev, animating: false })), 500);
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translate(var(--sx), var(--sy)); opacity: 0; }
          to { transform: translate(0, 0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translate(0, 0); opacity: 1; }
          to { transform: translate(calc(var(--sx) * -1), calc(var(--sy) * -1)); opacity: 0; }
        }
      `}</style>

      <nav 
        ref={navRef} 
        className={`absolute top-0 left-0 w-full z-[45] transition-transform duration-300 ease-in-out ${isHidden ? '-translate-y-[150%]' : 'translate-y-0'}`}
      >
        {/* Relative wrapper for the whole top bar */}
        <div className="relative mx-4 md:mx-12 lg:mx-24 mt-5">
          
          {/* Main Glass Nav - Width remains exactly as defined */}
          <div className={`rounded-full backdrop-blur-xs flex items-center ${navGlass}`}>
            <div className="flex items-center justify-between w-full px-6 lg:px-8 py-3 lg:py-4">
              <Link to="/" className="shrink-0">
                <img src={physioLogo} alt="Droga Physiotherapy" className="h-8 lg:h-10" />
              </Link>

              <ul className="hidden lg:flex items-center gap-8">
                {localizedNavLinks.map((item) => {
                  const isDropdown = !!item.dropdown
                  const isActive = isDropdown ? isMediaRoute : location.pathname === item.path
                  return (
                    <li key={item.label} className="relative"
                        onMouseEnter={() => { if (isDropdown) setMediaOpen(true); if (isActive) setAnimTrigger(p => p + 1); }}
                        onMouseLeave={() => { if (isDropdown) setMediaOpen(false); }}>
                      {isDropdown ? (
                        <button type="button" className="group flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:!text-[#FFF200]" style={{ color: linkColor }}>
                          <span>{item.label}</span>
                          <ChevronDown size={16} className={`transition-transform duration-300 ${mediaOpen ? 'rotate-180' : 'rotate-0'}`} />
                        </button>
                      ) : (
                        <Link to={item.path} className="relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:!text-[#FFF200]" style={{ color: linkColor }}>
                          {item.label}
                        </Link>
                      )}
                      {isActive && (
                        <img key={animTrigger} src={highlight} alt="" className={`pointer-events-none absolute inset-0 h-full w-full ${isDropdown ? 'scale-[1.2]' : 'scale-[1.85]'} object-fill opacity-80 animate-swoosh`} />
                      )}
                      {/* ... (Drop down menu logic remains same) */}
                    </li>
                  )
                })}
              </ul>

              <div className="hidden lg:flex items-center gap-4">
                <Link to="/appointment" className="rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:!bg-[#FFF200] hover:!text-black"
                  style={{
                    backgroundColor: location.pathname === '/appointment' ? '#FFF200' : isLightBg ? '#745893' : '#F7F7F5',
                    color: location.pathname === '/appointment' ? '#000000' : isLightBg ? '#F7F7F5' : '#745893',
                  }}>
                  {t.navbar.bookNow}
                </Link>
              </div>

              <button className="lg:hidden flex items-center justify-center p-2" onClick={() => setMobileMenuOpen(true)} style={{ color: linkColor }}>
                <Menu size={28} />
              </button>
            </div>
          </div>

          {/* Language Toggle - Absolutely positioned to the right of the glass nav, vertically centered */}
          <div className="hidden lg:block absolute right-[-12px] translate-x-full top-1/2 -translate-y-1/2">
            <button
              onClick={handleLanguageToggle}
              className="group relative overflow-hidden w-15 h-15 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:!bg-[#FFF200] hover:!text-black hover:!border-transparent"
              style={{
                borderColor: linkColor,
                color: linkColor,
                backgroundColor: isLightBg ? 'rgba(247,247,245,0.8)' : 'rgba(116,88,147,0.3)',
                '--sx': `${langAnim.startX}px`,
                '--sy': `${langAnim.startY}px`
              }}
            >
              {/* Outgoing Language */}
              {langAnim.animating && (
                <span 
                  className="absolute leading-none" 
                  style={{ 
                    animation: 'slideOut 0.4s ease-in forwards',
                    fontFamily: langAnim.prevLang === 'en' ? 'AmharicFont' : 'Delight',
                    fontWeight: langAnim.prevLang === 'en' ? '400' : '700'
                  }}
                >
                  {langAnim.prevLang === 'en' ? 'አማ' : 'EN'}
                </span>
              )}
              
              {/* Incoming Language */}
              <span 
                key={language} 
                className="absolute leading-none" 
                style={{ 
                  animation: langAnim.animating ? 'slideIn 0.4s ease-out forwards' : 'none',
                  fontFamily: language === 'en' ? 'AmharicFont' : 'Delight',
                  fontWeight: language === 'en' ? '400' : '700'
                }}
              >
                {language === 'en' ? 'አማ' : 'EN'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        <div 
          className={`fixed inset-0 z-[99] bg-black/50 backdrop-blur-md transition-opacity duration-500 ease-in-out h-screen ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Mobile Menu Drawer */}
        <div 
          className={`fixed top-0 right-0 bottom-0 h-screen w-[85%] max-w-[400px] z-[100] bg-white flex flex-col overflow-y-auto hide-scrollbar transition-transform duration-500 ease-in-out shadow-2xl ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Close & Lang Button */}
          <div className=''>
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="absolute top-6 right-6 lg:top-8 lg:right-8 w-12 h-12 bg-[#745893] rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
            >
              <X size={24} strokeWidth={2.5} className='text-[#F7F7F5]' />
            </button>

            <button
              onClick={() => {
                toggleLanguage()
                setMobileMenuOpen(false)
              }}
              className="absolute top-6 left-6 lg:top-8 lg:left-8 w-24 h-12 border-2 border-[#745893] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-[#FFF200] hover:text-black hover:border-transparent text-[#745893]"
              style={{
                /* if language is 'en', we show Amharic text -> use AmharicFont */
                fontFamily: language === 'en' ? 'AmharicFont' : 'Delight',
                fontWeight: language === 'en' ? '400' : '500',
                fontSize: language === 'en' ? '1rem' : '1rem'
              }}
            >
              {language === 'en' ? 'አማርኛ' : 'English'}
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 flex flex-col items-center justify-center gap-8 mt-12">
            {localizedNavLinks.filter(item => item.label !== t.navbar.media).map((item) => {
              const isDropdown = !!item.dropdown;
              const isActive = isDropdown ? isMediaRoute : location.pathname === item.path;

              return (
                <div 
                  key={item.label} 
                  className="relative"
                  onMouseEnter={() => {
                    if (isActive) setAnimTrigger((p) => p + 1)
                  }}
                >
                  <Link 
                    to={item.path} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`relative z-10 text-[2.5rem] block py-1 font-light tracking-wide text-[#1A1A1A] hover:text-[#FFF200] transition-colors ${language === 'amh' ? 'font-compacta' : ''}`}
                  >
                    {item.label}
                  </Link>

                  {isActive && (
                    <img
                      key={animTrigger}
                      src={highlight}
                      alt=""
                      className="pointer-events-none absolute inset-0 h-full w-full scale-[1.5] object-fill opacity-80 animate-swoosh z-0"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex gap-4 px-5 pb-12 w-full mt-auto">
            <div className="flex justify-between items-center w-full">
              <Link
                to="/appointment"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full px-6 py-2 text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] hover:!bg-[#FFF200] hover:!text-black shadow-md"
                style={{
                  backgroundColor: location.pathname === '/appointment' ? '#FFF200' : '#745893',
                  color: location.pathname === '/appointment' ? '#000000' : '#F7F7F5',
                }}
              >
                {t.navbar.bookNow}
              </Link>
            </div>

            <div className="flex items-center gap-6">
              {[
                { label: t.navbar.blog, path: '/blog' },
                { label: t.navbar.news, path: '/news' },
                { label: t.navbar.gallery, path: '/gallery' }
              ].map((item) => {
                const isActive = location.pathname === item.path

                return (
                  <div 
                    key={item.label} 
                    className="relative"
                    onMouseEnter={() => {
                      if (isActive) setAnimTrigger((p) => p + 1)
                    }}
                  >
                    <Link 
                      to={item.path} 
                      onClick={() => setMobileMenuOpen(false)} 
                      className="relative z-10 text-[#1A1A1A] text-sm md:text-base font-medium hover:text-[#FFF200] transition-colors"
                    >
                      {item.label}
                    </Link>

                    {isActive && (
                      <img
                        key={animTrigger}
                        src={highlight}
                        alt=""
                        className="pointer-events-none absolute inset-0 h-full w-full scale-[1.8] object-fill opacity-80 animate-swoosh z-0"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar