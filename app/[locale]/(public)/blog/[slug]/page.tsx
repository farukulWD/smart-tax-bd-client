import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Eye,
  ImageIcon,
  UserRound,
} from "lucide-react";
import { Link, getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getBlogBySlug } from "@/lib/blog";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://smart-tax-bd-client.vercel.app";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const detail = await getBlogBySlug(slug);

  if (!detail) {
    return { title: "Blog" };
  }

  const { blog } = detail;
  const href = `/blog/${slug}`;

  return {
    title: blog.title,
    description: blog.excerpt,
    alternates: {
      canonical: `${siteUrl}${getPathname({ locale, href })}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          `${siteUrl}${getPathname({ locale: l, href })}`,
        ]),
      ),
    },
    openGraph: {
      type: "article",
      title: blog.title,
      description: blog.excerpt,
      publishedTime: blog.publishedAt,
      authors: [blog.authorName],
      images: blog.coverImage ? [{ url: blog.coverImage }] : undefined,
    },
    twitter: {
      card: blog.coverImage ? "summary_large_image" : "summary",
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "blogArticle" });
  const detail = await getBlogBySlug(slug);

  if (!detail) {
    notFound();
  }

  const { blog, related } = detail;
  const publishedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="bg-gradient-to-b from-green-50 via-white to-slate-50 min-h-screen">
      <div className="container mx-auto max-w-3xl px-4 lg:px-8 py-12 lg:py-16">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToBlog")}
        </Link>

        {/* Cover image */}
        {blog.coverImage ? (
          <div className="relative mb-8 h-72 w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm lg:h-96">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="mb-8 flex h-56 w-full items-center justify-center rounded-2xl border border-slate-100 bg-green-50 lg:h-72">
            <ImageIcon className="h-14 w-14 text-green-200" />
          </div>
        )}

        {/* Meta */}
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
          <span className="inline-flex rounded-full bg-green-100 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-green-700">
            {blog.category}
          </span>
          {publishedDate && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {publishedDate}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <UserRound className="h-3.5 w-3.5" />
            {t("by")} {blog.authorName}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            {blog.views} {t("views")}
          </span>
        </div>

        {/* Title */}
        <h1 className="mb-6 text-2xl font-extrabold leading-snug tracking-tight text-slate-900 lg:text-3xl">
          {blog.title}
        </h1>

        <hr className="mb-6 border-slate-200" />

        {/* Content — sanitized server-side at write time */}
        <div
          className="prose prose-slate max-w-none leading-relaxed prose-a:text-red-700 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: blog.content ?? "" }}
        />

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">
              {t("relatedPosts")}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item._id}
                  href={`/blog/${item.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {item.coverImage ? (
                    <div className="relative h-28 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-28 w-full items-center justify-center bg-green-50">
                      <ImageIcon className="h-8 w-8 text-green-200" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h3 className="text-sm font-semibold leading-snug text-slate-900 line-clamp-2 transition-colors group-hover:text-red-700">
                      {item.title}
                    </h3>
                    <span className="mt-auto flex items-center gap-1 text-xs font-medium text-red-600">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
