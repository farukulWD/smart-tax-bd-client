"use client";

import { useGetSingleNewsQuery } from "@/redux/api/news/newsApi";
import { CalendarDays, ArrowLeft, ImageIcon } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function SingleNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useGetSingleNewsQuery(id);
  const news = data?.data;

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 via-white to-slate-50">
        <p className="text-slate-500">Loading...</p>
      </main>
    );
  }

  if (!news) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-green-50 via-white to-slate-50">
        <p className="text-lg font-semibold text-slate-700">
          News article not found.
        </p>
        <Link
          href="/news"
          className="rounded-full border border-green-600 px-6 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50"
        >
          Back to News
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-green-50 via-white to-slate-50 min-h-screen">
      <div className="container mx-auto max-w-3xl px-4 lg:px-8 py-12 lg:py-16">
        {/* Back link */}
        <Link
          href="/news"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-green-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to News
        </Link>

        {/* Attachment */}
        {news.attachment ? (
          <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <img
              src={news.attachment}
              alt={news.title}
              className="h-72 w-full object-cover lg:h-96"
            />
          </div>
        ) : (
          <div className="mb-8 flex h-56 w-full items-center justify-center rounded-2xl border border-slate-100 bg-green-50 lg:h-72">
            <ImageIcon className="h-14 w-14 text-green-200" />
          </div>
        )}

        {/* Meta */}
        <div className="mb-4 flex items-center gap-2 text-xs text-slate-400">
          <CalendarDays className="h-3.5 w-3.5" />
          {news.createdAt
            ? new Date(news.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "—"}
        </div>

        {/* Title */}
        <h1 className="mb-6 text-2xl font-extrabold leading-snug tracking-tight text-slate-900 lg:text-3xl">
          {news.title}
        </h1>

        {/* Divider */}
        <hr className="mb-6 border-slate-200" />

        {/* Description */}
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
          {news.description}
        </div>
      </div>
    </main>
  );
}
