import prisma from "@/lib/prisma";
import EditProductForm from "./editProductForm";

export default async function DetailProductPage({ params }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
  });

  if (!product) {
    return <div>Product not found</div>;
  }

  return <EditProductForm product={product} categories={categories} />;
}
