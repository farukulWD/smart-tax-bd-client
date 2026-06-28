import { useTranslations } from "next-intl";
import Image from "next/image";
import { Smartphone, QrCode } from "lucide-react";
import { Link } from "@/i18n/navigation";

const HeroBanner = () => {
  const t = useTranslations("hero");

  return (
    <section className="relative w-full min-h-[65vh] bg-linear-to-b from-green-100 to-green-200 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern
              id="techPattern"
              x="0"
              y="0"
              width="200"
              height="200"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="200"
                y2="200"
                stroke="currentColor"
                strokeWidth="1"
              />
              <line
                x1="200"
                y1="0"
                x2="0"
                y2="200"
                stroke="currentColor"
                strokeWidth="1"
              />
              <circle
                cx="100"
                cy="100"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#techPattern)" />
        </svg>
      </div>
      <div className="relative z-10 container mx-auto px-4 lg:px-8 py-10 lg:py-14">
        <div className="min-h-90 md:min-h-105 grid items-center gap-10 lg:grid-cols-2">
          {/* Left: copy + CTAs */}
          <div className="text-center lg:text-left space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900">
              {t("title")}
            </h1>
            <p className="text-lg text-slate-700 font-medium max-w-xl mx-auto lg:mx-0">
              {t("subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-3">
              <Link
                href="/profile/orders/create"
                className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
              >
                {t("getStarted")}
              </Link>
              <Link
                href="/#tax-categories"
                className="inline-flex items-center justify-center rounded-full border border-red-600/50 bg-white/80 px-6 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-white"
              >
                {t("viewTaxCategories")}
              </Link>
            </div>
          </div>

          {/* Right: download QR card */}
          <div className="flex justify-center lg:justify-end">
            <div className="group relative w-full max-w-sm rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl ring-1 ring-green-900/5 backdrop-blur-sm sm:p-8">
              <div className="flex items-center gap-2 text-green-700">
                <QrCode className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  {t("downloadApp")}
                </span>
              </div>

              <p className="mt-2 text-base font-medium text-slate-800">
                {t("downloadAppSubtitle")}
              </p>

              {/* QR with scanner-style corner brackets */}
              <div className="relative mx-auto mt-6 w-fit">
                <span className="pointer-events-none absolute -left-2 -top-2 h-6 w-6 rounded-tl-lg border-l-4 border-t-4 border-red-500" />
                <span className="pointer-events-none absolute -right-2 -top-2 h-6 w-6 rounded-tr-lg border-r-4 border-t-4 border-red-500" />
                <span className="pointer-events-none absolute -bottom-2 -left-2 h-6 w-6 rounded-bl-lg border-b-4 border-l-4 border-red-500" />
                <span className="pointer-events-none absolute -bottom-2 -right-2 h-6 w-6 rounded-br-lg border-b-4 border-r-4 border-red-500" />
                <div className="overflow-hidden rounded-xl bg-white p-3 shadow-sm transition-transform duration-300 group-hover:scale-[1.03]">
                  <Image
                    src="/qrcode.jpeg"
                    alt={t("downloadAppSubtitle")}
                    width={200}
                    height={200}
                    className="h-44 w-44 rounded-md object-contain sm:h-48 sm:w-48"
                    priority
                  />
                </div>
              </div>

              <p className="mt-5 flex items-center justify-center gap-2 text-center text-sm text-slate-600">
                <Smartphone className="h-4 w-4 shrink-0 text-green-700" />
                {t("scanWithCamera")}
              </p>

              <div className="mt-4 border-t border-slate-200 pt-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                {t("availableOn")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
