"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSessionClient } from "@/lib/supabase/session";

export async function login(prevState, formData) {
  let data = formData;
  if (!data && prevState instanceof FormData) {
    data = prevState;
  }

  const email = data?.get("email")?.toString().trim();
  const password = data?.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  try {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: "Email atau password salah. Silakan coba lagi." };
    }
  } catch (err) {
    return { error: err.message || "Gagal menghubungi server autentikasi." };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function logout() {
  try {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  } catch {
    // Abaikan jika sudah tidak ada sesi aktif
  }

  revalidatePath("/", "layout");
  redirect("/admin/login");
}

export const keluar = logout;

export async function gantiPassword(prevState, formData) {
  let data = formData;
  if (!data && prevState instanceof FormData) {
    data = prevState;
  }

  const passwordBaru = data?.get("password_baru")?.toString();
  const konfirmasiPassword = data?.get("konfirmasi_password")?.toString();

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak cocok dengan password baru." };
  }

  try {
    const supabase = await createSessionClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        error: "Anda belum masuk atau sesi telah berakhir. Silakan login kembali.",
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordBaru,
    });

    if (error) {
      return { error: error.message || "Gagal mengganti password." };
    }

    return { sukses: "Password berhasil diganti!" };
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat mengganti password." };
  }
}

export const ubahPassword = gantiPassword;

export async function tambahProduk(prevState, formData) {
  let data = formData instanceof FormData ? formData : prevState;

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const nama = data?.get("nama")?.toString().trim();
  const hargaRaw = data?.get("harga")?.toString().trim();
  const harga = parseInt(hargaRaw || "0", 10);
  const kategori = data?.get("kategori")?.toString().trim() || null;
  const foto_url = data?.get("foto_url")?.toString().trim() || null;
  const deskripsi = data?.get("deskripsi")?.toString().trim() || null;

  if (!nama || isNaN(harga) || harga < 0) {
    return { error: "Nama dan harga produk (>= 0) wajib diisi dengan benar." };
  }

  const { error } = await supabase.from("produk").insert([
    {
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    },
  ]);

  if (error) {
    return { error: error.message || "Gagal menambahkan produk ke database." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function ubahProduk(prevState, formData) {
  let data = formData instanceof FormData ? formData : prevState;

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const id = data?.get("id")?.toString();
  const nama = data?.get("nama")?.toString().trim();
  const hargaRaw = data?.get("harga")?.toString().trim();
  const harga = parseInt(hargaRaw || "0", 10);
  const kategori = data?.get("kategori")?.toString().trim() || null;
  const foto_url = data?.get("foto_url")?.toString().trim() || null;
  const deskripsi = data?.get("deskripsi")?.toString().trim() || null;

  if (!id || !nama || isNaN(harga) || harga < 0) {
    return { error: "ID, nama, dan harga produk (>= 0) wajib diisi dengan benar." };
  }

  const { error } = await supabase
    .from("produk")
    .update({
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message || "Gagal mengubah produk di database." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath(`/produk/${id}`);
  redirect("/admin");
}

export async function hapusProduk(formData) {
  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const id = formData.get("id")?.toString();
  if (!id) {
    throw new Error("ID produk tidak valid.");
  }

  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    throw new Error(error.message || "Gagal menghapus produk dari database.");
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin");
}
