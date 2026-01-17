const HeroBanner = () => {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-[#c8e6c9] to-[#b3ddb6] overflow-hidden">
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
      <div className="relative  z-10 container mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <div className="min-h-[600px] flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-[#28a745]">
              Professional Tax <br /> Services in Bangladesh
            </h1>
            <p className="text-lg text-slate-700 font-medium text-center max-w-xl mx-auto">
              Simplifying tax compliance for individuals and businesses with
              expert guidance and modern digital tools.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
