"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  ImageIcon,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useGetAllBlogsQuery,
  useGetBlogCategoriesQuery,
} from "@/redux/api/blog/blogApi";

const PAGE_LIMIT = 9;

export function BlogList() {
  const t = useTranslations("blog");
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useGetAllBlogsQuery({
    page,
    limit: PAGE_LIMIT,
    ...(search ? { search } : {}),
    ...(category ? { category } : {}),
  });
  const { data: categoriesData } = useGetBlogCategoriesQuery();

  const blogs = data?.data ?? [];
  const meta = data?.meta;
  const totalPage = meta?.totalPage ?? 1;
  const categories = categoriesData?.data ?? [];

  return (
    <section className="container mx-auto px-4 lg:px-8 pb-16">
      {/* Search + category filter */}
      <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCategory("");
                setPage(1);
              }}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                category === ""
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-green-300 hover:text-green-700",
              )}
            >
              {t("allCategories")}
            </button>
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCategory(item);
                  setPage(1);
                }}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                  category === item
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-green-300 hover:text-green-700",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      {isLoading || isFetching ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-slate-500">{t("loading")}</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-slate-500">
          <BookOpen className="h-12 w-12 text-slate-300" />
          <p className="text-base font-medium">{t("noArticles")}</p>
          <p className="text-sm">{t("checkBack")}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((item) => (
            <Link
              key={item._id}
              href={`/blog/${item.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {item.coverImage ? (
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex h-44 w-full items-center justify-center bg-green-50">
                  <ImageIcon className="h-10 w-10 text-green-200" />
                </div>
              )}

              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className="inline-flex w-fit rounded-full bg-green-100 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-green-700">
                  {item.category}
                </span>
                <h2 className="text-base font-semibold leading-snug text-slate-900 line-clamp-2 transition-colors group-hover:text-red-700">
                  {item.title}
                </h2>
                {item.excerpt && (
                  <p className="text-sm leading-relaxed text-slate-500 line-clamp-2">
                    {item.excerpt}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {item.publishedAt
                        ? new Date(item.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )
                        : "—"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {item.views}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-red-600 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPage > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-green-300 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("previous")}
          </button>
          <span className="text-sm text-slate-500">
            {t("pageOf", { page: meta?.page ?? page, totalPage })}
          </span>
          <button
            type="button"
            disabled={page >= totalPage}
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-green-300 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("next")}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}
