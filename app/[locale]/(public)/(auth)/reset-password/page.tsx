import ResetPasswordComponent from "@/components/auth/reset-password-component";
import { Suspense } from "react";

export default function page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center items-center max-w-md mx-auto">
        <Suspense fallback={null}>
          <ResetPasswordComponent />
        </Suspense>
      </div>
    </div>
  );
}
