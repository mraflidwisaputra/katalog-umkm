"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  if (!produk) return null;

  const [jumlah, setJumlah] = useState(1);
  const [varian, setVarian] = useState("");

  const nomor = (toko.nomorWhatsApp || "").replace(/[^0-9]/g, "");
  const totalHarga = produk.harga * jumlah;

  // Susun pesan otomatis WhatsApp dengan nama, jumlah, varian/catatan, dan total harga
  let pesan = `Halo ${toko.nama}, saya ingin memesan:\n` +
    `- Produk: ${produk.nama}\n` +
    `- Jumlah: ${jumlah}\n`;

  if (varian.trim()) {
    pesan += `- Varian / Catatan: ${varian.trim()}\n`;
  }

  pesan += `- Total: ${formatRupiah(totalHarga)}\n\n` +
    `Apakah pesanan ini masih tersedia?`;

  const urlWhatsApp = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex flex-wrap items-end gap-3">
        {/* Pemilih Jumlah */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="jumlah-pesanan" className="text-xs font-semibold text-teks-lembut">
            Jumlah
          </label>
          <div className="flex h-10 items-center rounded-lg border border-garis bg-latar">
            <button
              type="button"
              onClick={() => setJumlah((prev) => Math.max(1, prev - 1))}
              disabled={jumlah <= 1}
              className="h-full px-3 text-lg font-bold text-teks hover:bg-permukaan disabled:opacity-30"
              aria-label="Kurangi jumlah"
            >
              −
            </button>
            <span id="jumlah-pesanan" className="w-10 text-center font-semibold text-teks">
              {jumlah}
            </span>
            <button
              type="button"
              onClick={() => setJumlah((prev) => prev + 1)}
              className="h-full px-3 text-lg font-bold text-teks hover:bg-permukaan"
              aria-label="Tambah jumlah"
            >
              +
            </button>
          </div>
        </div>

        {/* Pilihan Varian / Catatan */}
        <div className="flex flex-1 min-w-[200px] flex-col gap-1.5">
          <label htmlFor="varian-pesanan" className="text-xs font-semibold text-teks-lembut">
            Varian / Catatan (opsional)
          </label>
          <input
            id="varian-pesanan"
            type="text"
            value={varian}
            onChange={(e) => setVarian(e.target.value)}
            placeholder="Contoh: Manis sedang, pedas, dsb."
            className="h-10 w-full rounded-lg border border-garis bg-latar px-3 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
        </div>
      </div>

      {/* Subtotal ringkas */}
      <div className="flex items-center justify-between rounded-lg bg-permukaan px-3 py-2 text-sm">
        <span className="text-teks-lembut">Subtotal ({jumlah} barang):</span>
        <span className="font-bold text-harga">{formatRupiah(totalHarga)}</span>
      </div>

      {/* Tombol Pesan WhatsApp */}
      <a
        href={urlWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp ({formatRupiah(totalHarga)})
      </a>
    </div>
  );
}
