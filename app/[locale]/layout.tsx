import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import "../globals.css";
import ReduxProvider from "@/components/layouts/redux-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getPathname } from "@/i18n/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://smarttaxbd.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";

  return {
    title: isBn ? "স্মার্ট ট্যাক্স" : "Smart Tax",
    description: isBn
      ? "বাংলাদেশে পেশাদার কর সেবা"
      : "Professional tax services in Bangladesh",
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          `${siteUrl}${getPathname({ locale: l, href: "/" })}`,
        ]),
      ),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansBengali.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ReduxProvider>
            <SocketProvider>{children}</SocketProvider>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
