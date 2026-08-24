import { cache } from 'react';
import { defaultCmsConfig } from '@/lib/cms-defaults';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import type { CmsConfig, CmsProfile, MediaAsset, NavigationItem, SeoSetting } from '@/types/cms';

function mergeObject<T extends object>(fallback: T, value: unknown): T {
  return value && typeof value === 'object' && !Array.isArray(value) ? { ...fallback, ...value as Partial<T> } : fallback;
}

export const getCmsConfig = cache(async (): Promise<CmsConfig> => {
  const supabase = await createClient();
  if (!supabase) return defaultCmsConfig;

  const [contentResult, navResult, siteResult, seoResult, themeResult] = await Promise.all([
    supabase.from('page_contents').select('section_key,content').eq('page_key', 'global').eq('published', true),
    supabase.from('navigation_items').select('*').eq('visible', true).order('sort_order'),
    supabase.from('site_settings').select('*').eq('id', 'default').maybeSingle(),
    supabase.from('seo_settings').select('*').order('page_key'),
    supabase.from('theme_settings').select('*').eq('id', 'default').maybeSingle(),
  ]);

  const sections = new Map((contentResult.data ?? []).map((row) => [row.section_key, row.content]));
  const nav: NavigationItem[] = (navResult.data ?? []).map((row) => ({ id: row.id, labelZh: row.label_zh, labelEn: row.label_en, href: row.href, sortOrder: row.sort_order, visible: row.visible, newWindow: row.new_window }));
  const seo: SeoSetting[] = (seoResult.data ?? []).map((row) => ({ pageKey: row.page_key, title: row.title, description: row.description, keywords: row.keywords ?? [], ogImage: row.og_image ?? '', shareTitle: row.share_title ?? '', shareDescription: row.share_description ?? '' }));
  const siteRow = siteResult.data;
  const themeRow = themeResult.data;

  return {
    hero: mergeObject(defaultCmsConfig.hero, sections.get('hero')),
    about: mergeObject(defaultCmsConfig.about, sections.get('about')),
    sectionHeadings: mergeObject(defaultCmsConfig.sectionHeadings, sections.get('sectionHeadings')),
    contact: mergeObject(defaultCmsConfig.contact, sections.get('contact')),
    footer: mergeObject(defaultCmsConfig.footer, sections.get('footer')),
    navigation: nav.length ? nav : defaultCmsConfig.navigation,
    seo: seo.length ? seo : defaultCmsConfig.seo,
    site: siteRow ? {
      siteName: siteRow.site_name, logoUrl: siteRow.logo_url, faviconUrl: siteRow.favicon_url, description: siteRow.description, email: siteRow.email, phone: siteRow.phone ?? '', wechat: siteRow.wechat ?? '', whatsapp: siteRow.whatsapp ?? '', telegram: siteRow.telegram ?? '', github: siteRow.github ?? '', linkedin: siteRow.linkedin ?? '', twitter: siteRow.twitter ?? '', location: siteRow.location ?? '', copyright: siteRow.copyright,
    } : defaultCmsConfig.site,
    theme: themeRow ? {
      primary: themeRow.primary_color, secondary: themeRow.secondary_color, lightBackground: themeRow.light_background, lightForeground: themeRow.light_foreground, darkBackground: themeRow.dark_background, darkForeground: themeRow.dark_foreground, baseFontSize: themeRow.base_font_size, radius: themeRow.radius, containerWidth: themeRow.container_width, shadow: themeRow.shadow,
    } : defaultCmsConfig.theme,
  };
});

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []).map((row) => ({ id: row.id, name: row.name, url: row.url, path: row.path, mimeType: row.mime_type, size: row.size, category: row.category, altText: row.alt_text ?? '', createdAt: row.created_at }));
}

export async function getProfiles(): Promise<CmsProfile[]> {
  const service = createServiceClient();
  if (!service) return [];
  const [{ data: profiles }, { data: authData }] = await Promise.all([
    service.from('profiles').select('*').order('created_at', { ascending: false }),
    service.auth.admin.listUsers({ page: 1, perPage: 100 }),
  ]);
  const authMap = new Map((authData?.users ?? []).map((user) => [user.id, user]));
  return (profiles ?? []).map((row) => {
    const auth = authMap.get(row.id);
    return { id: row.id, email: auth?.email ?? row.email ?? '', displayName: row.display_name ?? '', avatarUrl: row.avatar_url ?? undefined, role: row.role, status: row.status, createdAt: row.created_at, lastSignInAt: auth?.last_sign_in_at ?? undefined };
  });
}
