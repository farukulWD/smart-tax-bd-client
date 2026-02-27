"use client";

import { useGetMeQuery } from "@/redux/api/auth/authApi";

const ProfileTopBar = () => {
  const { data: profileData } = useGetMeQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data: data?.data,
    }),
  });
  return (
    <div className="h-16 bg-white rounded-2xl shadow-lg flex items-center px-4 py-2 ">
      <h1 className="text-2xl font-semibold">
        Welcome to your profile, {profileData?.name}
      </h1>
    </div>
  );
};

export default ProfileTopBar;
