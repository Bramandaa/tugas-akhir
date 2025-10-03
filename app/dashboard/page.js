"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function DashboardPage() {
  const salesData = [
    { bulan: "Jan", penjualan: 4000, pesanan: 240 },
    { bulan: "Feb", penjualan: 3000, pesanan: 200 },
    { bulan: "Mar", penjualan: 5000, pesanan: 300 },
    { bulan: "Apr", penjualan: 4780, pesanan: 280 },
    { bulan: "Mei", penjualan: 5890, pesanan: 350 },
    { bulan: "Jun", penjualan: 6390, pesanan: 400 },
  ];

  const produkTerlaris = [
    { id: 1, nama: "Rice Cooker", terjual: 320 },
    { id: 2, nama: "Detergen Pack", terjual: 280 },
    { id: 3, nama: "Lampu LED", terjual: 210 },
  ];

  const aktivitas = [
    { id: 1, teks: "Pesanan baru #1026 dari Budi", waktu: "2 menit lalu" },
    {
      id: 2,
      teks: "Stok produk 'Rice Cooker' diperbarui",
      waktu: "10 menit lalu",
    },
    { id: 3, teks: "Pelanggan baru mendaftar: Sarah", waktu: "1 jam lalu" },
  ];

  return (
    <div className="grid gap-6">
      {/* Kartu Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex space-x-4 items-center bg-white p-4 rounded-xl shadow">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-primary"
              viewBox="0 0 21 21"
            >
              <g
                fill="none"
                fillRule="evenodd"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4.5 3.5v11a2 2 0 0 0 2 2h11" />
                <path d="m6.5 12.5l3-3l2 2l5-5" />
                <path d="M16.5 9.5v-3h-3" />
              </g>
            </svg>
          </div>
          <div>
            <h3 className="text-gray-500">Total Penjualan</h3>
            <p className="text-2xl font-bold text-primary">Rp 12.430.000</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10"
              viewBox="0 0 48 48"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2.5"
              >
                <rect width="30" height="36" x="9" y="8" rx="2" />
                <path
                  strokeLinecap="round"
                  d="M18 4v6m12-6v6m-14 9h16m-16 8h12m-12 8h8"
                />
              </g>
            </svg>
          </div>
          <div>
            <h3 className="text-gray-500">Jumlah Pesanan</h3>
            <p className="text-2xl font-bold text-primary">1.230</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2m1-17.87a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-gray-500">Jumlah Pelanggan</h3>
            <p className="text-2xl font-bold text-primary">890</p>
          </div>
        </div>
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grafik Garis */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-primary">
            Ringkasan Penjualan
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="penjualan"
                stroke="#155dfc"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="pesanan"
                stroke="#155dfc"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Grafik Batang */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-primary">
            Jumlah Pesanan per Bulan
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pesanan" fill="#155dfc" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bagian Bawah */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Produk Terlaris */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-primary">
            Produk Terlaris
          </h3>
          <ul className="space-y-3">
            {produkTerlaris.map((p) => (
              <li key={p.id} className="flex justify-between text-primary">
                <span>{p.nama}</span>
                <span className="font-semibold">{p.terjual} terjual</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Aktivitas Terbaru */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-primary">
            Aktivitas Terbaru
          </h3>
          <ul className="space-y-3">
            {aktivitas.map((a) => (
              <li
                key={a.id}
                className="flex justify-between text-sm text-primary"
              >
                <span>{a.teks}</span>
                <span className="text-gray-500">{a.waktu}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
