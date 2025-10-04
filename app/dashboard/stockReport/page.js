import { OrderStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { StockReportTable } from "./stockReportTable";
import { SearchStockReportForm } from "./searchStockReportForm";

export default async function StockReportPage({ searchParams }) {
  const {
    success: message,
    page: pageParam,
    limit: limitParam,
    month: monthParam,
    year: yearParam,
  } = await searchParams;

  const page = parseInt(pageParam || "1", 10);
  const limit = parseInt(limitParam || "10", 10);
  const skip = (page - 1) * limit;

  // ambil range tanggal dari month & year
  const year = parseInt(yearParam || new Date().getFullYear(), 10);
  const month = parseInt(monthParam || new Date().getMonth() + 1, 10);

  const startDate = new Date(year, month - 1, 1); // awal bulan
  const endDate = new Date(year, month - 1, 25, 23, 59, 59); // fix tanggal 25

  // ambil semua groupBy (tanpa skip/take dulu)
  const allGrouped = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    where: {
      order: {
        status: OrderStatus.PAID,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
  });

  // hitung total items
  const totalItems = allGrouped.length;
  const totalPages = Math.ceil(totalItems / limit);

  // ambil hanya sesuai pagination
  const paginatedGrouped = allGrouped.slice(skip, skip + limit);

  // join produk
  const products = await prisma.product.findMany({
    where: { id: { in: paginatedGrouped.map((g) => g.productId) } },
  });

  // gabungkan data produk dengan qty
  const data = paginatedGrouped.map((g) => {
    const product = products.find((p) => p.id === g.productId);
    return {
      productId: g.productId,
      productName: product?.name,
      totalOrder: g._sum.quantity || 0,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Laporan Stok</h2>
          {message && <AlertCard message={message} />}
        </div>
      </div>

      <SearchStockReportForm
        data={data}
        startDate={startDate}
        endDate={endDate}
      />

      <StockReportTable
        data={data}
        page={page}
        limit={limit}
        totalPages={totalPages}
      />
    </div>
  );
}
