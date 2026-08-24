-- Portfolio CMS: roles, page content, media, navigation, settings and themes.
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text not null default '',
  avatar_url text,
  role text not null default 'user' check (role in ('admin', 'editor', 'user')),
  status text not null default 'active' check (status in ('active', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.profiles (id, role, status)
select user_id, 'admin', 'active' from public.admin_users
on conflict (id) do update set role = 'admin', status = 'active';

create table if not exists public.page_contents (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  section_key text not null,
  content jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  sort_order integer not null default 0,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_key, section_key)
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  path text not null unique,
  mime_type text not null,
  size bigint not null check (size > 0 and size <= 52428800),
  category text not null default 'general',
  alt_text text not null default '',
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.navigation_items (
  id text primary key,
  label_zh text not null,
  label_en text not null,
  href text not null,
  sort_order integer not null default 0,
  visible boolean not null default true,
  new_window boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id text primary key default 'default' check (id = 'default'),
  site_name text not null,
  logo_url text not null,
  favicon_url text not null,
  description text not null,
  email text not null,
  phone text,
  wechat text,
  whatsapp text,
  telegram text,
  github text,
  linkedin text,
  twitter text,
  location text,
  copyright text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.seo_settings (
  page_key text primary key,
  title text not null,
  description text not null,
  keywords text[] not null default '{}',
  og_image text,
  share_title text,
  share_description text,
  updated_at timestamptz not null default now()
);

create table if not exists public.theme_settings (
  id text primary key default 'default' check (id = 'default'),
  primary_color text not null default '#8750F7',
  secondary_color text not null default '#2563EB',
  light_background text not null default '#F8FAFC',
  light_foreground text not null default '#09090B',
  dark_background text not null default '#05010A',
  dark_foreground text not null default '#FFFFFF',
  base_font_size integer not null default 15 check (base_font_size between 13 and 18),
  radius integer not null default 14 check (radius between 6 and 24),
  container_width integer not null default 1120 check (container_width between 960 and 1280),
  shadow text not null default 'soft' check (shadow in ('none', 'soft', 'medium')),
  updated_at timestamptz not null default now()
);

create table if not exists public.language_contents (
  id uuid primary key default gen_random_uuid(),
  namespace text not null,
  content_key text not null,
  value_zh text not null default '',
  value_en text not null default '',
  updated_at timestamptz not null default now(),
  unique (namespace, content_key)
);

alter table public.projects add column if not exists published boolean not null default true;

create or replace function public.current_cms_role()
returns text language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() and status = 'active' limit 1 $$;

create or replace function public.can_edit_cms()
returns boolean language sql stable security definer set search_path = public
as $$ select coalesce(public.current_cms_role() in ('admin', 'editor'), false) $$;

create or replace function public.is_cms_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select coalesce(public.current_cms_role() = 'admin', false) $$;

grant execute on function public.current_cms_role() to authenticated;
grant execute on function public.can_edit_cms() to authenticated;
grant execute on function public.is_cms_admin() to authenticated;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists page_contents_set_updated_at on public.page_contents;
create trigger page_contents_set_updated_at before update on public.page_contents for each row execute function public.set_updated_at();
drop trigger if exists navigation_items_set_updated_at on public.navigation_items;
create trigger navigation_items_set_updated_at before update on public.navigation_items for each row execute function public.set_updated_at();
drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings for each row execute function public.set_updated_at();
drop trigger if exists seo_settings_set_updated_at on public.seo_settings;
create trigger seo_settings_set_updated_at before update on public.seo_settings for each row execute function public.set_updated_at();
drop trigger if exists theme_settings_set_updated_at on public.theme_settings;
create trigger theme_settings_set_updated_at before update on public.theme_settings for each row execute function public.set_updated_at();
drop trigger if exists language_contents_set_updated_at on public.language_contents;
create trigger language_contents_set_updated_at before update on public.language_contents for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.page_contents enable row level security;
alter table public.media_assets enable row level security;
alter table public.navigation_items enable row level security;
alter table public.site_settings enable row level security;
alter table public.seo_settings enable row level security;
alter table public.theme_settings enable row level security;
alter table public.language_contents enable row level security;

create policy "Profiles readable by self or admin" on public.profiles for select to authenticated using (id = auth.uid() or public.is_cms_admin());
create policy "Admins manage profiles" on public.profiles for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());

create policy "Published content is public" on public.page_contents for select to anon, authenticated using (published or public.can_edit_cms());
create policy "Editors manage content" on public.page_contents for all to authenticated using (public.can_edit_cms()) with check (public.can_edit_cms());
create policy "Media is public" on public.media_assets for select to anon, authenticated using (true);
create policy "Editors manage media" on public.media_assets for all to authenticated using (public.can_edit_cms()) with check (public.can_edit_cms());
create policy "Navigation is public" on public.navigation_items for select to anon, authenticated using (visible or public.can_edit_cms());
create policy "Editors manage navigation" on public.navigation_items for all to authenticated using (public.can_edit_cms()) with check (public.can_edit_cms());
create policy "Site settings are public" on public.site_settings for select to anon, authenticated using (true);
create policy "Editors manage site settings" on public.site_settings for all to authenticated using (public.can_edit_cms()) with check (public.can_edit_cms());
create policy "SEO settings are public" on public.seo_settings for select to anon, authenticated using (true);
create policy "Editors manage SEO" on public.seo_settings for all to authenticated using (public.can_edit_cms()) with check (public.can_edit_cms());
create policy "Theme settings are public" on public.theme_settings for select to anon, authenticated using (true);
create policy "Admins manage theme" on public.theme_settings for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "Languages are public" on public.language_contents for select to anon, authenticated using (true);
create policy "Editors manage languages" on public.language_contents for all to authenticated using (public.can_edit_cms()) with check (public.can_edit_cms());

drop policy if exists "Projects are publicly readable" on public.projects;
create policy "Published projects are publicly readable" on public.projects for select to anon, authenticated using (published or public.can_edit_cms());
drop policy if exists "Admins can insert projects" on public.projects;
drop policy if exists "Admins can update projects" on public.projects;
drop policy if exists "Admins can delete projects" on public.projects;
create policy "Editors insert projects" on public.projects for insert to authenticated with check (public.can_edit_cms());
create policy "Editors update projects" on public.projects for update to authenticated using (public.can_edit_cms()) with check (public.can_edit_cms());
create policy "Editors delete projects" on public.projects for delete to authenticated using (public.can_edit_cms());

update storage.buckets set file_size_limit = 52428800,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif','image/svg+xml','video/mp4']
where id = 'project-assets';

drop policy if exists "Admins can upload project assets" on storage.objects;
create policy "Editors can upload project assets" on storage.objects for insert to authenticated
with check (bucket_id = 'project-assets' and public.can_edit_cms());
drop policy if exists "Admins can update project assets" on storage.objects;
create policy "Editors can update project assets" on storage.objects for update to authenticated
using (bucket_id = 'project-assets' and public.can_edit_cms());
drop policy if exists "Admins can delete project assets" on storage.objects;
create policy "Editors can delete project assets" on storage.objects for delete to authenticated
using (bucket_id = 'project-assets' and public.can_edit_cms());

insert into public.site_settings (id,site_name,logo_url,favicon_url,description,email,wechat,github,linkedin,location,copyright)
values ('default','ZhiLink AI','/images/zhilink-ai-logo.png','/favicon.svg','AI 产品设计、前端开发与数字品牌体验。','hello@yuwang.design','YuWangDesign','https://github.com/yuwang','https://www.linkedin.com/in/yuwang','Singapore · Remote','© 2026 Yu Wang. All rights reserved.')
on conflict (id) do nothing;

insert into public.theme_settings (id) values ('default') on conflict (id) do nothing;

insert into public.navigation_items (id,label_zh,label_en,href,sort_order) values
('top','首页','Home','/#top',10),('services','服务','Services','/#services',20),('work','作品','Works','/#work',30),('experience','履历','Resume','/#experience',40),('skills','技能','Skills','/#skills',50),('testimonials','评价','Testimonials','/#testimonials',60),('contact','联系','Contact','/#contact',70)
on conflict (id) do nothing;
