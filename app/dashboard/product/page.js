import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductTable } from "./productTable";
import prisma from "@/lib/prisma";
import { SearchProductForm } from "./searchProductForm";
import { toProductDTOs } from "@/lib/dto/product";
import { AlertCard } from "@/components/alert";
import { toCategoriesDTOs } from "@/lib/dto/category";

export default async function ProductsPage(props) {
  const searchParams = await props.searchParams;
  const message = searchParams.success;

  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "5");
  const skip = (page - 1) * limit;

  const keyword = searchParams.search || "";
  const category = searchParams.category || "all";
  const status = searchParams.status || "all";

  const where = {};

  if (keyword) {
    where.OR = [
      { name: { contains: keyword, mode: "insensitive" } },
      { category: { name: { contains: keyword, mode: "insensitive" } } },
    ];
  }

  if (category !== "all") {
    where.categoryId = parseInt(category);
  }

  if (status !== "all") {
    where.status = status.toUpperCase();
  }

  const products = await prisma.product.findMany({
    skip,
    take: limit,
    orderBy: { id: "asc" },
    where,
    include: {
      category: {
        select: { name: true },
      },
    },
  });
  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
  });

  const dataProducts = toProductDTOs(products);
  const dataCategories = toCategoriesDTOs(categories);

  const totalItems = await prisma.product.count({ where });
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Produk</h2>
          {message && <AlertCard message={message} />}
        </div>
        {/* Action Bar */}
        <Link href="/dashboard/product/add">
          <Button className="bg-green-500 hover:bg-green-400 cursor-pointer">
            + Tambah Produk
          </Button>
        </Link>
      </div>

      {/* Search Form */}
      <SearchProductForm categories={dataCategories} />

      {/* Products Table */}
      <ProductTable
        products={dataProducts}
        page={page}
        limit={limit}
        totalPages={totalPages}
      />
    </div>
  );
}
