import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar },
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Handle RTL/LTR direction changes
i18n.on('languageChanged', (lng) => {
  const htmlElement = document.documentElement;
  if (lng === 'ar') {
    htmlElement.setAttribute('dir', 'ltr');
    htmlElement.setAttribute('lang', 'ar');
    document.body.style.direction = 'ltr';
  } else {
    htmlElement.setAttribute('dir', 'ltr');
    htmlElement.setAttribute('lang', lng);
    document.body.style.direction = 'ltr';
  }
  // Store language preference
  localStorage.setItem('i18nextLng', lng);
});

// Set initial direction on load
const initialLng = i18n.language || 'en';
if (initialLng === 'ar') {
  document.documentElement.setAttribute('dir', 'ltr');
  document.documentElement.setAttribute('lang', 'ar');
  document.body.style.direction = 'ltr';
} else {
  document.documentElement.setAttribute('dir', 'ltr');
  document.documentElement.setAttribute('lang', initialLng);
  document.body.style.direction = 'ltr';
}

export default i18n;
