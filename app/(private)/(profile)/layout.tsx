import ProfileSidebar from "@/components/profile/profile-sidebar";
import ProfileTopBar from "@/components/profile/profile-top-bar";
import { Navbar } from "@/components/shared/navbar";
import React from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-4 lg:px-8 flex flex-col gap-4 h-[calc(100vh-85px)] overflow-hidden">
        <ProfileTopBar />
        <div className="flex gap-4 h-full overflow-hidden">
          <div className="w-64 hidden md:block">
            <ProfileSidebar />
          </div>
          <div className="flex-1 h-full overflow-y-auto pr-2 custom-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
