import Link from "next/link";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { CategoryTable } from "./categoryTable";
import { SearchCategoryForm } from "./searchCategoryForm";
import { AlertCard } from "@/components/alert";

export default async function CategoriesPage(props) {
  const searchParams = await props.searchParams;
  const message = searchParams.success;

  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "5");
  const skip = (page - 1) * limit;
  const keyword = searchParams.search || "";

  const where = {};

  if (keyword) {
    where.OR = [{ name: { contains: keyword, mode: "insensitive" } }];
  }

  const categories = await prisma.category.findMany({
    skip,
    take: limit,
    where,
    orderBy: { id: "asc" },
  });

  const totalItems = await prisma.category.count({ where });
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Kategori Produk</h2>
          {message && <AlertCard message={message} />}
        </div>
        <Link href="/dashboard/category/add">
          <Button className="bg-green-500 hover:bg-green-400 cursor-pointer">
            + Tambah Kategori
          </Button>
        </Link>
      </div>

      <SearchCategoryForm />

      <CategoryTable
        categories={categories}
        page={page}
        limit={limit}
        totalPages={totalPages}
      />
    </div>
  );
}
