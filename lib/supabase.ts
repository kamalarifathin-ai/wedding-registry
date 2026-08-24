import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey && !url.includes("your-project"));

export function createSupabasePublicClient() {
  if (!isSupabaseConfigured) return null;
  return createClient(url!, anonKey!);
}

export function createSupabaseAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey || url.includes("your-project")) return null;
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
}
