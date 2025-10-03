"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export function SearchOrderForm() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState(undefined);

  const handleSearch = (e) => {
    e.preventDefault();

    let query = `?search=${keyword}&status=${status}&page=1`;

    if (
      dateRange?.from instanceof Date &&
      !isNaN(dateRange.from.getTime()) &&
      dateRange?.to instanceof Date &&
      !isNaN(dateRange.to.getTime())
    ) {
      query += `&startDate=${format(
        dateRange.from,
        "yyyy-MM-dd"
      )}&endDate=${format(dateRange.to, "yyyy-MM-dd")}`;
    }

    router.push(query);
  };

  const formatRangeLabel = () => {
    if (
      !dateRange?.from ||
      !dateRange?.to ||
      !(dateRange.from instanceof Date) ||
      isNaN(dateRange.from.getTime()) ||
      !(dateRange.to instanceof Date) ||
      isNaN(dateRange.to.getTime())
    ) {
      return "Pilih Tanggal";
    }

    return `${format(dateRange.from, "dd MMM yyyy")} - ${format(
      dateRange.to,
      "dd MMM yyyy"
    )}`;
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
          placeholder="Cari berdasarkan invoice, nama, dll"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Semua" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="PENDING">PENDING</SelectItem>
            <SelectItem value="PAID">PAID</SelectItem>
            <SelectItem value="SHIPPED">SHIPPED</SelectItem>
            <SelectItem value="COMPLETED">COMPLETED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Range Picker */}
      <div>
        <label className="block text-sm font-medium mb-1">Tanggal</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[220px]">
              {formatRangeLabel()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
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
