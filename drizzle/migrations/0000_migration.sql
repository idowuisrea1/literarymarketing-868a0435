create table public.leads (id uuid primary key default gen_random_uuid(), name text not null check (char_length(name) between 1 and 120), email text not null check (char_length(email) between 3 and 255), genre text, service text, details text check (char_length(details) <= 3000), created_at timestamptz not null default now());
create table public.orders (id uuid primary key default gen_random_uuid(), name text not null check (char_length(name) between 1 and 120), email text not null check (char_length(email) between 3 and 255), package text not null check (char_length(package) <= 100), book_title text check (char_length(book_title) <= 200), genre text check (char_length(genre) <= 100), message text check (char_length(message) <= 3000), created_at timestamptz not null default now());
create table public.newsletter_subscribers (id uuid primary key default gen_random_uuid(), email text not null unique check (char_length(email) between 3 and 255), created_at timestamptz not null default now());
grant insert on public.leads, public.orders, public.newsletter_subscribers to anon, authenticated;
grant all on public.leads, public.orders, public.newsletter_subscribers to service_role;
alter table public.leads enable row level security;
alter table public.orders enable row level security;
alter table public.newsletter_subscribers enable row level security;
create policy "anyone can submit lead" on public.leads for insert to anon, authenticated with check (true);
create policy "anyone can order" on public.orders for insert to anon, authenticated with check (true);
create policy "anyone can subscribe" on public.newsletter_subscribers for insert to anon, authenticated with check (true);
create or replace function public.rate_limit_by_email() returns trigger language plpgsql security definer set search_path = public as $$
declare c int;
begin
  execute format('select count(*) from public.%I where email = $1 and created_at > now() - interval ''10 minutes''', TG_TABLE_NAME) into c using NEW.email;
  if c >= 3 then raise exception 'Too many submissions, please try again later'; end if;
  return NEW;
end $$;
create trigger rl_leads before insert on public.leads for each row execute function public.rate_limit_by_email();
create trigger rl_orders before insert on public.orders for each row execute function public.rate_limit_by_email();