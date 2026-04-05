import OrderPaymentComponent from "../../../_components/order-payment-component";

const PaymentPage = async ({
  params,
}: {
  params: Promise<{ taxId: string }>;
}) => {
  const { taxId } = await params;
  return <OrderPaymentComponent taxId={taxId} />;
};

export default PaymentPage;
