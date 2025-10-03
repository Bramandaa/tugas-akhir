"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";

export function SearchProductForm({ categories }) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(
      `?search=${keyword}&category=${category}&status=${status}&page=1`,
    );
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex gap-4 bg-white border rounded-lg p-4 shadow-sm"
    >
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">
          Apa yang ingin Anda cari?
        </label>
        <Input
          type="text"
          placeholder="Cari berdasarkan nama, harga, dll"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Kategori</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Semua" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Semua" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="ACTIVE">Aktif</SelectItem>
            <SelectItem value="INACTIVE">Nonaktif</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 cursor-pointer"
        >
          Cari
        </Button>
      </div>
    </form>
  );
}
