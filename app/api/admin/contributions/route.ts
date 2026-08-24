import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminCookieName, isAdmin } from "../../../../lib/admin-auth";
import { createSupabaseAdminClient } from "../../../../lib/supabase";

export async function GET() {
  if (!isAdmin((await cookies()).get(adminCookieName)?.value)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase belum dikonfigurasi" }, { status: 503 });
  const { data, error } = await supabase.from("contributions").select("id, item_id, contributor_name, amount, created_at, wishlist_items(name)").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Gagal mengambil kontribusi" }, { status: 500 });
  return NextResponse.json(data);
}
