import RegisterVerifyComponent from "@/components/auth/register-verify-component";
import { Suspense } from "react";

const RegisterVerifyPage = () => {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-116px)]">
      <div className="flex justify-center items-center max-w-md mx-auto">
        <Suspense fallback={null}>
          <RegisterVerifyComponent />
        </Suspense>
      </div>
    </div>
  );
};

export default RegisterVerifyPage;
