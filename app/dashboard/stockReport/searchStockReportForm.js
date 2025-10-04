"use client";

import { useRouter } from "next/navigation";
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
import { FileDown } from "lucide-react";

export function SearchStockReportForm({ data }) {
  const router = useRouter();
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  const handleSearch = (e) => {
    e.preventDefault();
    // selalu ambil tanggal 1–25
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = `${year}-${String(month).padStart(2, "0")}-25`;

    router.push(
      `?month=${month}&year=${year}&startDate=${startDate}&endDate=${endDate}`
    );
  };

  const exportPDF = () => {
    const doc = new jsPDF("l", "pt", "a4");

    const monthName = months[month - 1]; // pakai months dari state di atas

    // Judul laporan
    doc.setFontSize(16);
    doc.text(`Laporan Stok Produk - ${monthName} ${year}`, 40, 30);

    // Tabel laporan
    autoTable(doc, {
      startY: 50,
      head: [["Produk", "Jumlah Pesanan"]],
      body: data.map((item) => [
        item.productName,
        item.totalOrder.toLocaleString("id-ID"),
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [52, 152, 219], halign: "center" },
      columnStyles: {
        1: { halign: "center" },
      },
    });

    // Nama file PDF juga ikut bulan & tahun
    const fileName = `laporan_stok_${monthName}_${year}.pdf`;
    doc.save(fileName);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex justify-between gap-4 bg-white border rounded-lg p-4 shadow-sm"
    >
      <div className="flex space-x-4">
        {/* Dropdown Bulan */}
        <div>
          <label className="block text-sm font-medium mb-1">Bulan</label>
          <Select
            value={String(month)}
            onValueChange={(v) => setMonth(Number(v))}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, i) => (
                <SelectItem key={i} value={String(i + 1)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Dropdown Tahun */}
        <div>
          <label className="block text-sm font-medium mb-1">Tahun</label>
          <Select
            value={String(year)}
            onValueChange={(v) => setYear(Number(v))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
      </div>
      <div className="flex space-x-4">
        {/* Tombol Download */}
        <div className="flex items-end">
          <Button
            type="button"
            onClick={exportPDF}
            className="bg-red-500 hover:bg-red-500/80 cursor-pointer"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </form>
  );
}
