import { NextResponse } from "next/server";
import { createSupabasePublicClient } from "../../../lib/supabase";
import { ContributionInput } from "../../../lib/types";

export async function POST(request: Request) {
  const body = await request.json() as ContributionInput;
  if (!body.item_id || !body.contributor_name?.trim() || !Number.isFinite(Number(body.amount)) || Number(body.amount) <= 0) return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  const supabase = createSupabasePublicClient();
  if (!supabase) return NextResponse.json({ ok: true, demo: true });
  const { error } = await supabase.from("contributions").insert({ item_id: body.item_id, contributor_name: body.contributor_name.trim(), amount: Number(body.amount) });
  if (error) return NextResponse.json({ error: "Tidak dapat menyimpan kontribusi" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
