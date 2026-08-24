'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin, requireEditor } from '@/lib/supabase/admin';
import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';

const text = (max = 500) => z.string().trim().max(max);
const requiredText = (max = 500) => z.string().trim().min(1).max(max);
const color = z.string().regex(/^#[0-9a-f]{6}$/i);
const roleSchema = z.enum(['admin', 'editor', 'user']);

function refreshPublic() {
  ['/', '/about', '/contact', '/work', '/sitemap.xml', '/admin/dashboard'].forEach((path) => revalidatePath(path));
}

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

export async function savePageContentAction(formData: FormData) {
  const session = await requireEditor();
  const schema = z.object({
    heroEyebrowZh: requiredText(100), heroEyebrowEn: requiredText(100), heroTitleZh: requiredText(180), heroTitleEn: requiredText(180), heroSubtitleZh: requiredText(500), heroSubtitleEn: requiredText(500), primaryLabelZh: requiredText(40), primaryLabelEn: requiredText(40), primaryHref: requiredText(300), secondaryLabelZh: requiredText(40), secondaryLabelEn: requiredText(40), secondaryHref: requiredText(300), portrait: requiredText(500), aboutTitleZh: requiredText(180), aboutTitleEn: requiredText(180), aboutDescriptionZh: requiredText(800), aboutDescriptionEn: requiredText(800), servicesTitleZh: requiredText(180), servicesTitleEn: requiredText(180), servicesDescriptionZh: requiredText(500), servicesDescriptionEn: requiredText(500), workTitleZh: requiredText(180), workTitleEn: requiredText(180), workDescriptionZh: requiredText(500), workDescriptionEn: requiredText(500), skillsTitleZh: requiredText(180), skillsTitleEn: requiredText(180), skillsDescriptionZh: requiredText(500), skillsDescriptionEn: requiredText(500), contactEyebrowZh: requiredText(80), contactEyebrowEn: requiredText(80), contactTitleZh: requiredText(180), contactTitleEn: requiredText(180), contactDescriptionZh: requiredText(500), contactDescriptionEn: requiredText(500), footerZh: requiredText(180), footerEn: requiredText(180),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect('/admin/content?status=invalid');
  const d = parsed.data;
  const rows = [
    { section_key: 'hero', content: { eyebrow: { zh: d.heroEyebrowZh, en: d.heroEyebrowEn }, title: { zh: d.heroTitleZh, en: d.heroTitleEn }, subtitle: { zh: d.heroSubtitleZh, en: d.heroSubtitleEn }, primaryLabel: { zh: d.primaryLabelZh, en: d.primaryLabelEn }, primaryHref: d.primaryHref, secondaryLabel: { zh: d.secondaryLabelZh, en: d.secondaryLabelEn }, secondaryHref: d.secondaryHref, portrait: d.portrait } },
    { section_key: 'about', content: { title: { zh: d.aboutTitleZh, en: d.aboutTitleEn }, description: { zh: d.aboutDescriptionZh, en: d.aboutDescriptionEn } } },
    { section_key: 'sectionHeadings', content: { servicesTitle: { zh: d.servicesTitleZh, en: d.servicesTitleEn }, servicesDescription: { zh: d.servicesDescriptionZh, en: d.servicesDescriptionEn }, workTitle: { zh: d.workTitleZh, en: d.workTitleEn }, workDescription: { zh: d.workDescriptionZh, en: d.workDescriptionEn }, skillsTitle: { zh: d.skillsTitleZh, en: d.skillsTitleEn }, skillsDescription: { zh: d.skillsDescriptionZh, en: d.skillsDescriptionEn } } },
    { section_key: 'contact', content: { eyebrow: { zh: d.contactEyebrowZh, en: d.contactEyebrowEn }, title: { zh: d.contactTitleZh, en: d.contactTitleEn }, description: { zh: d.contactDescriptionZh, en: d.contactDescriptionEn } } },
    { section_key: 'footer', content: { zh: d.footerZh, en: d.footerEn } },
  ].map((row, index) => ({ ...row, page_key: 'global', published: true, sort_order: index * 10, updated_by: session.userId }));
  const supabase = await createClient();
  if (!supabase) redirect('/admin/content?status=unconfigured');
  const { error } = await supabase.from('page_contents').upsert(rows, { onConflict: 'page_key,section_key' });
  if (error) redirect('/admin/content?status=error');
  refreshPublic();
  redirect('/admin/content?status=saved');
}

export async function saveSiteSettingsAction(formData: FormData) {
  await requireEditor();
  const schema = z.object({ siteName: requiredText(100), logoUrl: requiredText(500), faviconUrl: requiredText(500), description: requiredText(500), email: z.string().email(), phone: text(80), wechat: text(100), whatsapp: text(100), telegram: text(100), github: text(500), linkedin: text(500), twitter: text(500), location: text(180), copyright: requiredText(180) });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect('/admin/settings?status=invalid');
  const d = parsed.data;
  const supabase = await createClient();
  if (!supabase) redirect('/admin/settings?status=unconfigured');
  const { error } = await supabase.from('site_settings').upsert({ id: 'default', site_name: d.siteName, logo_url: d.logoUrl, favicon_url: d.faviconUrl, description: d.description, email: d.email, phone: d.phone || null, wechat: d.wechat || null, whatsapp: d.whatsapp || null, telegram: d.telegram || null, github: d.github || null, linkedin: d.linkedin || null, twitter: d.twitter || null, location: d.location || null, copyright: d.copyright });
  if (error) redirect('/admin/settings?status=error');
  refreshPublic();
  redirect('/admin/settings?status=saved');
}

export async function saveThemeSettingsAction(formData: FormData) {
  await requireAdmin();
  const schema = z.object({ primary: color, secondary: color, lightBackground: color, lightForeground: color, darkBackground: color, darkForeground: color, baseFontSize: z.coerce.number().int().min(13).max(18), radius: z.coerce.number().int().min(6).max(24), containerWidth: z.coerce.number().int().min(960).max(1280), shadow: z.enum(['none', 'soft', 'medium']) });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect('/admin/theme?status=invalid');
  const d = parsed.data;
  const supabase = await createClient();
  if (!supabase) redirect('/admin/theme?status=unconfigured');
  const { error } = await supabase.from('theme_settings').upsert({ id: 'default', primary_color: d.primary, secondary_color: d.secondary, light_background: d.lightBackground, light_foreground: d.lightForeground, dark_background: d.darkBackground, dark_foreground: d.darkForeground, base_font_size: d.baseFontSize, radius: d.radius, container_width: d.containerWidth, shadow: d.shadow });
  if (error) redirect('/admin/theme?status=error');
  refreshPublic();
  redirect('/admin/theme?status=saved');
}

export async function saveSeoAction(formData: FormData) {
  await requireEditor();
  const schema = z.object({ pageKey: z.enum(['home', 'work', 'about', 'contact']), title: requiredText(180), description: requiredText(500), keywords: text(500), ogImage: text(500), shareTitle: text(180), shareDescription: text(500) });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect('/admin/seo?status=invalid');
  const d = parsed.data;
  const supabase = await createClient();
  if (!supabase) redirect('/admin/seo?status=unconfigured');
  const { error } = await supabase.from('seo_settings').upsert({ page_key: d.pageKey, title: d.title, description: d.description, keywords: d.keywords.split(',').map((item) => item.trim()).filter(Boolean), og_image: d.ogImage || null, share_title: d.shareTitle || null, share_description: d.shareDescription || null });
  if (error) redirect('/admin/seo?status=error');
  refreshPublic();
  redirect('/admin/seo?status=saved');
}

export async function saveNavigationAction(formData: FormData) {
  await requireEditor();
  const schema = z.object({ id: z.string().trim().regex(/^[a-z0-9-]+$/).max(60), labelZh: requiredText(60), labelEn: requiredText(60), href: requiredText(300), sortOrder: z.coerce.number().int().min(-9999).max(9999) });
  const parsed = schema.safeParse({ ...Object.fromEntries(formData), visible: formData.get('visible') === 'on', newWindow: formData.get('newWindow') === 'on' });
  if (!parsed.success) redirect('/admin/navigation?status=invalid');
  const supabase = await createClient();
  if (!supabase) redirect('/admin/navigation?status=unconfigured');
  const { error } = await supabase.from('navigation_items').upsert({ id: parsed.data.id, label_zh: parsed.data.labelZh, label_en: parsed.data.labelEn, href: parsed.data.href, sort_order: parsed.data.sortOrder, visible: formData.get('visible') === 'on', new_window: formData.get('newWindow') === 'on' });
  if (error) redirect('/admin/navigation?status=error');
  refreshPublic();
  redirect('/admin/navigation?status=saved');
}

export async function deleteNavigationAction(formData: FormData) {
  await requireEditor();
  const id = value(formData, 'id');
  const supabase = await createClient();
  if (!supabase || !id) redirect('/admin/navigation?status=error');
  await supabase.from('navigation_items').delete().eq('id', id);
  refreshPublic();
  redirect('/admin/navigation?status=deleted');
}

export async function createUserAction(formData: FormData) {
  await requireAdmin();
  const schema = z.object({ email: z.string().email(), password: z.string().min(8).max(72), displayName: requiredText(100), avatarUrl: text(500), role: roleSchema });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect('/admin/users?status=invalid');
  const service = createServiceClient();
  if (!service) redirect('/admin/users?status=service-key');
  const { data, error } = await service.auth.admin.createUser({ email: parsed.data.email, password: parsed.data.password, email_confirm: true, user_metadata: { display_name: parsed.data.displayName } });
  if (error || !data.user) redirect('/admin/users?status=error');
  await service.from('profiles').upsert({ id: data.user.id, email: parsed.data.email, display_name: parsed.data.displayName, avatar_url: parsed.data.avatarUrl || null, role: parsed.data.role, status: 'active' });
  redirect('/admin/users?status=created');
}

export async function updateUserAction(formData: FormData) {
  const session = await requireAdmin();
  const schema = z.object({ id: z.string().uuid(), displayName: requiredText(100), avatarUrl: text(500), role: roleSchema, status: z.enum(['active', 'disabled']) });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success || (parsed.data.id === session.userId && (parsed.data.role !== 'admin' || parsed.data.status !== 'active'))) redirect('/admin/users?status=invalid');
  const service = createServiceClient();
  if (!service) redirect('/admin/users?status=service-key');
  const { error } = await service.from('profiles').update({ display_name: parsed.data.displayName, avatar_url: parsed.data.avatarUrl || null, role: parsed.data.role, status: parsed.data.status }).eq('id', parsed.data.id);
  if (error) redirect('/admin/users?status=error');
  redirect('/admin/users?status=updated');
}

export async function deleteUserAction(formData: FormData) {
  const session = await requireAdmin();
  const id = value(formData, 'id');
  if (!id || id === session.userId) redirect('/admin/users?status=invalid');
  const service = createServiceClient();
  if (!service) redirect('/admin/users?status=service-key');
  const { error } = await service.auth.admin.deleteUser(id);
  if (error) redirect('/admin/users?status=error');
  redirect('/admin/users?status=deleted');
}
