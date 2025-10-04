"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateStatusOrderDashboard(invoiceNumber, status) {
  const session = await verifySession();

  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }

  try {
    await prisma.order.update({
      where: { invoiceNumber: invoiceNumber },
      data: { status },
    });
  } catch (error) {
    console.error("Gagal update status pesanan:", error);
    throw new Error("Gagal mengubah status pesanan");
  }
  revalidatePath("order");
  redirect("/dashboard/order?success=Status Pesanan berhasil diubah");
}
