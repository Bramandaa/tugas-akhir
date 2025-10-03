import { verifySession } from "@/lib/session";
import { getAddress } from "@/lib/data-access/user";
import { redirect } from "next/navigation";
import CheckoutContent from "./checkoutContent";
import { getOrderByUser } from "@/lib/data-access/order";

export default async function CheckoutPage({ params }) {
  const { invoiceNumber } = await params;
  const session = await verifySession();

  const order = await getOrderByUser(invoiceNumber);
  const address = await getAddress(session?.userId);

  if (order.userId !== session.userId) {
    redirect("/403");
  }
  if (order.status !== "PENDING") {
    redirect("/order/" + order.invoiceNumber);
  }

  return <CheckoutContent order={order} address={address} />;
}
