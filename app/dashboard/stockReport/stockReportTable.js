"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export function StockReportTable({ data, page, limit, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = (updates) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value);
    });

    return params.toString();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            <th className="w-12 text-left">No</th>
            <th className="w-[100%] text-left">Nama Produk</th>
            <th className="w-[100%] text-center">Total Pesanan</th>
          </tr>
        </thead>
        <tbody>
          {data?.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="py-24 text-center text-gray-500 italic"
              >
                Kategori tidak ditemukan
              </td>
            </tr>
          ) : (
            data?.map((item, index) => (
              <tr
                key={item.productId}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-1.5">{(page - 1) * limit + index + 1}</td>
                <td className="py-1.5">{item.productName}</td>
                <td className="py-1.5 text-center">{item.totalOrder}</td>
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
