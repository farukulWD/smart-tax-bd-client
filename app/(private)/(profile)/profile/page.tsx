"use client";

import { useGetMeQuery } from "@/redux/api/auth/authApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { data: profileData, isLoading } = useGetMeQuery(undefined, {
    selectFromResult: ({ data, isLoading }) => ({
      data: data?.data,
      isLoading,
    }),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 ">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = profileData;

  return (
    <div className="flex flex-col gap-6 ">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.image} alt={user?.name} />
            <AvatarFallback className="text-xl">
              {user?.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{user?.name}</CardTitle>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="flex gap-2 mt-2">
              <p className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">
                {user?.role}
              </p>
              {user?.memberType && (
                <p className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full capitalize">
                  {user?.memberType}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={user?.name || ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={user?.email || ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" value={user?.mobile || "N/A"} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={user?.role || ""}
                readOnly
                className="capitalize"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberType">Member Type</Label>
              <Input
                id="memberType"
                value={user?.memberType || "N/A"}
                readOnly
                className="capitalize"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
