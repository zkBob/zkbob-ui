import { createContext, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const LanguageContext = createContext({});

export default LanguageContext;

export const LanguageContextProvider = ({ children }) => {
  const location = useLocation();
  const { i18n } = useTranslation();

  const changeLanguage = useCallback(language => {
    localStorage.setItem('language', language);
    i18n.changeLanguage(language);
  }, [i18n]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    let language = queryParams.get('lang');
    if (!language) {
      language = window.localStorage.getItem('language');
    }
    if (language) {
      changeLanguage(language);
    }
  }, [changeLanguage, location.search]);

  return (
    <LanguageContext.Provider value={{ changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
