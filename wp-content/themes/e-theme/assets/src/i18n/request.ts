import { getRequestConfig } from 'next-intl/server'
import { Locale } from './config'

// Import existing translation files
import en from '../locales/en'
import de from '../locales/de'
import fr from '../locales/fr'

const messages = {
  en,
  de,
  fr,
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // Ensure that the incoming locale is valid
  if (!locale || !['en', 'de', 'fr'].includes(locale)) {
    locale = 'de'
  }

  return {
    locale,
    messages: messages[locale as Locale],
  }
})
