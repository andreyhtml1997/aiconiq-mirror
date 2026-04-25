import { fetchMenu } from '@/lib/wp'
import SiteHeaderClient from './site-header-client'

interface SiteHeaderProps {
  lang: string
}

const SiteHeader = async ({ lang }: SiteHeaderProps) => {
  const items = await fetchMenu('primary', lang)

  return <SiteHeaderClient items={items} lang={lang} />
}

export default SiteHeader
