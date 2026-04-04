import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import physioLogo from '../assets/nav/physioLogo.svg'
import highlight from '../assets/nav/highlight.svg'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Service', path: '/service' },
  { label: 'FAQ', path: '/faq' },
  {
    label: 'Media',
    path: '/media',
    dropdown: [
      { label: 'Gallery', path: '/gallery' },
      { label: 'News', path: '/news' },
      { label: 'Blog', path: '/blog' },
    ],
  },
  { label: 'Contact', path: '/contact' },
]

function Navbar({ scrollY, isLightBg: propIsLightBg }) {
  const location = useLocation()
  const [animTrigger, setAnimTrigger] = useState(0)
  const [mediaOpen, setMediaOpen] = useState(false)
  
  const navRef = useRef(null)
  const [dynamicIsLightBg, setDynamicIsLightBg] = useState(true)

  useEffect(() => {
    const checkBg = () => {
      // Don't override if explicitly passed, or if we are on the Home page (which has precise layered parallax rules)
      if (propIsLightBg !== undefined || location.pathname === '/') return;

      const x = window.innerWidth / 2;
      const y = 40; // Approx vertical center of the navbar
      const elements = document.elementsFromPoint(x, y);
      
      if (!elements || elements.length === 0) return;
      
      const targetEl = elements.find(el => !navRef.current?.contains(el));

      if (targetEl) {
        let currentEl = targetEl;
        let isLight = true; // Default to light

        while (currentEl && currentEl !== document.documentElement) {
          const bg = window.getComputedStyle(currentEl).backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            const rgba = bg.match(/\d+/g);
            if (rgba && rgba.length >= 3) {
              const a = rgba.length === 4 ? parseFloat(rgba[3]) / 255 : 1;
              if (a > 0.1) {
                const r = parseInt(rgba[0]);
                const g = parseInt(rgba[1]);
                const b = parseInt(rgba[2]);
                const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                isLight = luminance > 0.5;
                break;
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
  const homeLightBg =
    (scrollY > heroHeight && scrollY < 1575) ||
    (scrollY > 3650 && scrollY < 4350) ||
    scrollY > 4850

  const isLightBg =
    propIsLightBg !== undefined
      ? propIsLightBg
      : location.pathname === '/'
        ? homeLightBg
        : dynamicIsLightBg

  const linkColor = isLightBg ? '#745893' : '#F7F7F5'
  const navGlass = isLightBg
    ? 'bg-[#F7F7F5]/75 shadow-[0_10px_30px_rgba(116,88,147,0.12)]'
    : 'bg-[#745893]/20 shadow-[0_10px_30px_rgba(0,0,0,0.18)]'

  const isMediaRoute =
    location.pathname === '/media' ||
    location.pathname === '/gallery' ||
    location.pathname === '/news' ||
    location.pathname === '/blog'

  return (
    <nav ref={navRef} className="absolute top-0 left-0 w-full z-[45]">
      <div
        className={`mx-24 mt-5 rounded-full backdrop-blur-xs ${navGlass}`}
      >
        <div className="flex items-center justify-between px-8 py-4">
          <Link to="/" className="shrink-0">
            <img src={physioLogo} alt="Droga Physiotherapy" className="h-10" />
          </Link>

          <ul className="flex items-center gap-8">
            {navLinks.map((item) => {
              const isDropdown = !!item.dropdown
              const isActive = isDropdown
                ? isMediaRoute
                : location.pathname === item.path

              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    if (isDropdown) setMediaOpen(true)
                    if (isActive) setAnimTrigger((p) => p + 1)
                  }}
                  onMouseLeave={() => {
                    if (isDropdown) setMediaOpen(false)
                  }}
                >
                  {isDropdown ? (
                    <button
                      type="button"
                      className={`group flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300`}
                      style={{ color: linkColor }}
                    >
                      <span>Media</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${
                          mediaOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className={`relative z-10 rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300`}
                      style={{ color: linkColor }}
                    >
                      {item.label}
                    </Link>
                  )}

                  {isActive && (
                    <img
                      key={animTrigger}
                      src={highlight}
                      alt=""
                      className={`pointer-events-none absolute inset-0 h-full w-full ${isDropdown ? 'scale-[1.2]' : 'scale-[1.85]'} object-fill opacity-80 animate-swoosh`}
                    />
                  )}

                  {isDropdown && mediaOpen && (
                    <div className="absolute left-1/2 top-full -translate-x-1/2 pt-4">
                      <div className="min-w-[210px] overflow-hidden rounded-sm border border-white/15 bg-[#F7F7F5]/95 shadow-2xl backdrop-blur-xl">
                        {item.dropdown.map((subItem) => {
                          const subActive = location.pathname === subItem.path

                          return (
                            <Link
                              key={subItem.label}
                              to={subItem.path}
                              className={`group flex items-center justify-between px-5 py-3 text-sm font-medium transition-all duration-200 ${
                                subActive
                                  ? 'bg-[#745893] text-[#F7F7F5]'
                                  : 'text-[#745893] hover:bg-[#745893] hover:text-[#F7F7F5]'
                              }`}
                            >
                              <span>{subItem.label}</span>

                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                className={`transition-all -rotate-45 group-hover:translate-x-1 ${
                                  subActive ? 'text-[#F7F7F5]' : 'text-[#745893]'
                                } group-hover:text-[#F7F7F5]`}
                              >
                                <path
                                  d="M16.667 10L11.667 15M16.667 10L11.667 5M16.667 10H7.91699M3.33366 10H5.41699"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>

          <Link
            to="/appointment"
            className="rounded-full px-6 py-2 text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] hover:opacity-95"
            style={{
              backgroundColor: location.pathname === '/appointment' ? '#FFF200' : isLightBg ? '#745893' : '#F7F7F5',
              color: location.pathname === '/appointment' ? '#000000' : isLightBg ? '#F7F7F5' : '#745893',
            }}
          >
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar