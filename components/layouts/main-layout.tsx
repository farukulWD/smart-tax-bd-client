import { ReactNode } from "react";
import { Navbar } from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import ReduxProvider from "./redux-provider";
import { Toaster } from "../ui/sonner";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <ReduxProvider>
      <main>
        <Navbar />
        <div className="flex flex-col min-h-screen">
          {children}
          <Toaster />
          <Footer />
        </div>
      </main>
    </ReduxProvider>
  );
};

export default MainLayout;
