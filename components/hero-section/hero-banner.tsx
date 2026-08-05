import { useTranslations } from "next-intl";
import Image from "next/image";
import { Smartphone, QrCode } from "lucide-react";
import { Link } from "@/i18n/navigation";

const HeroBanner = () => {
  const t = useTranslations("hero");

  return (
    <section className="relative w-full bg-linear-to-b from-green-100 to-green-200 overflow-hidden">
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
      <div className="relative z-10 container mx-auto px-4 lg:px-8 py-6 lg:py-8">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Left: copy + CTAs */}
          <div className="text-center lg:text-left space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">
              {t("title")}
            </h1>
            <p className="text-base text-muted-foreground font-medium max-w-xl mx-auto lg:mx-0">
              {t("subtitle")}
            </p>
            <div className="flex flex-row flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/profile/orders/create"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                {t("getStarted")}
              </Link>
              <Link
                href="/#tax-categories"
                className="inline-flex items-center justify-center rounded-full border border-primary/50 bg-background/80 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-background"
              >
                {t("viewTaxCategories")}
              </Link>
            </div>
          </div>

          {/* Right: download QR card */}
          <div className="flex justify-center lg:justify-end">
            <div className="group relative w-full max-w-xs rounded-2xl border border-white/60 bg-card/80 p-4 shadow-xl ring-1 ring-green-900/5 backdrop-blur-sm sm:p-5">
              <div className="flex items-center gap-2 text-green-700">
                <QrCode className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  {t("downloadApp")}
                </span>
              </div>

              <p className="mt-1 text-sm font-medium text-card-foreground">
                {t("downloadAppSubtitle")}
              </p>

              {/* QR with scanner-style corner brackets */}
              <div className="relative mx-auto mt-4 w-fit">
                <span className="pointer-events-none absolute -left-2 -top-2 h-5 w-5 rounded-tl-lg border-l-4 border-t-4 border-primary" />
                <span className="pointer-events-none absolute -right-2 -top-2 h-5 w-5 rounded-tr-lg border-r-4 border-t-4 border-primary" />
                <span className="pointer-events-none absolute -bottom-2 -left-2 h-5 w-5 rounded-bl-lg border-b-4 border-l-4 border-primary" />
                <span className="pointer-events-none absolute -bottom-2 -right-2 h-5 w-5 rounded-br-lg border-b-4 border-r-4 border-primary" />
                {/* QR quiet zone must stay literal white for scannability */}
                <div className="overflow-hidden rounded-lg bg-white p-2 shadow-sm transition-transform duration-300 group-hover:scale-[1.03]">
                  <Image
                    src="/qrcode.jpeg"
                    alt={t("downloadAppSubtitle")}
                    width={200}
                    height={200}
                    className="h-32 w-32 rounded-md object-contain sm:h-36 sm:w-36"
                    priority
                  />
                </div>
              </div>

              <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
                <Smartphone className="h-4 w-4 shrink-0 text-green-700" />
                {t("scanWithCamera")}
              </p>

              <div className="mt-2 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
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
