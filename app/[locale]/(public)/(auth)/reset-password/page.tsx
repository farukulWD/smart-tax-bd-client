import ResetPasswordComponent from "@/components/auth/reset-password-component";
import { Suspense } from "react";

export default function page() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-116px)]">
      <div className="flex justify-center items-center max-w-md mx-auto">
        <Suspense fallback={null}>
          <ResetPasswordComponent />
        </Suspense>
      </div>
    </div>
  );
}
