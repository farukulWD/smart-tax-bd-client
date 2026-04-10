import RegisterComponent from "@/components/auth/register-component";

const RegisterPage = () => {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-116px)]">
      <div className="flex justify-center items-center max-w-md mx-auto">
        <RegisterComponent />
      </div>
    </div>
  );
};

export default RegisterPage;
