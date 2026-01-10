"use client";

import { cn } from "@/lib/utils";
import { CreditCardIcon, FileIcon, TruckIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const profileSidebarLinks = [
  {
    title: "Profile",
    href: "/profile",
    icon: <UserIcon />,
  },
  {
    title: "Payments",
    href: "/profile/payments",
    icon: <CreditCardIcon />,
  },
  {
    title: "Order Status",
    href: "/profile/order-status",
    icon: <TruckIcon />,
  },
  {
    title: "My Files",
    href: "/profile/my-files",
    icon: <FileIcon />,
  },
];

const ProfileSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4 bg-white p-4 h-full shadow-xl rounded-lg">
      <div>
        {profileSidebarLinks.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors",
              pathname === link.href && "bg-primary text-primary-foreground"
            )}
          >
            {link.icon}
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfileSidebar;
