import { ReactNode } from "react";
import Footer from "./footer";
import Script from 'next/script'

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className = "" }: LayoutProps): JSX.Element => {
  return (
    <div className={`min-h-screen  ${className}`}>
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
      <Footer />
    </div>
  );
};

export default Layout;
