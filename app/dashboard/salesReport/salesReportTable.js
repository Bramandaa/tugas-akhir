"use client";

import { updateStatusOrderDashboard } from "@/actions/order";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export function SalesReportTable({ orders, page, limit, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = (updates) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value);
    });

    return params.toString();
  };

  const handleChangeStatus = async (id, newStatus) => {
    if (!confirm(`Yakin ubah status pesanan ini menjadi ${newStatus}?`)) return;

    await updateStatusOrderDashboard(id, newStatus);
  };

  const statusOptions = [
    // { label: "PENDING", value: "PENDING" },
    { label: "PAID", value: "PAID" },
    { label: "SHIPPED", value: "SHIPPED" },
    { label: "COMPLETED", value: "COMPLETED" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            <th className="w-12 text-left">No</th>
            <th className="w-[30%] text-left">Invoice</th>
            <th className="w-[30%] text-left">Nama</th>
            <th className="w-[10%] text-left">Tanggal</th>
            <th className="w-[20%] text-center">Status</th>
            <th className="w-[10%] text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="py-24 text-center text-gray-500 italic"
              >
                Kategori tidak ditemukan
              </td>
            </tr>
          ) : (
            orders.map((item, index) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-1.5">{(page - 1) * limit + index + 1}</td>
                <td className="py-1.5">{item.invoiceNumber}</td>
                <td className="py-1.5">{item.user.name}</td>
                <td className="py-1.5">
                  {new Date(item.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="py-1.5 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`
                          ${
                            item.status === "PENDING"
                              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              : item.status === "PAID"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : item.status === "SHIPPED"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : item.status === "COMPLETED"
                              ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                              : item.status === "CANCELLED"
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : ""
                          } w-28
                        `}
                  >
                    {item.status}
                  </Button>
                </td>

                {/* Actions */}
                <td className="py-1.5 text-center space-x-2">
                  <Link href={"/dashboard/order/" + item.invoiceNumber}>
                    <Button
                      size="icon"
                      className="h-7 w-7 bg-gray-300 shadow-sm"
                    >
                      <Eye className="w-4 h-4 text-white" strokeWidth={2} />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Pagination & Limit Options */}
      <div className="flex justify-between items-center mt-4">
        {/* Dropdown Limit pakai shadcn */}
        <div className="flex items-center space-x-2">
          <span>Tampilkan:</span>
          <Select
            value={String(limit)}
            onValueChange={(val) =>
              router.push(`?${createQueryString({ page: 1, limit: val })}`)
            }
          >
            <SelectTrigger className="w-[100px] cursor-pointer">
              <SelectValue placeholder="Pilih limit" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((val) => (
                <SelectItem key={val} value={String(val)}>
                  {val}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pagination Buttons */}
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              className={`${
                p === page ? "bg-blue-500 hover:bg-blue-400 text-white" : ""
              } cursor-pointer`}
              onClick={() =>
                router.push(`?${createQueryString({ page: p, limit })}`)
              }
            >
              {p}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
