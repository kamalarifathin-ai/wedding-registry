-- Jalankan hanya bila tabel wishlist_items sudah dibuat sebelumnya.
alter table public.wishlist_items add column if not exists description text;

create or replace view public.item_progress as
select w.id, w.name, w.description, w.target_price, w.photo_url, w.created_at,
  coalesce(sum(c.amount), 0) as current_total,
  round(coalesce(sum(c.amount), 0) / w.target_price * 100, 1) as progress_percent
from public.wishlist_items w left join public.contributions c on c.item_id = w.id
group by w.id, w.name, w.description, w.target_price, w.photo_url, w.created_at;
