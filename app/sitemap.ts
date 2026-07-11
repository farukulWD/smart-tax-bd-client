import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { getPublishedBlogs } from "@/lib/blog";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://smart-tax-bd-client.vercel.app";

const staticRoutes = [
  "/",
  "/about",
  "/contact",
  "/return",
  "/news",
  "/blog",
  "/privacy",
  "/terms",
];

function localizedEntry(
  href: string,
  lastModified?: Date,
): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteUrl}${getPathname({ locale: routing.defaultLocale, href })}`,
    lastModified,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          `${siteUrl}${getPathname({ locale, href })}`,
        ]),
      ),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await getPublishedBlogs();

  const blogEntries = blogs.map((blog) =>
    localizedEntry(
      `/blog/${blog.slug}`,
      blog.updatedAt ? new Date(blog.updatedAt) : undefined,
    ),
  );

  return [...staticRoutes.map((route) => localizedEntry(route)), ...blogEntries];
}
