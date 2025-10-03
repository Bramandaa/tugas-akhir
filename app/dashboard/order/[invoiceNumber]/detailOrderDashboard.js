import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Format rupiah sederhana
const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    value
  );

function getStatusBadge(status) {
  switch (status) {
    case "PENDING":
      return (
        <Badge className="bg-yellow-500 text-white px-4 py-2">{status}</Badge>
      );
    case "PAID":
      return (
        <Badge className="bg-green-600 text-white px-4 py-2">{status}</Badge>
      );
    case "SHIPPED":
      return (
        <Badge className="bg-blue-500 text-white px-4 py-2">{status}</Badge>
      );
    case "COMPLETED":
      return (
        <Badge className="bg-emerald-600 text-white px-4 py-2">{status}</Badge>
      );
    case "CANCELLED":
      return (
        <Badge className="bg-red-600 text-white px-4 py-2">{status}</Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
}

export default function DetailOrderDashboard({ order }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Detail Pesanan</h2>
      {/* Order Info */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <p className="font-semibold">Invoice:</p>
            <p>{order.invoiceNumber}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold">Status:</p>
            {getStatusBadge(order.status)}
          </div>
          <div className="flex justify-between">
            <p className="font-semibold">Tanggal:</p>
            <p>
              {format(order.createdAt, "dd MMMM yyyy, HH:mm", { locale: id })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle>Data Customer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p>
            <span className="font-semibold">Nama:</span> {order.user.name}
          </p>
          <p>
            <span className="font-semibold">Telepon:</span> {order.user.phone}
          </p>
          <p>
            <span className="font-semibold">Alamat:</span>{" "}
            {order.user.fullAddress}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.user.kecamatan}, {order.user.kabupaten},{" "}
            {order.user.provinsi}
          </p>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Produk Dipesan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produk</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatRupiah(item.price)}</TableCell>
                  <TableCell>
                    {formatRupiah(item.price * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>{formatRupiah(order.subtotal)}</p>
          </div>
          <div className="flex justify-between">
            <p>Ongkir</p>
            <p>{formatRupiah(order.shippingFee)}</p>
          </div>
          <div className="flex justify-between">
            <p>Service Fee</p>
            <p>{formatRupiah(order.serviceFee)}</p>
          </div>
          <div className="flex justify-between">
            <p>Handling Fee</p>
            <p>{formatRupiah(order.handlingFee)}</p>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <p>Total</p>
            <p>{formatRupiah(order.total)}</p>
          </div>
        </CardContent>
      </Card>

      <Link href="/dashboard/order" className="block">
        <Button variant="outline" className="w-full cursor-pointer">
          Kembali
        </Button>
      </Link>
    </div>
  );
}
