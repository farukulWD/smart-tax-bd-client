"use client";

import React from "react";
import { useGetAllNewsQuery } from "@/redux/api/news/newsApi";
import { useRouter } from "next/navigation";

// marquee is deprecated but still widely supported; cast avoids TS errors
const Marquee = "marquee" as unknown as React.ElementType<{
  behavior?: string;
  direction?: string;
  scrollamount?: string | number;
  className?: string;
  children?: React.ReactNode;
}>;

export function NewsTicker() {
  const { data } = useGetAllNewsQuery();
  const newsList = data?.data ?? [];
  const router = useRouter();

  if (newsList.length === 0) return null;

  return (
    <div className="flex h-9 w-full items-center overflow-hidden border-b border-slate-200 bg-white">
      {/* "New" badge */}
      <div className="flex h-full shrink-0 items-center bg-red-600 px-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-white">
          New
        </span>
      </div>

      <Marquee behavior="scroll" direction="left" scrollamount="5" className="flex-1">
        {newsList.map((item, idx) => (
          <button
            key={item._id}
            type="button"
            onClick={() => router.push(`/news/${item._id}`)}
            className="mx-6 cursor-pointer text-sm text-slate-700 hover:text-green-700 hover:underline underline-offset-2"
          >
            {item.title}
            {idx < newsList.length - 1 && (
              <span className="mx-4 text-slate-300">|</span>
            )}
          </button>
        ))}
      </Marquee>
    </div>
  );
}
