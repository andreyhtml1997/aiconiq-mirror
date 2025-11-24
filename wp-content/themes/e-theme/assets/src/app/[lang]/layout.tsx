import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n/config'
import { VoiceAgentModal } from '@/components/voice-agent-modal/VoiceAgentModal'

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  // Ensure that the incoming locale is valid
  if (!locales.includes(lang as any)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(lang)

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={lang}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          <VoiceAgentModal />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
