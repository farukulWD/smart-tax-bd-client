import Link from "next/link";

const HeroBanner = () => {
  return (
    <section className="relative w-full min-h-[65vh] bg-gradient-to-b from-green-100 to-green-200 overflow-hidden">
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
        <div className="min-h-[360px] md:min-h-[420px] flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-green-600">
              Professional Tax <br /> Services in Bangladesh
            </h1>
            <p className="text-lg text-slate-700 font-medium text-center max-w-xl mx-auto">
              Simplifying tax compliance for individuals and businesses with
              expert guidance and modern digital tools.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                href="/profile/orders/create"
                className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
              >
                Get Started
              </Link>
              <Link
                href="#tax-categories"
                className="inline-flex items-center justify-center rounded-full border border-green-600/50 bg-white/80 px-6 py-3 text-sm font-semibold text-green-700 transition-colors hover:bg-white"
              >
                View Tax Categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
