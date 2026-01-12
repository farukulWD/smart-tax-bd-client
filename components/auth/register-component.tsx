import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

const RegisterComponent = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-white shadow-lg p-8 w-full">
      <p className="text-slate-600 mb-6 font-medium">
        Create your account to get started
      </p>

      <RegisterForm />

      <p className="text-center text-sm text-slate-700 mb-4">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#28a745] hover:underline font-semibold"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default RegisterComponent;
