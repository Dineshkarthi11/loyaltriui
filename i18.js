// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
// import translationEN from './locales/en/translation.json';
// import translationFR from './locales/fr/translation.json';
import languagefr from "../src/components/Language/Menus/English"
import englishLanguage from './components/Language/EnglishLanguage';
import arabicLanguage from './components/Language/ArabicLanguage';

const resources = {
  en: {
    translation: englishLanguage,
  },
  fr: {
    translation: languagefr,
  },
  ar:{
    translation: arabicLanguage
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // default language
    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;