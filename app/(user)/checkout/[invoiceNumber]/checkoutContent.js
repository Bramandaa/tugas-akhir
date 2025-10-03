"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

import { useState } from "react";
import { payment, updateStatusOrder } from "@/actions/checkout";
import AddressForm from "./addressForm";
import Image from "next/image";

export default function CheckoutContent({ order, address }) {
  const [loading, setLoading] = useState(false);
  const handlePay = async () => {
    setLoading(true);

    const data = await payment(order.orderId);

    if (data.token) {
      // Pastikan Snap JS sudah ada
      const snapScript = document.createElement("script");
      snapScript.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      snapScript.setAttribute(
        "data-client-key",
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
      );
      document.body.appendChild(snapScript);

      snapScript.onload = () => {
        window.snap.pay(data.token, {
          onSuccess: async function (result) {
            console.log("Success:", result);
            await updateStatusOrder(result.order_id);
            // window.location.href = `/order/${order.orderId}`;
          },
          onPending: function (result) {
            console.log("Pending:", result);
          },
          onError: function (result) {
            console.log("Error:", result);
          },
          onClose: function () {
            alert("Popup ditutup sebelum bayar");
          },
        });
      };
    }

    setLoading(false);
  };

  return (
    <>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-4">
        <h1 className="font-semibold text-xl capitalize">Checkout</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Kiri */}
          <div className="flex-1 space-y-4">
            <AddressForm address={address} order={order} />
            <Card className="rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle>Produk Dipesan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order?.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4 border-b pb-4 last:border-none last:pb-0"
                  >
                    <div className="relative w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        priority
                        sizes="100vh"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        {item.quantity} item
                      </div>
                    </div>
                    <div className="font-semibold text-primary">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          {/* Kanan */}
          <div className="w-full md:w-[35%] space-y-4">
            <Card className="rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle>Ringkasan Belanja</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Total Harga ({order.items.length} barang)</span>
                  <span>Rp {order.subtotal.toLocaleString("id-ID")}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Total Ongkos Kirim</span>
                  <span>Rp 20.000</span>
                </div>

                <Collapsible>
                  <CollapsibleTrigger className="w-full flex justify-between text-sm text-left text-primary">
                    <span>Total Lainnya</span>
                    <ChevronDown size={16} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Biaya Layanan</span>
                      <span>Rp 1.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biaya Jasa</span>
                      <span>Rp 1.000</span>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total Bayar</span>
                  <span className="text-primary">
                    Rp {order.total.toLocaleString("id-ID")}
                  </span>
                </div>
                <input type="hidden" name="orderId" value={order.orderId} />
                <Button
                  disabled={loading}
                  onClick={handlePay}
                  className="w-full bg-primary text-white rounded-lg cursor-pointer"
                >
                  Bayar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
