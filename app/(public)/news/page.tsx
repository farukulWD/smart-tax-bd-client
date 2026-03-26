"use client";

import { useGetAllNewsQuery } from "@/redux/api/news/newsApi";
import { CalendarDays, ImageIcon, Newspaper, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function NewsPage() {
  const { data, isLoading } = useGetAllNewsQuery();
  const newsList = data?.data ?? [];

  return (
    <main className="bg-gradient-to-b from-green-50 via-white to-slate-50 min-h-screen">
      <section className="container mx-auto px-4 lg:px-8 py-14 lg:py-20">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <p className="inline-flex rounded-full border border-green-200 bg-green-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-green-700">
            Latest Updates
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            News &amp; Announcements
          </h1>
          <p className="text-base leading-relaxed text-slate-600 md:text-lg">
            Stay up to date with the latest tax news, regulatory changes, and
            important announcements from Smart Tax BD.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pb-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-slate-500">Loading news...</p>
          </div>
        ) : newsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-slate-500">
            <Newspaper className="h-12 w-12 text-slate-300" />
            <p className="text-base font-medium">No news articles yet.</p>
            <p className="text-sm">Check back later for updates.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newsList.map((item) => (
              <Link
                key={item._id}
                href={`/news/${item._id}`}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md"
              >
                {item.attachment ? (
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.attachment}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-green-50">
                    <ImageIcon className="h-10 w-10 text-green-200" />
                  </div>
                )}

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h2 className="text-base font-semibold leading-snug text-slate-900 line-clamp-2 group-hover:text-green-700 transition-colors">
                    {item.title}
                  </h2>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "—"}
                    </div>
                    <ArrowRight className="h-4 w-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="rounded-full border border-green-600 px-6 py-2.5 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
