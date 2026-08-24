create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  title_en text check (title_en is null or char_length(title_en) <= 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category text not null,
  description text not null check (char_length(description) between 1 and 1000),
  description_en text check (description_en is null or char_length(description_en) <= 1200),
  cover_image text not null,
  images text[] not null default '{}',
  tags text[] not null default '{}',
  project_url text,
  github_url text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_featured_sort_idx on public.projects (featured, sort_order, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;

drop policy if exists "Admins can read own membership" on public.admin_users;
create policy "Admins can read own membership"
on public.admin_users for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Projects are publicly readable" on public.projects;
create policy "Projects are publicly readable"
on public.projects for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert projects" on public.projects;
create policy "Admins can insert projects"
on public.projects for insert
to authenticated
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins can update projects" on public.projects;
create policy "Admins can update projects"
on public.projects for update
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins can delete projects" on public.projects;
create policy "Admins can delete projects"
on public.projects for delete
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-assets',
  'project-assets',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Project assets are publicly readable" on storage.objects;
create policy "Project assets are publicly readable"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'project-assets');

drop policy if exists "Admins can upload project assets" on storage.objects;
create policy "Admins can upload project assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'project-assets'
  and exists (select 1 from public.admin_users where user_id = auth.uid())
);

drop policy if exists "Admins can update project assets" on storage.objects;
create policy "Admins can update project assets"
on storage.objects for update
to authenticated
using (
  bucket_id = 'project-assets'
  and exists (select 1 from public.admin_users where user_id = auth.uid())
);

drop policy if exists "Admins can delete project assets" on storage.objects;
create policy "Admins can delete project assets"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'project-assets'
  and exists (select 1 from public.admin_users where user_id = auth.uid())
);

