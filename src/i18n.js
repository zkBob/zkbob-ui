import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const supportedLanguages = ['en', 'pt', 'ru', 'zh'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: supportedLanguages,
    nonExplicitSupportedLngs: true,
    resources: supportedLanguages.reduce((acc, lang) => {
      acc[lang] = {
        translation: require(`locales/${lang}.json`),
      };
      return acc;
    }, {}),
  });

export default i18n;
