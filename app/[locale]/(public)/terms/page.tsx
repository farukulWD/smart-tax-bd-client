import Link from "next/link";
import { useTranslations } from "next-intl";
import { FileText } from "lucide-react";

export default function TermsPage() {
  const t = useTranslations("terms");

  const sections = [
    t.raw("sections.acceptance") as { title: string; body: string },
    t.raw("sections.services") as { title: string; body: string },
    t.raw("sections.account") as { title: string; body: string },
    t.raw("sections.payment") as { title: string; body: string },
    t.raw("sections.liability") as { title: string; body: string },
    t.raw("sections.changes") as { title: string; body: string },
  ];

  return (
    <main className="bg-gradient-to-b from-green-50 via-white to-slate-50">
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
          <p className="text-sm text-slate-400">{t("lastUpdated")}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pb-14">
        <div className="mx-auto max-w-3xl space-y-6">
          {sections.map((section, index) => (
            <article
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                  {index + 1}
                </span>
                <h2 className="text-lg font-semibold text-slate-900">
                  {section.title}
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pb-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-green-200 bg-green-50/80 p-8 lg:p-10 text-center">
          <FileText className="mx-auto mb-4 h-8 w-8 text-green-700" />
          <p className="text-slate-700 text-sm leading-relaxed mb-6">
            Questions about our terms or how we operate? Reach out to our team.
          </p>
          <Link
            href="/contact"
            className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            {t("contactUs")}
          </Link>
        </div>
      </section>
    </main>
  );
}
