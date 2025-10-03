import prisma from "@/lib/prisma";
import AddProductForm from "./addProductForm";
import { toCategoriesDTOs } from "@/lib/dto/category";

export default async function AddProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
  });
  const dataCategories = toCategoriesDTOs(categories);

  return <AddProductForm categories={dataCategories} />;
}
