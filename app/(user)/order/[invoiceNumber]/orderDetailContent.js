import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, Package, Phone, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function OrderDetailContent({ orderData }) {
  const steps = [
    { value: "PENDING", label: "Menunggu Pembayaran", icon: Clock },
    { value: "PAID", label: "Diproses", icon: Package },
    { value: "SHIPPED", label: "Dikirim", icon: Truck },
    { value: "COMPLETED", label: "Selesai", icon: CheckCircle },
  ];
  const currentStepIndex = steps.findIndex(
    (s) => s.value === orderData?.status
  );

  const currentStep =
    steps.find((s) => s.value === orderData?.status)?.label ?? "";

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-4">
      <h1 className="text-2xl font-bold">Detail Pesanan</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{orderData.id}</CardTitle>
            <p className="text-sm text-gray-500">
              {new Date(orderData.createdAt).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <Badge
            className="px-4 py-2"
            variant={
              orderData.status === "PAID"
                ? "default"
                : orderData.status === "PENDING"
                ? "secondary"
                : orderData.status === "CANCELED"
                ? "destructive"
                : "outline"
            }
          >
            {currentStep}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <Separator />
          <div className="space-y-2">
            {orderData.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>
                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-sm">
              <span>Ongkos Kirim</span>
              <span>Rp {orderData.shippingFee.toLocaleString("id-ID")}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Biaya Jasa</span>
              <span>Rp {orderData.serviceFee.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Biaya Layanan</span>
              <span>Rp {orderData.handlingFee.toLocaleString("id-ID")}</span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between text-sm font-semibold">
            <span>Total Belanja</span>
            <span>Rp {orderData.total.toLocaleString("id-ID")}</span>
          </div>
        </CardContent>
      </Card>

      {/* Progress Status */}
      {orderData.status !== "Dibatalkan" && (
        <Card>
          <CardHeader>
            <CardTitle>Status Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between relative">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index <= currentStepIndex;

                return (
                  <div
                    key={step.label}
                    className="flex-1 flex flex-col items-center relative"
                  >
                    {/* Icon Step */}
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors z-10 ${
                        isActive
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-400 border-gray-300"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {/* Label */}
                    <span
                      className={`mt-2 text-xs text-center ${
                        isActive ? "text-primary font-medium" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                    {/* Garis penghubung */}
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute top-5 left-1/2 w-full h-0.5 ${
                          index < currentStepIndex
                            ? "bg-primary"
                            : "bg-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informasi Pengiriman</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1 capitalize">
          <div className="flex-1">
            <div className="mb-4">
              <div className="font-medium">Kurir: -</div>
              {/* <div>-</div> */}
            </div>
            <div className="font-medium">Alamat:</div>
            <div className="">{orderData.user.name}</div>
            <div className="text-xs capitalize">
              {orderData.user.fullAddress},{" "}
              <div>
                {orderData.user.kecamatan},{" " + orderData.user.kabupaten},
                {" " + orderData.user.provinsi}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Phone size={12} className="text-primary" />
              <span>{orderData.user.phone}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      {orderData?.status == "PENDING" && (
        <Link href={"/checkout/" + orderData.invoiceNumber} className="block">
          <Button className="w-full cursor-pointer">Bayar</Button>
        </Link>
      )}
      <Link href="/order" className="block">
        <Button variant="outline" className="w-full cursor-pointer">
          Kembali
        </Button>
      </Link>
    </section>
  );
}
