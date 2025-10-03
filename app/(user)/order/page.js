import { getOrdersByUser } from "@/lib/data-access/order";
import OrderContent from "./orderContent";
import { verifySession } from "@/lib/session";
import EmptyPage from "@/components/EmptyPage";
import { ReceiptText } from "lucide-react";

export default async function OrderPage() {
  const session = await verifySession();
  const orders = await getOrdersByUser(session.userId);

  if (!orders || orders.length === 0) {
    return (
      <EmptyPage
        message={
          "Sepertinya kamu belum melakukan pemesanan apapun. Silakan kembali ke beranda"
        }
        buttonMessage={"Kembali ke beranda"}
        href={"/"}
      >
        <div className="p-6 rounded-full shadow-md">
          <ReceiptText className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-primary">
          Pesanan tidak ditemukan
        </h2>
      </EmptyPage>
    );
  }

  return <OrderContent orders={orders} />;
}
