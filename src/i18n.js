import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: ['en', 'pt'],
    nonExplicitSupportedLngs: true,
    resources: {
      en: {
        translation: require('translations/en.json'),
      },
      pt: {
        translation: require('translations/pt.json'),
      },
    },
  });

export default i18n;
