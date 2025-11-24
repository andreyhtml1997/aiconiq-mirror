import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Layout from '@/components/layout';
import ImprintHero from '@/components/sections/imprint/ImprintHero';
import ImprintContent from '@/components/sections/imprint/ImprintContent';

export default async function ImprintPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  setRequestLocale(lang);
  
  const t = await getTranslations();

  return (
    <Layout>
      <ImprintHero
        title={t('imprint.title')}
        content={<ImprintContent />}
      />
    </Layout>
  );
}