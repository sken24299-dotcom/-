create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) <= 160),
  phone text check (phone is null or char_length(phone) <= 40),
  service text not null check (char_length(service) <= 80),
  budget text not null check (char_length(budget) <= 80),
  description text not null check (char_length(description) between 20 and 2000),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists contact_inquiries_created_at_idx on public.contact_inquiries (created_at desc);
alter table public.contact_inquiries enable row level security;

drop policy if exists "Visitors can create inquiries" on public.contact_inquiries;
create policy "Visitors can create inquiries"
on public.contact_inquiries for insert
to anon, authenticated
with check (status = 'new');

drop policy if exists "Admins can read inquiries" on public.contact_inquiries;
create policy "Admins can read inquiries"
on public.contact_inquiries for select
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins can update inquiries" on public.contact_inquiries;
create policy "Admins can update inquiries"
on public.contact_inquiries for update
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins can delete inquiries" on public.contact_inquiries;
create policy "Admins can delete inquiries"
on public.contact_inquiries for delete
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()));
