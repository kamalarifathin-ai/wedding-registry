-- Jalankan seluruh file ini di Supabase SQL Editor sebelum memakai mode production.
create table if not exists public.wishlist_items (
  id text primary key,
  name text not null,
  description text,
  target_price numeric not null check (target_price > 0),
  photo_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.contributions (
  id bigint generated always as identity primary key,
  item_id text not null references public.wishlist_items(id) on delete restrict,
  contributor_name text not null check (char_length(trim(contributor_name)) > 0),
  amount numeric not null check (amount > 0),
  created_at timestamptz not null default now()
);

-- View ini sengaja memakai perilaku security-definer bawaan Postgres:
-- publik hanya mendapat hasil agregat dari view, bukan akses select ke contributions.
create or replace view public.item_progress as
select w.id, w.name, w.description, w.target_price, w.photo_url, w.created_at,
  coalesce(sum(c.amount), 0) as current_total,
  round(coalesce(sum(c.amount), 0) / w.target_price * 100, 1) as progress_percent
from public.wishlist_items w left join public.contributions c on c.item_id = w.id
group by w.id, w.name, w.description, w.target_price, w.photo_url, w.created_at;

alter table public.wishlist_items enable row level security;
alter table public.contributions enable row level security;
grant select on public.item_progress to anon, authenticated;
create policy "Public reads items" on public.wishlist_items for select using (true);
create policy "Public submits contributions" on public.contributions for insert with check (true);
