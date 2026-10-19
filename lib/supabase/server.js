import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_SECRET_KEY belum diatur di environment variable."
    );
  }

  // Normalisasi URL jika menyertakan path /rest/v1 atau garis miring di akhir
  const cleanUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

  return createSupabaseClient(cleanUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const createServerClient = createClient;
export { createSessionClient } from "./session";
