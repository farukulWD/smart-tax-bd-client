import { cache } from "react";
import type { IBlog } from "@/redux/api/blog/blogApi";

export interface IBlogDetail {
  blog: IBlog;
  related: IBlog[];
}

// cache() memoizes per render pass so generateMetadata + page share one
// fetch — the server-side view counter increments once per request.
export const getBlogBySlug = cache(
  async (rawSlug: string): Promise<IBlogDetail | null> => {
    // Route params arrive percent-encoded (e.g. Bengali slugs); decode
    // before re-encoding or the backend receives a double-encoded slug.
    let slug = rawSlug;
    try {
      slug = decodeURIComponent(rawSlug);
    } catch {
      // keep raw value if it is not valid percent-encoding
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blogs/${encodeURIComponent(slug)}`,
        { cache: "no-store" },
      );
      if (!res.ok) return null;
      const json = await res.json();
      return json?.data ?? null;
    } catch {
      return null;
    }
  },
);

export async function getPublishedBlogs(limit = 1000): Promise<IBlog[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blogs?limit=${limit}`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}
