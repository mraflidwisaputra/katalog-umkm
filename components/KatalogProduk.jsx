"use client";

import { useState, useMemo } from "react";
import KartuProduk from "@/components/KartuProduk";

export default function KatalogProduk({ daftarProduk = [] }) {
  const [pencarian, setPencarian] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  // Dapatkan daftar kategori unik dari data produk
  const kategoriList = useMemo(() => {
    const list = Array.from(
      new Set(daftarProduk.map((p) => p.kategori).filter(Boolean))
    );
    return ["Semua", ...list];
  }, [daftarProduk]);

  // Saring produk berdasarkan pencarian nama dan kategori yang dipilih
  const produkTersaring = useMemo(() => {
    return daftarProduk.filter((produk) => {
      const cocokKategori =
        kategoriAktif === "Semua" || produk.kategori === kategoriAktif;
      const q = pencarian.toLowerCase().trim();
      const cocokPencarian =
        !q ||
        (produk.nama && produk.nama.toLowerCase().includes(q)) ||
        (produk.deskripsi && produk.deskripsi.toLowerCase().includes(q));

      return cocokKategori && cocokPencarian;
    });
  }, [daftarProduk, pencarian, kategoriAktif]);

  return (
    <div className="flex flex-col gap-5">
      {/* Kolom pencarian & Filter kategori */}
      <div className="flex flex-col gap-3">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={pencarian}
            onChange={(e) => setPencarian(e.target.value)}
            placeholder="Cari nama produk..."
            className="w-full rounded-xl border border-garis bg-latar px-4 py-2.5 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
          {pencarian && (
            <button
              type="button"
              onClick={() => setPencarian("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-teks-lembut hover:text-teks"
            >
              Reset
            </button>
          )}
        </div>

        {kategoriList.length > 1 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {kategoriList.map((kat) => {
              const aktif = kategoriAktif === kat;
              return (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setKategoriAktif(kat)}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                    aktif
                      ? "bg-utama text-white"
                      : "border border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
                  }`}
                >
                  {kat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid Produk */}
      {produkTersaring.length === 0 ? (
        <p className="py-8 text-center text-sm text-teks-lembut">
          Tidak ada produk yang cocok dengan pencarian &quot;{pencarian}&quot;.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {produkTersaring.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}

