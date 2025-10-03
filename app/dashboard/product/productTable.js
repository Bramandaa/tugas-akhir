"use client";

import { deleteProduct, updateProductStatus } from "@/actions/product";
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
import { Pencil, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function ProductTable({ products, page, limit, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = (updates) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value);
    });

    return params.toString();
  };

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleChangeStatus = async (id, newStatus) => {
    if (!confirm(`Yakin ubah status produk ini menjadi ${newStatus}?`)) return;

    await updateProductStatus(id, newStatus);
  };

  const handleEdit = (slug) => {
    router.push("/dashboard/product/" + slug);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus produk ini?")) return;
    await deleteProduct(id);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            <th className="w-12 text-left">No</th>
            <th className="w-[30%] text-left">Nama</th>
            <th className="w-[30%] text-left">Kategori</th>
            <th className="w-[15%] text-left">Harga</th>
            <th className="w-[13%] text-center">Status</th>
            <th className="w-[10%] text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="py-24 text-center text-gray-500 italic"
              >
                Produk tidak ditemukan
              </td>
            </tr>
          ) : (
            products.map((p, index) => (
              <tr
                key={p.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-1.5">{(page - 1) * limit + index + 1}</td>
                <td className="py-1.5 truncate max-w-[250px]">{p.name}</td>
                <td className="py-1.5">{p.category?.name}</td>
                <td className="py-1.5">{formatRupiah(p.price)}</td>

                {/* Dropdown Status */}
                <td className="py-1.5 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={
                          p.status === "ACTIVE"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }
                      >
                        {p.status === "ACTIVE" ? "AKTIF" : "NONAKTIF"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleChangeStatus(p.id, "ACTIVE")}
                      >
                        Aktif
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleChangeStatus(p.id, "INACTIVE")}
                      >
                        Nonaktif
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>

                {/* Actions */}
                <td className="py-1.5 text-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleEdit(p.slug)}
                  >
                    <Pencil className="w-4 h-4 text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
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
