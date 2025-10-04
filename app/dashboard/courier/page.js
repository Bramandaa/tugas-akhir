import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CourierTable } from "./courierTable";
import { SearchCourierForm } from "./searchCourierForm";
import { getCourier } from "@/lib/data-access/user";
import prisma from "@/lib/prisma";
import { AlertCard } from "@/components/alert";

export default async function CourierPage(props) {
  const searchParams = await props.searchParams;
  const message = searchParams.success;

  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "5");
  const skip = (page - 1) * limit;
  const keyword = searchParams.search || "";

  const where = { role: "COURIER" };

  if (keyword) {
    where.OR = [
      { name: { contains: keyword, mode: "insensitive" } },
      { phone: { contains: keyword, mode: "insensitive" } },
    ];
  }

  const users = await getCourier({ skip, where, limit });

  const totalItems = await prisma.user.count({ where });
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Daftar Akun Kurir</h2>
          {message && <AlertCard message={message} />}
        </div>
        <Link href="/dashboard/courier/add">
          <Button className="bg-green-500 hover:bg-green-400 cursor-pointer">
            + Tambah Kurir
          </Button>
        </Link>
      </div>

      <SearchCourierForm />

      <CourierTable
        users={users}
        page={page}
        limit={limit}
        totalPages={totalPages}
      />
    </div>
  );
}
