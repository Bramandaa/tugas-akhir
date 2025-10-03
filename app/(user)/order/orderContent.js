"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrderContent({ orders }) {
  const steps = [
    { value: "PENDING", label: "Menunggu Pembayaran" },
    { value: "PAID", label: "Diproses" },
    { value: "SHIPPED", label: "Dikirim" },
    { value: "COMPLETED", label: "Selesai" },
  ];

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-4">
      <h1 className="text-2xl font-bold">Riwayat Pesanan</h1>

      {orders.map((item) => {
        const stepLabel =
          steps.find((s) => s.value === item.status)?.label ?? item.status;

        return (
          <Card key={item.orderId} className="shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  {item.invoiceNumber}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <Badge
                className="px-4 py-1.5"
                variant={
                  item.status === "PAID"
                    ? "default"
                    : item.status === "PENDING"
                    ? "secondary"
                    : item.status === "CANCELED"
                    ? "destructive"
                    : "outline"
                }
              >
                {stepLabel}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Belanja</span>
                <span className="font-semibold">
                  Rp {item.total.toLocaleString("id-ID")}
                </span>
              </div>

              <Link href={`/order/${item.invoiceNumber}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 cursor-pointer"
                >
                  Lihat Detail
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
