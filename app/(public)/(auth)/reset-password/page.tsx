import ResetPasswordComponent from "@/components/auth/reset-password-component";

export default function page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center items-center max-w-md mx-auto">
        <ResetPasswordComponent />
      </div>
    </div>
  );
}
