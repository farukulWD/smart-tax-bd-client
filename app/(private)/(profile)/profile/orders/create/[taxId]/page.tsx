import StepTwo from "../../_components/step-two";

const StepPage = async ({ params }: { params: Promise<{ taxId: string }> }) => {
  const { taxId } = await params;
  return <StepTwo taxId={taxId} />;
};

export default StepPage;
