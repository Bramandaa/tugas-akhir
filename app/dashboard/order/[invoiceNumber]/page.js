import { getOrderByUser } from "@/lib/data-access/order";
import DetailOrderDashboard from "./detailOrderDashboard";

export default async function OrderDetailPageDashboard({ params }) {
  const { invoiceNumber } = await params;
  const order = await getOrderByUser(invoiceNumber);

  return (
    <>
      <DetailOrderDashboard order={order} />
    </>
  );
}
