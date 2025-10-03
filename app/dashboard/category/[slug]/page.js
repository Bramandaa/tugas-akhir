import EditCategoryForm from "./editCategoryForm";
import { getCategory } from "@/lib/data-access/category";

export default async function DetailProductPage({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);

  return <EditCategoryForm category={category} />;
}
