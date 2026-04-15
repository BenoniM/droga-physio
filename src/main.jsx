import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}
window.scrollTo(0, 0)

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

import Home from './Pages/Home.jsx'
import About from './Pages/About.jsx'
import Service from './Pages/Service.jsx'
import Faq from './Pages/Faq.jsx'
import Gallery from './Pages/Gallery.jsx'
import News from './Pages/News.jsx'
import Blog from './Pages/Blog.jsx'
import Contact from './Pages/Contact.jsx'
import Appointment from './Pages/Appointment.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import SmoothScroll from './components/SmoothScroll.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <SmoothScroll>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/service" element={<Service />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/news" element={<News />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/appointment" element={<Appointment />} />
          </Routes>
        </SmoothScroll>
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>,
)