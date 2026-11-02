create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  slug text not null unique,
  brand text not null,
  category text not null check (category in ('beans', 'gear', 'cups')),
  price numeric(10, 2) not null check (price >= 0),
  compare_at_price numeric(10, 2),
  description text not null default '',
  color text not null default '',
  sizes text[] not null default '{250 g,1 kg}',
  images text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  is_featured boolean not null default false,
  roast integer not null default 0 check (roast between 0 and 5)
);

create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  size text not null default '250 g',
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (user_id, product_id, size)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total numeric(10, 2) not null,
  full_name text not null,
  address text not null,
  city text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  size text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null
);

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_featured_idx on public.products (is_featured);
create index if not exists cart_items_user_idx on public.cart_items (user_id);
create index if not exists wishlist_user_idx on public.wishlist (user_id);
create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists order_items_order_idx on public.order_items (order_id);

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

grant execute on function public.is_admin() to anon, authenticated;

alter table public.products enable row level security;
alter table public.wishlist enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admins enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "products_read" on public.products;
drop policy if exists "products_admin_insert" on public.products;
drop policy if exists "products_admin_update" on public.products;
drop policy if exists "products_admin_delete" on public.products;
create policy "products_read" on public.products for select using (true);
create policy "products_admin_insert" on public.products for insert to authenticated with check (public.is_admin());
create policy "products_admin_update" on public.products for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "products_admin_delete" on public.products for delete to authenticated using (public.is_admin());

drop policy if exists "wishlist_own" on public.wishlist;
create policy "wishlist_own" on public.wishlist for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "cart_own" on public.cart_items;
create policy "cart_own" on public.cart_items for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "orders_select" on public.orders;
drop policy if exists "orders_insert" on public.orders;
drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_select" on public.orders for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
create policy "orders_insert" on public.orders for insert to authenticated
  with check (user_id = auth.uid());
create policy "orders_admin_update" on public.orders for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "order_items_select" on public.order_items;
drop policy if exists "order_items_insert" on public.order_items;
create policy "order_items_select" on public.order_items for select to authenticated
  using (
    public.is_admin()
    or exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
create policy "order_items_insert" on public.order_items for insert to authenticated
  with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

drop policy if exists "admins_self_read" on public.admins;
create policy "admins_self_read" on public.admins for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "settings_read" on public.site_settings;
drop policy if exists "settings_admin_insert" on public.site_settings;
drop policy if exists "settings_admin_update" on public.site_settings;
create policy "settings_read" on public.site_settings for select using (true);
create policy "settings_admin_insert" on public.site_settings for insert to authenticated with check (public.is_admin());
create policy "settings_admin_update" on public.site_settings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do update set public = true;

drop policy if exists "images_public_read" on storage.objects;
drop policy if exists "images_admin_insert" on storage.objects;
drop policy if exists "images_admin_update" on storage.objects;
drop policy if exists "images_admin_delete" on storage.objects;
create policy "images_public_read" on storage.objects for select using (bucket_id = 'images');
create policy "images_admin_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'images' and public.is_admin());
create policy "images_admin_update" on storage.objects for update to authenticated
  using (bucket_id = 'images' and public.is_admin());
create policy "images_admin_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'images' and public.is_admin());
