import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// Available languages - add more as they become available
const LANGUAGES = [
  { code: 'en', name: 'English', flag: 'EN' },
  // Future languages (uncomment when translations are ready):
  // { code: 'ja', name: '日本語', flag: 'JP' },
  // { code: 'ko', name: '한국어', flag: 'KR' },
  // { code: 'de', name: 'Deutsch', flag: 'DE' },
  // { code: 'es', name: 'Español', flag: 'ES' },
]

export default function LanguageSelector() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentLang = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0]

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode)
    setIsOpen(false)
  }

  // If only one language is available, show a simple indicator
  if (LANGUAGES.length === 1) {
    return (
      <div className="flex items-center gap-1 text-xs text-gray-500 px-2 py-1 rounded bg-gray-100">
        <span>{currentLang.flag}</span>
        <span>{currentLang.name}</span>
      </div>
    )
  }

  // Multiple languages: show dropdown
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Select language"
      >
        <span>{currentLang.flag}</span>
        <span>{currentLang.name}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-20 border">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                  lang.code === i18n.language ? 'bg-blue-50 text-blue-600 font-medium' : ''
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
