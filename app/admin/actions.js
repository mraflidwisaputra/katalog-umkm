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

