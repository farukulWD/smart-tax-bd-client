import LoginComponent from "@/components/auth/login-component";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center items-center max-w-lg mx-auto">
        <Suspense fallback={null}>
          <LoginComponent />
        </Suspense>
      </div>
    </div>
  );
};

export default LoginPage;
