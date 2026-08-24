do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'contact_inquiries_email_format_check'
      and conrelid = 'public.contact_inquiries'::regclass
  ) then
    alter table public.contact_inquiries
      add constraint contact_inquiries_email_format_check
      check (
        char_length(trim(email)) between 3 and 160
        and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
      ) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'contact_inquiries_service_allowed_check'
      and conrelid = 'public.contact_inquiries'::regclass
  ) then
    alter table public.contact_inquiries
      add constraint contact_inquiries_service_allowed_check
      check (service in (
        'AI 产品设计',
        '前端界面开发',
        '电商视觉设计',
        '品牌视觉系统',
        '作品集网站',
        '其他合作'
      )) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'contact_inquiries_budget_allowed_check'
      and conrelid = 'public.contact_inquiries'::regclass
  ) then
    alter table public.contact_inquiries
      add constraint contact_inquiries_budget_allowed_check
      check (budget in (
        '¥5,000 — ¥15,000',
        '¥15,000 — ¥30,000',
        '¥30,000 — ¥60,000',
        '¥60,000+',
        '先讨论范围'
      )) not valid;
  end if;
end
$$;

-- Contact submissions now pass through the Vercel route handler, where request
-- size, validation, honeypot and rate-limit checks run before the service-role
-- client writes. Removing direct anon inserts prevents bypassing those checks.
drop policy if exists "Visitors can create inquiries" on public.contact_inquiries;
revoke insert on table public.contact_inquiries from anon, authenticated;
grant insert on table public.contact_inquiries to service_role;
