import { toOrderDTO } from "../dto/order";
import prisma from "../prisma";

export async function getOrdersByUser(userId) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return orders.map(toOrderDTO);
}

export async function getOrderByUser(invoiceNumber) {
  const order = await prisma.order.findUnique({
    where: { invoiceNumber: invoiceNumber },
    include: {
      user: true,
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) throw new Error("Order tidak ditemukan");

  return toOrderDTO(order);
}

//   return {
//     orderId: order.id,
//     userId: order.userId,
//     total: order.total,
//     items: order.items.map((item) => ({
//       productId: item.productId,
//       quantity: item.quantity,
//       price: item.price,
//       product: item.product
//         ? { name: item.product.name, imageUrl: item.product.imageUrl }
//         : null,
//     })),
//   };
// }
