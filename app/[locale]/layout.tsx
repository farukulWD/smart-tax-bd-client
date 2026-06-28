import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import Script from "next/script";
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://smart-tax-bd-client.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";

  return {
    metadataBase: new URL(siteUrl),
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
    openGraph: {
      type: "website",
      siteName: "Smart Tax",
      url: `${siteUrl}/${locale}`,
      locale: isBn ? "bn_BD" : "en_US",
      title: isBn ? "স্মার্ট ট্যাক্স" : "Smart Tax",
      description: isBn
        ? "বাংলাদেশে পেশাদার কর সেবা"
        : "Professional tax services in Bangladesh",
      images: [
        {
          url: "/smart-tax-logo.png",
          width: 500,
          height: 500,
          alt: "Smart Tax",
        },
      ],
    },
    twitter: {
      card: "summary",
      title: isBn ? "স্মার্ট ট্যাক্স" : "Smart Tax",
      description: isBn
        ? "বাংলাদেশে পেশাদার কর সেবা"
        : "Professional tax services in Bangladesh",
      images: ["/smart-tax-logo.png"],
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
        <Script
          id="ms-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","x9schu08e5");`,
          }}
        />
      </body>
    </html>
  );
}
