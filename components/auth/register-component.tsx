import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { useTranslations } from "next-intl";

const RegisterComponent = () => {
  const t = useTranslations("auth.register");
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-white shadow-lg p-8 w-full">
      <p className="text-slate-600 mb-6 font-medium">{t("tagline")}</p>

      <RegisterForm />

      <p className="text-center text-sm text-slate-700 mb-4">
        {t("alreadyHaveAccount")}{" "}
        <Link
          href="/login"
          className="text-green-600 hover:underline font-semibold"
        >
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
};

export default RegisterComponent;
