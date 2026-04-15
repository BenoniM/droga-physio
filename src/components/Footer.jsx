import React from 'react';
import { Link } from 'react-router-dom';
import physioLogoFooter from '../assets/nav/physioLogo.svg';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t, language } = useLanguage();

  const socialIcons = [
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
      link: "https://facebook.com"
    },
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
      link: "https://instagram.com"
    },
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
      link: "https://telegram.org"
    },
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
      link: "tel:0974959595"
    }
  ];

  return (
        <footer className="relative bg-[#745893] text-white overflow-hidden px-6 md:px-16 lg:px-20 min-h-[60vh] md:min-h-[75vh] py-5 flex flex-col justify-between">

            {/* Main Content */}
            <div className="flex flex-col justify-between">

            {/* Top Row */}
            <div className="flex flex-col lg:flex-row justify-between xl:gap-20 mt-4 md:mt-10">

                {/* MOBILE HEADER: Droga + Physiotherapy + Logo */}
                <div className="flex md:hidden items-center justify-between gap-4 mb-8">
                    <div className="flex flex-col gap-2">
                        <div className="font-compacta uppercase leading-[0.85] text-[12vw]">{t.hero.title1}</div>
                        <div className="font-compacta uppercase leading-[0.85] text-[12vw]">{t.hero.title2}</div>
                    </div>
                    <img src={physioLogoFooter} alt="Droga Physiotherapy" className="h-[70px] shrink-0" />
                </div>

                {/* DROGA (Desktop) */}
                <div className="hidden md:block font-compacta uppercase leading-[0.85] text-[clamp(5rem,14vw,50rem)] pointer-events-none">
                {t.hero.title1}
                </div>

                {/* Right columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-nowrap gap-10 md:gap-16 lg:gap-20 xl:gap-30 mt-8 lg:mt-0 w-full lg:w-auto">

                {/* Pages */}
                <div className='z-50'>
                    <h4 className="text-xl md:text-2xl mb-4 w-20">{t.footer.pages}</h4>
                    <nav className="flex flex-col gap-2 text-sm md:text-[15px] font-light">
                      <Link to="/" className="cursor-pointer hover:text-[#FFF200] transition-colors">{t.footer.home}</Link>
                      <Link to="/about" className="cursor-pointer hover:text-[#FFF200] transition-colors">{t.footer.about}</Link>
                      <Link to="/service" className="cursor-pointer hover:text-[#FFF200] transition-colors">{t.footer.services}</Link>
                      <Link to="/appointment" className="cursor-pointer hover:text-[#FFF200] transition-colors">{t.footer.bookNow}</Link>
                      <Link to="/contact" className="cursor-pointer hover:text-[#FFF200] transition-colors">{t.footer.contact}</Link>
                    </nav>
                </div>

                {/* Companies */}
                <div>
                    <h4 className="text-xl md:text-2xl mb-4">{t.footer.companies}</h4>
                    <div className="flex flex-col gap-2 text-sm md:text-[15px] font-light z-100">
                      <a href="https://drogapharma.com/" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-[#FFF200] transition-colors">Droga Pharma PLC</a>
                      <a href="https://www.emaethiopia.com/" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-[#FFF200] transition-colors">EMA Import and Export Pvt.Ltd</a>
                      <a href="https://drogaconsulting.com/" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-[#FFF200] transition-colors">Droga Consulting</a>
                      <a href="https://www.trustethiopharma.com/" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-[#FFF200] transition-colors">Trust Pharmaceutical Manufacturing PLC</a>
                      <a href="https://drogapharmacy.com/" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-[#FFF200] transition-colors">Droga Pharmacy</a>
                      <a href="https://orbittena.com/" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-[#FFF200] transition-colors">Orbit Speciality Eye Clinic</a>
                      <a href="https://breezepharmatech.com/" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-[#FFF200] transition-colors">Breeze Pharmaceutical Technologies PLC</a>
                    </div>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-xl md:text-2xl mb-4">{t.footer.contactUs}</h4>
                    <div className="space-y-2 text-sm md:text-[15px] font-light">
                      <div className="flex items-center gap-3 text-white/90">
                          <svg className="w-7 h-7 text-[#FFF200]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-xl md:text-2xl font-light text-[#FFF200]">0974959595</span>
                      </div>
                      <div>Addis Ababa, Ethiopia</div>
                      <a href="mailto:info@drogaphysiotherapy.com" className="hover:text-[#FFF200] transition-colors">info@drogaphysiotherapy.com</a>
                    </div>

                    {/* YOUR ORIGINAL SVGs (UNCHANGED) */}
                    <div className="mt-4 flex items-center gap-3">
                    {socialIcons.map((item, i) => (
                      <a 
                        key={i}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full border border-white/80 flex items-center justify-center hover:border-[#FFF200] hover:bg-[#FFF200] hover:text-[#745893] transition"
                        >
                        {item.icon}
                      </a>
                    ))}
                    </div>
                </div>

                </div>
            </div>

            {/* Bottom Row (Desktop Only) */}
            <div className="hidden md:flex justify-between items-end mt-2">

                <div className="font-compacta uppercase leading-[0.85] text-[clamp(5rem,14vw,50rem)] pointer-events-none">
                {t.hero.title2}
                </div>

                <img src={physioLogoFooter} alt="Droga Physiotherapy" className="h-25 md:h-30" />
            </div>

            {/* Bottom line */}
            <div className="border-t border-white/30 pt-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 text-xs md:text-sm text-white/80 mt-8 md:mt-5 text-center md:text-left">
                <div>{t.footer.poweredBy} © 2026</div>

                <div className="flex items-center gap-3 md:gap-4 flex-wrap justify-center">
                <span className="cursor-pointer hover:text-white">{t.footer.rights}</span>
                <span className="w-px h-4 bg-white/40" />
                <span className="cursor-pointer hover:text-white">{t.footer.privacy}</span>
                </div>
            </div>

            </div>
        </footer>
  );
};

export default Footer;

