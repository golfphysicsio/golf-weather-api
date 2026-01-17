import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import enCommon from './locales/en/common.json'
import enDashboard from './locales/en/dashboard.json'
import enApiKeys from './locales/en/api-keys.json'
import enUsage from './locales/en/usage.json'
import enLogs from './locales/en/logs.json'
import enSystem from './locales/en/system.json'

// Future language imports will go here:
// import jaCommon from './locales/ja/common.json'
// import koCommon from './locales/ko/common.json'
// etc.

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n to react-i18next
  .init({
    resources: {
      en: {
        common: enCommon,
        dashboard: enDashboard,
        'api-keys': enApiKeys,
        usage: enUsage,
        logs: enLogs,
        system: enSystem,
      },
      // Future languages:
      // ja: { common: jaCommon, dashboard: jaDashboard, ... },
      // ko: { common: koCommon, dashboard: koDashboard, ... },
      // de: { common: deCommon, dashboard: deDashboard, ... },
      // es: { common: esCommon, dashboard: esDashboard, ... },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
