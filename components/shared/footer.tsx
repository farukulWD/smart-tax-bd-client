import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const Footer = () => {
  const t = useTranslations("footer");

  const footerLinks = {
    product: [
      { nameKey: "features", href: "#" },
      { nameKey: "pricing", href: "#" },
      { nameKey: "security", href: "#" },
      { nameKey: "roadmap", href: "#" },
    ],
    company: [
      { nameKey: "aboutUs", href: "/about" },
      { nameKey: "blog", href: "/blog" },
      { nameKey: "careers", href: "#" },
      { nameKey: "contact", href: "/contact" },
    ],
    legal: [
      { nameKey: "privacy", href: "/privacy" },
      { nameKey: "terms", href: "/terms" },
      { nameKey: "cookies", href: "#" },
      { nameKey: "license", href: "#" },
    ],
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <div className="rounded-xl p-1">
                <Image
                  src="/smart-tax-logo.png"
                  alt="Smart Tax BD"
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              {t("tagline")}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("product")}</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.nameKey}>
                  <Link
                    href={link.href as "/"}
                    className="text-sm hover:text-red-600 transition-colors"
                  >
                    {t(`links.${link.nameKey}` as Parameters<typeof t>[0])}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("company")}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.nameKey}>
                  <Link
                    href={link.href as "/"}
                    className="text-sm hover:text-red-600 transition-colors"
                  >
                    {t(`links.${link.nameKey}` as Parameters<typeof t>[0])}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("legal")}</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.nameKey}>
                  <Link
                    href={link.href as "/"}
                    className="text-sm hover:text-red-600 transition-colors"
                  >
                    {t(`links.${link.nameKey}` as Parameters<typeof t>[0])}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8">
          <p className="text-center text-sm text-slate-500">
            © {new Date().getFullYear()} Smart Tax BD. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
