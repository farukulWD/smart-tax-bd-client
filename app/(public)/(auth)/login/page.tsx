import LoginComponent from "@/components/auth/login-component";

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center items-center max-w-lg mx-auto">
        <LoginComponent />
      </div>
    </div>
  );
};

export default LoginPage;
