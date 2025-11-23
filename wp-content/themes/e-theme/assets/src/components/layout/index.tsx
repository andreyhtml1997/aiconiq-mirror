import { ReactNode } from "react";
import Footer from "./footer";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className = "" }: LayoutProps): JSX.Element => {
  return (
    <div className={`min-h-screen  ${className}`}>
      <main className="flex-grow overflow-clip">{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;
