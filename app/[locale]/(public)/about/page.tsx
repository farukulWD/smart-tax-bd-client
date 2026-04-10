import Link from "next/link";
import { CheckCircle2, ShieldCheck, Users, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("about");

  const highlights = [
    {
      title: t("highlights.expertGuidance.title"),
      description: t("highlights.expertGuidance.description"),
      icon: Users,
    },
    {
      title: t("highlights.trustedCompliance.title"),
      description: t("highlights.trustedCompliance.description"),
      icon: ShieldCheck,
    },
    {
      title: t("highlights.fastDigitalWorkflow.title"),
      description: t("highlights.fastDigitalWorkflow.description"),
      icon: Zap,
    },
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
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pb-14 lg:pb-20">
        <div className="grid gap-5 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <item.icon className="mb-4 h-10 w-10 rounded-full bg-green-100 p-2 text-green-700" />
              <h2 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pb-16">
        <div className="rounded-3xl border border-green-200 bg-green-50/80 p-8 lg:p-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {t("whyChooseUs")}
          </h2>
          <ul className="mt-5 space-y-3 text-slate-700">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
              {t("reason1")}
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
              {t("reason2")}
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
              {t("reason3")}
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/profile/orders/create"
              className="rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              {t("startOrder")}
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-green-600 px-6 py-2.5 text-sm font-semibold text-green-700 transition-colors hover:bg-green-100"
            >
              {t("contactUs")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
