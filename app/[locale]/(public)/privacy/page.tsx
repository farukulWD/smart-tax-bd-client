import Link from "next/link";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  const t = useTranslations("privacy");

  const sections = [
    t.raw("sections.infoWeCollect") as { title: string; body: string },
    t.raw("sections.howWeUse") as { title: string; body: string },
    t.raw("sections.dataSecurity") as { title: string; body: string },
    t.raw("sections.yourRights") as { title: string; body: string },
    t.raw("sections.contact") as { title: string; body: string },
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
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-green-700" />
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
          <p className="text-slate-700 text-sm leading-relaxed mb-6">
            Have questions about how we handle your data? We&apos;re happy to help.
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
