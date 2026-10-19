"use client";

import { useState, useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsiAI } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09). Keduanya bonus di jalur offline.
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({ produk = {}, labelTombol, action }) {
  const [state, formAction, isPending] = useActionState(action, null);

  const [nama, setNama] = useState(produk.nama || "");
  const [kategori, setKategori] = useState(produk.kategori || "");
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi || "");
  const [sedangMembuatAI, setSedangMembuatAI] = useState(false);
  const [pesanAI, setPesanAI] = useState(null);

  const handleBuatAI = async () => {
    setPesanAI(null);
    if (!nama.trim()) {
      setPesanAI({
        tipe: "error",
        teks: "Ketik nama produk terlebih dahulu sebelum membuat deskripsi dengan AI.",
      });
      return;
    }

    setSedangMembuatAI(true);
    try {
      const res = await buatDeskripsiAI(nama, kategori);
      if (res?.error) {
        setPesanAI({ tipe: "error", teks: res.error });
      } else if (res?.deskripsi) {
        setDeskripsi(res.deskripsi);
        setPesanAI({
          tipe: "sukses",
          teks: "Deskripsi berhasil dibuat dengan AI!",
        });
      }
    } catch (err) {
      setPesanAI({
        tipe: "error",
        teks: err.message || "Gagal memproses deskripsi dengan AI.",
      });
    } finally {
      setSedangMembuatAI(false);
    }
  };

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {produk?.id && <input type="hidden" name="id" value={produk.id} />}

      {state?.error && (
        <div className="rounded-lg border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {state.error}
        </div>
      )}

      {pesanAI && (
        <div
          className={`rounded-lg border border-garis bg-permukaan p-3 text-sm ${
            pesanAI.tipe === "sukses" ? "text-utama" : "text-bahaya"
          }`}
        >
          {pesanAI.teks}
        </div>
      )}

      <Input
        label="Nama produk"
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
      />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga}
        required
      />
      <Input
        label="Kategori"
        name="kategori"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
      />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={produk.foto_url}
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="input-deskripsi" className="text-sm font-semibold">
            Deskripsi
          </label>
          <button
            type="button"
            onClick={handleBuatAI}
            disabled={sedangMembuatAI}
            className="inline-flex items-center gap-1 rounded-md border border-garis bg-permukaan px-2.5 py-1 text-xs font-semibold text-utama hover:border-utama hover:bg-latar disabled:opacity-50"
          >
            {sedangMembuatAI ? "Membuat..." : "✨ Buat dengan AI"}
          </button>
        </div>
        <textarea
          id="input-deskripsi"
          name="deskripsi"
          rows={4}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Tombol type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
