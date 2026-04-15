import React, { createContext, useContext, useState, useEffect } from 'react';
import enData from '../data/en.json';
import amhData from '../data/amh.json';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    localStorage.setItem('language', language);
    // Apply lang class to body for font and word-breaking rules
    document.body.className = language === 'amh' ? 'lang-amh' : '';
    document.documentElement.lang = language === 'en' ? 'en' : 'am';
  }, [language]);

  const t = language === 'en' ? enData : amhData;

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'amh' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
