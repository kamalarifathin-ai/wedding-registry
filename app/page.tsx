import Registry from "./registry";
import { demoItems } from "../lib/demo-data";
import { createSupabasePublicClient } from "../lib/supabase";
import { WishlistItem } from "../lib/types";

export default async function Page() {
  let items: WishlistItem[] = demoItems;
  const supabase = createSupabasePublicClient();
  if (supabase) {
    const { data } = await supabase.from("item_progress").select("*").order("created_at");
    if (data) items = data as WishlistItem[];
  }
  return <Registry initialItems={items} demoMode={!supabase} />;
}
