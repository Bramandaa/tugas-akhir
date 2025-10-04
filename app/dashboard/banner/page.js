import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { BannerTable } from "./bannerTable";
import { SearchBannerForm } from "./searchBannerForm";
import { AlertCard } from "@/components/alert";
import { toBannerDTOs } from "@/lib/dto/banner";

export default async function BannerPage(props) {
  const searchParams = await props.searchParams;
  const message = searchParams.success;

  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "5");
  const skip = (page - 1) * limit;
  const keyword = searchParams.search || "";

  const where = {};

  if (keyword) {
    where.OR = [{ name: { contains: keyword, mode: "insensitive" } }];
  }

  const banners = await prisma.banner.findMany({
    skip,
    take: limit,
    where,
    orderBy: { id: "asc" },
  });

  const DataBanners = toBannerDTOs(banners);

  const totalItems = await prisma.category.count({ where });
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Banner Promosi</h2>
          {message && <AlertCard message={message} />}
        </div>
        <Link href="/dashboard/banner/add">
          <Button className="bg-green-500 hover:bg-green-400 cursor-pointer">
            + Tambah Banner
          </Button>
        </Link>
      </div>

      <SearchBannerForm />

      <BannerTable
        banners={DataBanners}
        page={page}
        limit={limit}
        totalPages={totalPages}
      />
    </div>
  );
}
