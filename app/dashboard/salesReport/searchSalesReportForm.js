"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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
import { FileDown } from "lucide-react";

export function SearchSalesReportForm({ data, startDate, endDate }) {
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

  const exportPDF = () => {
    const doc = new jsPDF("l", "pt", "a4"); // landscape biar muat tabel lebar

    // Judul laporan
    doc.setFontSize(16);
    doc.text("Laporan Order", 40, 30);

    // Buat tabel
    autoTable(doc, {
      startY: 50,
      head: [
        [
          "Invoice",
          "Tanggal",
          "Customer",
          "Phone",
          "Subtotal",
          "Ongkir",
          "Service",
          "Handling",
          "Total",
          "Status",
        ],
      ],
      body: data.map((item) => [
        item.invoiceNumber,
        new Date(item.createdAt).toLocaleDateString("id-ID"),
        item.user.name,
        item.user.phone,
        item.subtotal.toLocaleString("id-ID"),
        item.shippingFee.toLocaleString("id-ID"),
        item.serviceFee.toLocaleString("id-ID"),
        item.handlingFee.toLocaleString("id-ID"),
        item.total.toLocaleString("id-ID"),
        item.status,
      ]),
      styles: { fontSize: 9 }, // biar tabel muat banyak data
      headStyles: { fillColor: [52, 152, 219] }, // biru untuk header
    });

    // Fungsi format tanggal
    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;
    };

    let fileName = "";

    if (startDate && endDate) {
      fileName = `laporan_order_${formatDate(startDate)}_sampai_${formatDate(
        endDate
      )}.pdf`;
    } else if (startDate) {
      fileName = `laporan_order_${formatDate(startDate)}_sampai_all.pdf`;
    } else if (endDate) {
      fileName = `laporan_order_all_sampai_${formatDate(endDate)}.pdf`;
    } else {
      const today = formatDate(new Date());
      fileName = `laporan_order_${today}.pdf`;
    }

    doc.save(fileName);
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
      <div className="flex items-end">
        <Button
          type="button"
          onClick={exportPDF}
          className="bg-red-500 hover:bg-red-500/80 cursor-pointer"
        >
          <FileDown />
          Download
        </Button>
      </div>
    </form>
  );
}
