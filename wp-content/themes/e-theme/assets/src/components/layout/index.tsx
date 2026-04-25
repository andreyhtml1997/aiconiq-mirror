import { ReactNode } from "react";
import Footer from "./footer";
import SiteHeader from "./site-header";
import Script from 'next/script'
import { fetchSiteFooter } from "@/lib/wp";

interface LayoutProps {
  children: ReactNode;
  className?: string;
  lang?: string;
  withHeader?: boolean;
}

const Layout = async ({
  children,
  className = "",
  lang,
  withHeader = true,
}: LayoutProps): Promise<JSX.Element> => {
  const footerData = lang ? await fetchSiteFooter(lang) : null;

  return (
    <div className={`min-h-screen  ${className}`}>
      {withHeader && lang && <SiteHeader lang={lang} />}
      <main className="flex-grow overflow-clip">{children}</main>

      <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3FM57F1CE3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-3FM57F1CE3');
          `}
        </Script>
      <Footer data={footerData} />
    </div>
  );
};

export default Layout;
