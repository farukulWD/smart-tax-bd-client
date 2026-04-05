// Root layout — just passes children through.
// Per-locale html/body/lang is handled in app/[locale]/layout.tsx.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
