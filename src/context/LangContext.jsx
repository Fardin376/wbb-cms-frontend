import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const defaultLanguage = 'en';

  const [language, setLanguage] = useState(() => {
    return sessionStorage.getItem('language') || defaultLanguage;
  });

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'en' ? 'bn' : 'en'));
  };

  useEffect(() => {
    sessionStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
