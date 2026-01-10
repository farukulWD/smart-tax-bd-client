import { ReactNode } from "react";
import { Navbar } from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <main>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        {children}
        <Footer />
      </div>
    </main>
  );
};

export default MainLayout;
