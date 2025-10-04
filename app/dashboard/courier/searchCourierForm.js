"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function SearchCourierForm() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`?search=${keyword}&page=1`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex gap-4 bg-white border rounded-lg p-4 shadow-sm"
    >
      {/* Search Input */}
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">
          Apa yang ingin Anda cari?
        </label>
        <Input
          type="text"
          placeholder="Cari berdasarkan nama, nomor HP, dll"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {/* Tombol Search */}
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
