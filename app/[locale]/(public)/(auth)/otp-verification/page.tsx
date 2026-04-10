import OTPVerificationComponent from "@/components/auth/otp-verification-component";
import { Suspense } from "react";

const OTPVerificationPage = () => {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-116px)]">
      <div className="flex justify-center items-center max-w-md mx-auto">
        <Suspense fallback={null}>
          <OTPVerificationComponent />
        </Suspense>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
