import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BlogList } from "@/components/blog/blog-list";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return (
    <main className="bg-gradient-to-b from-green-50 via-white to-slate-50 min-h-screen">
      <section className="container mx-auto px-4 lg:px-8 py-14 lg:py-20">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <p className="inline-flex rounded-full border border-green-200 bg-green-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-green-700">
            {t("badge")}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            {t("title")}
          </h1>
          <p className="text-base leading-relaxed text-slate-600 md:text-lg">
            {t("description")}
          </p>
        </div>
      </section>

      <BlogList />
    </main>
  );
}
