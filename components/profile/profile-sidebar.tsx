"use client";

import { cn } from "@/lib/utils";
import { useGetMyFilesQuery } from "@/redux/api/file/fileApi";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDownIcon,
  CreditCardIcon,
  FileIcon,
  TruckIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const profileSidebarLinks = [
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
    title: "Orders",
    href: "/profile/orders",
    icon: <TruckIcon />,
  },
];

const ProfileSidebar = () => {
  const pathname = usePathname();
  const isOnMyFiles = pathname.startsWith("/profile/my-files");
  const [open, setOpen] = useState(isOnMyFiles);

  const { data: filesData } = useGetMyFilesQuery(undefined, {
    selectFromResult: (result) => ({
      data: result.data?.data,
    }),
  });

  const files: { _id: string; name: string }[] = filesData || [];

  return (
    <div className="flex flex-col gap-4 bg-primary/5 p-4 h-full shadow-xl rounded-lg">
      <div>
        {profileSidebarLinks.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors",
              pathname === link.href
                ? "bg-primary text-primary-foreground"
                : "",
            )}
          >
            {link.icon}
            {link.title}
          </Link>
        ))}

        {/* My Files collapsible */}
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger
            className={cn(
              "w-full flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors",
              isOnMyFiles ? "bg-primary text-primary-foreground" : "",
            )}
          >
            <span className="flex items-center gap-2">
              <FileIcon className="h-5 w-5" />
              My Files
            </span>
            <ChevronDownIcon
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                open ? "rotate-180" : "",
              )}
            />
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l pl-3">
              {files.length === 0 ? (
                <p className="text-xs text-muted-foreground py-1 px-2">
                  No files yet
                </p>
              ) : (
                files.map((file) => (
                  <Link
                    key={file._id}
                    href={`/profile/my-files/${file._id}`}
                    className={cn(
                      "text-sm truncate py-1.5 px-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors",
                      pathname === `/profile/my-files/${file._id}`
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                    title={file.name}
                  >
                    {file.name}
                  </Link>
                ))
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default ProfileSidebar;
