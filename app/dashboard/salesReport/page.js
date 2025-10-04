import { AlertCard } from "@/components/alert";
import { SearchSalesReportForm } from "./searchSalesReportForm";
import { SalesReportTable } from "./salesReportTable";

export default async function SalesReportPage({ searchParams }) {
  const {
    success: message,
    page: pageParam,
    limit: limitParam,
    search: keywordParam,
    status: statusParam,
    startDate: startDateParam,
    endDate: endDateParam,
  } = await searchParams;

  const page = parseInt(pageParam || "1", 10);
  const limit = parseInt(limitParam || "5", 10);
  const skip = (page - 1) * limit;

  const keyword = keywordParam || "";
  const status = statusParam || "all";

  const startDate = startDateParam ? new Date(startDateParam) : undefined;
  const endDate = endDateParam ? new Date(endDateParam) : undefined;

  const where = {};

  // Keyword search: invoiceNumber atau nama user
  if (keyword) {
    where.OR = [
      { invoiceNumber: { contains: keyword, mode: "insensitive" } },
      { user: { name: { contains: keyword, mode: "insensitive" } } },
    ];
  }

  // Status filter
  if (status !== "all") {
    where.status = status.toUpperCase();
  }

  // Date range filter (pastikan valid date)
  if (
    startDate instanceof Date &&
    !isNaN(startDate.getTime()) &&
    endDate instanceof Date &&
    !isNaN(endDate.getTime())
  ) {
    where.createdAt = {
      gte: startDate,
      lte: endDate,
    };
  }

  // Ambil data
  const orders = await prisma.order.findMany({
    skip,
    take: limit,
    where,
    include: { user: true },
    orderBy: { id: "asc" },
  });

  const totalItems = await prisma.order.count({ where });
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Laporan</h2>
          {message && <AlertCard message={message} />}
        </div>
      </div>

      <SearchSalesReportForm
        data={orders}
        startDate={startDate}
        endDate={endDate}
      />

      <SalesReportTable
        orders={orders}
        page={page}
        limit={limit}
        totalPages={totalPages}
      />
    </div>
  );
}
