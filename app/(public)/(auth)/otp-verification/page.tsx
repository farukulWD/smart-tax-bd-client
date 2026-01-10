import OTPVerificationComponent from "@/components/auth/otp-verification-component";

const OTPVerificationPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center items-center max-w-md mx-auto">
        <OTPVerificationComponent />
      </div>
    </div>
  );
};

export default OTPVerificationPage;
