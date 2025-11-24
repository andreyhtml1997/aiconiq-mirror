import type { Metadata } from 'next'
import '../index.css'

export const metadata: Metadata = {
  title: 'AICONIQ - AI Solutions',
  description: 'AI-powered solutions for modern businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
