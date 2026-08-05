"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, CalendarDays, Eye, ImageIcon } from "lucide-react";
import { useGetAllBlogsQuery } from "@/redux/api/blog/blogApi";
import { Skeleton } from "@/components/ui/skeleton";
import SectionEyebrow from "@/components/shared/section-eyebrow";

export function HomeBlogSection() {
  const t = useTranslations("blog");
  const { data, isLoading } = useGetAllBlogsQuery({ limit: 3 });
  const blogs = data?.data ?? [];

  // Nothing published yet — keep the home page clean
  if (!isLoading && blogs.length === 0) return null;

  return (
    <section className="py-14 md:py-20 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-100/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-green-100/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-3">
            <SectionEyebrow>{t("homeBadge")}</SectionEyebrow>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground md:text-4xl">
              {t("homeTitle")}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              {t("homeDescription")}
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
          >
            {t("viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <Skeleton className="h-44 w-full rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((item) => (
              <Link
                key={item._id}
                href={`/blog/${item.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                {item.coverImage ? (
                  <div className="relative h-44 w-full overflow-hidden bg-muted">
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
                  <h3 className="text-base font-semibold leading-snug text-foreground line-clamp-2 transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {item.excerpt}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground/80">
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
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
