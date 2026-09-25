import Registry from "./registry";
import { demoItems } from "../lib/demo-data";
import { createSupabasePublicClient } from "../lib/supabase";
import { WishlistItem } from "../lib/types";

// Progress kontribusi harus selalu diambil ulang dari Supabase, bukan dari
// snapshot halaman saat build/deploy.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  let items: WishlistItem[] = demoItems;
  const supabase = createSupabasePublicClient();
  if (supabase) {
    const { data } = await supabase.from("item_progress").select("*").order("created_at");
    if (data) items = data as WishlistItem[];
  }
  return <Registry initialItems={items} demoMode={!supabase} />;
}
