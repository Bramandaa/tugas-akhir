"use server";

import ImageKit from "imagekit";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import {
  addBannerSchema,
  editBannerSchema,
} from "@/lib/validations/bannerSchema";
import { verifySession } from "@/lib/session";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function addBanner(prevState, formData) {
  const session = await verifySession();

  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }
  try {
    const rawData = {
      name: formData.get("name"),
      image: formData.get("image"),
    };

    const validated = addBannerSchema.safeParse(rawData);

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
        folder: "/banners",
      });

      imageUrl = uploadResponse.url;
      fileId = uploadResponse.fileId;
    }

    await prisma.banner.create({
      data: {
        name: data.name,
        imageUrl,
        fileId,
      },
    });
  } catch (error) {
    console.error("Banner gagal disimpan :", error);
    return {
      success: false,
      message: "Terjadi kesalahan, coba lagi",
    };
  }
  revalidatePath("/dashboard/banner");
  redirect("/dashboard/banner?success=Banner berhasil ditambahkan");
}

export async function editBanner(prevState, formData) {
  const session = await verifySession();

  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }

  try {
    const rawData = {
      id: formData.get("id"),
      name: formData.get("name"),
      image: formData.get("image"),
    };
    const banner = await prisma.banner.findUnique({
      where: { id: Number(rawData.id) },
    });

    if (!banner) {
      return { success: false, message: "Banner tidak ditemukan" };
    }

    const validated = editBannerSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        message: "Periksa kembali input form",
        errors: validated.error.flatten().fieldErrors,
        inputs: rawData,
      };
    }

    const data = validated.data;
    let imageUrl = banner.imageUrl;
    let fileId = banner.fileId;

    if (data.image && data.image instanceof File) {
      if (banner.imageUrl) {
        try {
          await imagekit.deleteFile(banner.fileId);
        } catch (err) {
          console.warn("Gagal hapus gambar lama:", err.message);
        }
      }

      const arrayBuffer = await data.image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: data.image.name,
        folder: "/banners",
      });

      imageUrl = uploadResponse.url;
      fileId = uploadResponse.fileId;
    } else if (data.imageUrl) {
      imageUrl = data.imageUrl;
    }

    await prisma.banner.update({
      where: { id: Number(rawData.id) },
      data: {
        name: data.name,
        imageUrl,
        fileId,
      },
    });
  } catch (error) {
    console.error("Banner gagal diperbarui :", error);
    return { success: false, message: "Terjadi kesalahan, coba lagi" };
  }
  revalidatePath("/dashboard/banner");
  redirect("/dashboard/banner?success=Banner berhasil diperbarui");
}

export async function deleteBanner(id) {
  const session = await verifySession();

  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }
  try {
    const banner = await prisma.banner.findUnique({
      where: { id: Number(id) },
    });

    if (!banner) {
      return { success: false, message: "Banner tidak ditemukan" };
    }

    if (banner.fileId) {
      await imagekit.deleteFile(banner.fileId);
    }

    await prisma.banner.delete({
      where: { id: Number(id) },
    });
  } catch (error) {
    console.error("Gagal hapus banner:", error);
    return { success: false, message: "Banner gagal dihapus" };
  }

  revalidatePath("/dashboard/banner");
  redirect("/dashboard/banner?success=Produk berhasil dihapus");
}
