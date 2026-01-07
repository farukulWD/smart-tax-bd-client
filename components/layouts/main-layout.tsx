import { ReactNode } from "react";
import { Navbar } from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <main className=" flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 overflow-y-auto">{children}</div>
      <Footer />
    </main>
  );
};

export default MainLayout;
