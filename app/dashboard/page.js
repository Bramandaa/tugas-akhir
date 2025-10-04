import prisma from "@/lib/prisma";
import DashboardContent from "./dashboardContent";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export default async function DashboardPage() {
  const [penjualanAgg, pesananCount, pelangganCount] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: "COMPLETED" },
    }),
    prisma.order.count({
      where: { status: { in: ["PAID", "SHIPPED", "COMPLETED"] } },
    }),
    prisma.user.count({
      where: { role: "CUSTOMER" },
    }),
  ]);

  const rawData = await prisma.order.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const ordersByStatus = rawData.map((item) => ({
    name: item.status,
    value: item._count.status,
  }));

  const ringkasan = {
    totalPenjualan: penjualanAgg._sum.total || 0,
    jumlahPesanan: pesananCount,
    jumlahPelanggan: pelangganCount,
  };

  const orders = await prisma.order.findMany({
    where: {
      status: { in: ["PAID", "SHIPPED", "COMPLETED"] },
    },
    select: {
      createdAt: true,
    },
  });

  const ordersPerMonth = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`; // contoh "2025-10"
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const salesData = Object.entries(ordersPerMonth).map(([key, value]) => {
    const [year, month] = key.split("-");
    return {
      bulan: `${month}/${year}`,
      pesanan: value,
    };
  });

  const orderItems = await prisma.orderItem.findMany({
    where: {
      order: { status: "COMPLETED" }, // hanya dari pesanan selesai
    },
    select: {
      productId: true,
      quantity: true,
      product: {
        select: { id: true, name: true },
      },
    },
  });

  const produkMap = orderItems.reduce((acc, item) => {
    if (!acc[item.productId]) {
      acc[item.productId] = {
        id: item.product.id,
        nama: item.product.name,
        terjual: 0,
      };
    }
    acc[item.productId].terjual += item.quantity;
    return acc;
  }, {});

  const produkTerlaris = Object.values(produkMap)
    .sort((a, b) => b.terjual - a.terjual)
    .slice(0, 5);

  const latestOrders = await prisma.order.findMany({
    where: {
      status: { in: ["PAID", "SHIPPED", "COMPLETED"] }, // opsional filter
    },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const aktivitas = latestOrders.map((o) => ({
    id: o.id,
    pesan: `Pesanan terbaru dari ${o.user?.name || "Pelanggan"}`,
    invoice: o.invoiceNumber,
    waktu: formatDistanceToNow(new Date(o.createdAt), {
      addSuffix: true,
      locale: id,
    }),
  }));

  return (
    <DashboardContent
      totalPenjualan={ringkasan.totalPenjualan}
      jumlahPesanan={ringkasan.jumlahPesanan}
      jumlahPelanggan={ringkasan.jumlahPelanggan}
      ordersByStatus={ordersByStatus}
      salesData={salesData}
      produkTerlaris={produkTerlaris}
      aktivitas={aktivitas}
    />
  );
}
