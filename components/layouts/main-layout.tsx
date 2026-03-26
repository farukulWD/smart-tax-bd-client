import { ReactNode } from "react";
import { Navbar } from "@/components/shared/navbar";
import { NewsTicker } from "@/components/shared/news-ticker";
import Footer from "@/components/shared/footer";
import { Toaster } from "../ui/sonner";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <main>
      <Navbar />
      <NewsTicker />
      <div className="flex flex-col min-h-screen">
        {children}
        <Toaster />
        <Footer />
      </div>
    </main>
  );
};

export default MainLayout;
