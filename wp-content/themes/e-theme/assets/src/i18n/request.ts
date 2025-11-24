import { getRequestConfig } from 'next-intl/server'
import { Locale } from './config'

// Import existing translation files
import en from '../locales/en'
import de from '../locales/de'

const messages = {
  en,
  de,
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // Ensure that the incoming locale is valid
  if (!locale || !['en', 'de'].includes(locale)) {
    locale = 'de'
  }

  return {
    locale,
    messages: messages[locale as Locale],
  }
})
