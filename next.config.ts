import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.smarttaxbd";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  // /download is what the hero QR code (public/qrcode.svg) encodes. Config
  // redirects run before proxy.ts, so next-intl never adds a locale prefix.
  // Non-permanent so browsers don't cache it and the target can change later.
  async redirects() {
    return [
      { source: "/download", destination: PLAY_STORE_URL, permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);
