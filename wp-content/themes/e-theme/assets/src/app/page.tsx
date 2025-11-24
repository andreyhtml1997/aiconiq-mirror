import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redirect to German as default language
  redirect('/de')
}
