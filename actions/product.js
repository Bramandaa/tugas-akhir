"use server";

import ImageKit from "imagekit";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import {
  addProductSchema,
  editProductSchema,
} from "@/lib/validations/productSchema";
import { verifySession } from "@/lib/session";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function addProduct(prevState, formData) {
  const session = await verifySession();

  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }

  try {
    const rawData = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      price: formData.get("price"),
      discountType: formData.get("discountType"),
      discount: formData.get("discount"),
      categoryId: formData.get("categoryId"),
      status: formData.get("status") || "INACTIVE",
      isFeatured: formData.get("isFeatured"),
      image: formData.get("image"),
    };

    const validated = await addProductSchema.safeParseAsync(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Periksa kembali input form",
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
      };
    }

    const data = validated.data;

    let imageUrl = "";
    let fileId = "";
    if (data.image && data.image instanceof File) {
      const arrayBuffer = await data.image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: data.image.name,
        folder: "/products",
      });

      imageUrl = uploadResponse.url;
      fileId = uploadResponse.fileId;
    }

    await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: Number(data.price),
        discountType: data.discountType,
        discount: Number(data.discount),
        categoryId: Number(data.categoryId),
        status: data.status,
        isFeatured: data.isFeatured,
        imageUrl,
        fileId,
      },
    });
  } catch (error) {
    console.error("Produk gagal disimpan :", error);
    return {
      success: false,
      message: "Terjadi kesalahan, coba lagi",
    };
  }
  revalidatePath("/dashboard/product");
  redirect("/dashboard/product?success=Produk berhasil ditambahkan");
}

export async function editProduct(prevState, formData) {
  const session = await verifySession();

  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }

  try {
    const rawData = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      price: formData.get("price"),
      discountType: formData.get("discountType"),
      discount: formData.get("discount"),
      categoryId: formData.get("categoryId"),
      status: formData.get("status") || "INACTIVE",
      isFeatured: formData.get("isFeatured"),
      image: formData.get("image"),
      imageUrl: formData.get("imageUrl"),
    };

    const oldSlug = formData.get("oldSlug");
    if (!oldSlug) {
      return { success: false, message: "Slug lama tidak ditemukan" };
    }

    const product = await prisma.product.findUnique({
      where: { slug: String(oldSlug) },
    });

    if (!product) {
      return { success: false, message: "Produk tidak ditemukan" };
    }

    const validated = await editProductSchema.safeParseAsync(rawData);
    if (!validated.success) {
      return {
        success: false,
        message: "Periksa kembali input form",
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
      };
    }

    const data = validated.data;
    let imageUrl = product.imageUrl;
    let fileId = product.fileId;

    if (data.slug && data.slug !== product.slug) {
      const existing = await prisma.product.findUnique({
        where: { slug: data.slug },
      });

      if (existing) {
        return {
          success: false,
          message: "Slug sudah digunakan",
          errors: { slug: ["Slug sudah digunakan"] },
          inputs: rawData,
        };
      }
    }

    if (data.image && data.image instanceof File) {
      if (product.imageUrl) {
        try {
          await imagekit.deleteFile(product.fileId);
        } catch (err) {
          console.warn("Gagal hapus gambar lama:", err.message);
        }
      }

      const arrayBuffer = await data.image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: data.image.name,
        folder: "/products",
      });

      imageUrl = uploadResponse.url;
      fileId = uploadResponse.fileId;
    } else if (data.imageUrl) {
      imageUrl = data.imageUrl;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: Number(data.price),
        discountType: data.discountType,
        discount: Number(data.discount),
        categoryId: Number(data.categoryId),
        status: data.status,
        isFeatured: data.isFeatured,
        imageUrl,
        fileId,
      },
    });
  } catch (error) {
    console.error("Produk gagal diperbarui :", error);
    return {
      success: false,
      message: "Terjadi kesalahan, coba lagi",
    };
  }
  revalidatePath("/dashboard/product");
  redirect("/dashboard/product?success=Produk berhasil diperbarui");
}

export async function updateProductStatus(id, status) {
  const session = await verifySession();

  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }

  try {
    await prisma.product.update({
      where: { id: Number(id) },
      data: { status },
    });
  } catch (error) {
    console.error("Gagal update status produk:", error);
    throw new Error("Gagal mengubah status produk");
  }
  revalidatePath("/dashboard/product");
  redirect("/dashboard/product?success=Status Produk berhasil diubah");
}

export async function deleteProduct(id) {
  const session = await verifySession();

  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return { success: false, message: "Produk tidak ditemukan" };
    }

    if (product.fileId) {
      await imagekit.deleteFile(product.fileId);
    }

    await prisma.product.delete({
      where: { id: Number(id) },
    });
  } catch (error) {
    console.error("Gagal hapus produk:", error);
    return { success: false, message: "Produk gagal dihapus" };
  }

  revalidatePath("/dashboard/product");
  redirect("/dashboard/product?success=Produk berhasil dihapus");
}
