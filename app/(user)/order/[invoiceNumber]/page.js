import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getOrderByUser } from "@/lib/data-access/order";
import { verifySession } from "@/lib/session";
import OrderDetailContent from "./orderDetailContent";

export default async function OrderDetailPage({ params }) {
  const { invoiceNumber } = await params;
  const session = await verifySession();
  const orderData = await getOrderByUser(invoiceNumber);

  if (orderData.userId !== session.userId) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-semibold">Pesanan tidak ditemukan</h2>
        <Link href="/history">
          <Button className="mt-4">Kembali ke Pesanan</Button>
        </Link>
      </section>
    );
  }

  return (
    <>
      <OrderDetailContent orderData={orderData} />;
    </>
  );
}
