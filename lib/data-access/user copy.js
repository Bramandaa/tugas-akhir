import { toUserAddressDTO, toUserDTO, toUsersDTOs } from "../dto/user";
import prisma from "../prisma";

export async function getUserById(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return toUserDTO(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Gagal mengambil data user");
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      where: { role: "COURIER" },
      orderBy: { createdAt: "desc" },
    });

    return toUsersDTOs(users);
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Gagal mengambil data user");
  }
}

export async function getAddress(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return toUserAddressDTO(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Gagal mengambil data user");
  }
}
