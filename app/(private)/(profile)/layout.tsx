import ProfileSidebar from "@/components/profile/profile-sidebar";
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
      <div className="container mx-auto px-4 py-4 lg:px-8 flex flex-col gap-4 h-[calc(100vh-85px)]">
        <div className="h-16 bg-white rounded-2xl shadow-lg flex items-center px-4 ">
          <h1 className="text-2xl font-semibold">
            Welcome to your profile, Md Faruk
          </h1>
        </div>
        <div className="flex  gap-4 h-full">
          <div className="w-64 ">
            <ProfileSidebar />
          </div>
          <div className="flex-1 h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
