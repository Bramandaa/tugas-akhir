import { toBannerDTOs } from "@/lib/dto/banner";
import prisma from "../prisma";

export async function getBanners() {
  const banners = await prisma.banner.findMany({
    orderBy: { id: "asc" },
  });

  return toBannerDTOs(banners);
}
