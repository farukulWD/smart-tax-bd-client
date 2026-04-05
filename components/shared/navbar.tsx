"use client";

import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/redux/api/auth/authApi";
import Cookies from "js-cookie";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeLabels: Record<string, string> = {
  en: "English",
  bn: "বাংলা",
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const token = Cookies.get("accessToken") || "";
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");
  const [logout, { isLoading }] = useLogoutMutation();

  const navLinks = [
    { nameKey: "home" as const, href: "/" as const, active: pathname === "/" },
    { nameKey: "aboutUs" as const, href: "/about" as const, active: pathname === "/about" },
    { nameKey: "news" as const, href: "/news" as const, active: pathname === "/news" },
    { nameKey: "contactUs" as const, href: "/contact" as const, active: pathname === "/contact" },
  ];

  const handleLogout = async () => {
    try {
      const res = await logout({}).unwrap();
      if (res) {
        Cookies.remove("accessToken");
        router.push("/");
      }
    } catch {
      Cookies.remove("accessToken");
      router.push("/");
    }
  };

  const switchLocale = (next: string) => {
    router.replace(pathname, { locale: next });
  };

  const nextLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center h-10 w-10">
            <div className="absolute inset-0 rotate-45 bg-green-800 rounded-sm shadow-sm transition-transform group-hover:rotate-90 duration-300" />
            <span className="relative z-10 text-xs font-black tracking-tighter text-white uppercase ml-1">
              Smart
            </span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-green-600">
            Tax
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.nameKey}
              href={link.href}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors hover:text-green-600",
                link.active
                  ? "bg-green-100 text-green-900 border-2 border-green-900 rounded-full"
                  : "text-slate-900",
              )}
            >
              {t(link.nameKey)}
            </Link>
          ))}
          {token ? (
            <>
              <Link
                href="/profile"
                className={cn(
                  "ml-2 rounded-full px-5 py-2 text-sm font-semibold text-white transition-colors",
                  pathname.startsWith("/profile")
                    ? "bg-green-800"
                    : "bg-green-600 hover:bg-green-700",
                )}
              >
                {t("profile")}
              </Link>
              <button
                disabled={isLoading}
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium transition-colors text-slate-900 hover:text-green-600"
              >
                {isLoading ? t("loggingOut") : t("logOut")}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="ml-2 rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              {t("logIn")}
            </Link>
          )}

          {/* Language switcher */}
          <button
            onClick={() => switchLocale(nextLocale)}
            className="ml-2 flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-green-500 hover:text-green-700 transition-colors"
            title={localeLabels[nextLocale]}
          >
            <Globe className="h-4 w-4" />
            {localeLabels[nextLocale]}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 lg:hidden hover:bg-slate-100 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">{t("openMenu")}</span>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t bg-white p-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.nameKey}
              href={link.href}
              className={cn(
                "block px-4 py-3 text-base font-medium transition-colors hover:bg-slate-50 hover:text-green-600 rounded-md",
                link.active
                  ? "bg-green-100 text-green-900 border-l-4 border-green-900"
                  : "text-slate-900",
              )}
              onClick={() => setIsOpen(false)}
            >
              {t(link.nameKey)}
            </Link>
          ))}
          {token ? (
            <>
              <Link
                href="/profile"
                className={cn(
                  "block px-4 py-3 text-base font-medium transition-colors hover:bg-slate-50 hover:text-green-600 rounded-md",
                  pathname.includes("/profile") &&
                    !pathname.includes("/profile/payments") &&
                    !pathname.includes("/profile/orders") &&
                    !pathname.includes("/profile/my-files")
                    ? "bg-green-100 text-green-900 border-l-4 border-green-900"
                    : "text-slate-900",
                )}
                onClick={() => setIsOpen(false)}
              >
                {t("profile")}
              </Link>
              <Link
                href="/profile/payments"
                className={cn(
                  "block px-4 py-3 text-base font-medium transition-colors hover:bg-slate-50 hover:text-green-600 rounded-md",
                  pathname.includes("/profile/payments")
                    ? "bg-green-100 text-green-900 border-l-4 border-green-900"
                    : "text-slate-900",
                )}
                onClick={() => setIsOpen(false)}
              >
                {t("payments")}
              </Link>
              <Link
                href="/profile/orders"
                className={cn(
                  "block px-4 py-3 text-base font-medium transition-colors hover:bg-slate-50 hover:text-green-600 rounded-md",
                  pathname.includes("/profile/orders")
                    ? "bg-green-100 text-green-900 border-l-4 border-green-900"
                    : "text-slate-900",
                )}
                onClick={() => setIsOpen(false)}
              >
                {t("orders")}
              </Link>
              <Link
                href="/profile/my-files"
                className={cn(
                  "block px-4 py-3 text-base font-medium transition-colors hover:bg-slate-50 hover:text-green-600 rounded-md",
                  pathname.includes("/profile/my-files")
                    ? "bg-green-100 text-green-900 border-l-4 border-green-900"
                    : "text-slate-900",
                )}
                onClick={() => setIsOpen(false)}
              >
                {t("myFiles")}
              </Link>
              <button
                disabled={isLoading}
                onClick={handleLogout}
                className="w-full rounded-md border border-slate-200 px-4 py-3 text-left text-base font-medium text-slate-900 transition-colors hover:bg-slate-50"
              >
                {isLoading ? t("loggingOut") : t("logOut")}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block rounded-md bg-green-600 px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-green-700"
              onClick={() => setIsOpen(false)}
            >
              {t("logIn")}
            </Link>
          )}

          {/* Mobile language switcher */}
          <button
            onClick={() => {
              switchLocale(nextLocale);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 rounded-md border border-slate-200 px-4 py-3 text-left text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Globe className="h-5 w-5" />
            {localeLabels[nextLocale]}
          </button>
        </div>
      )}
    </nav>
  );
}
