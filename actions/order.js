export async function updateStatusOrderDashboard(id, status) {
  const session = await verifySession();

  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }

  try {
    await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });
  } catch (error) {
    console.error("Gagal update status pesanan:", error);
    throw new Error("Gagal mengubah status pesanan");
  }
  revalidatePath("/dashboard/order");
  redirect("/dashboard/order?success=Status Pesanan berhasil diubah");
}
