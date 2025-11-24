'use client'

import { usePathname } from 'next/navigation'

const LangSwitcher = () => {
  const pathname = usePathname()

  // Get current language from WP_APP if available (WordPress integration)
  // Fall back to extracting from pathname if not in WordPress context
  const currentLang =
    typeof window !== 'undefined' && (window as any).WP_APP?.lang
      ? (window as any).WP_APP.lang
      : pathname.split('/')[1] || 'de'

  const pathWithoutLang = pathname.replace(/^\/(en|de)/, '') || '/'

  const makeUrl = (lang: string) => `/${lang}${pathWithoutLang}`

  const isEn = currentLang === 'en'
  const isDe = currentLang === 'de'

  return (
    <div className="
            flex items-center justify-center
            px-2 py-1.5 md:px-4 md:py-1.5
            transition-all duration-200

           text-white">
      {isEn ? (
        <span className="font-semibold opacity-100">EN</span>
      ) : (
        <a
          href={makeUrl('en')}
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          EN
        </a>
      )}

      <span className="opacity-50 mx-0.5"> | </span>

      {isDe ? (
        <span className="font-semibold opacity-100">DE</span>
      ) : (
        <a
          href={makeUrl('de')}
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          DE
        </a>
      )}
    </div>
  )
}

export default LangSwitcher
