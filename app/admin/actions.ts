'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAdminSession, requireEditor } from '@/lib/supabase/admin';
import { isSupabaseConfigured, supabaseConfigurationError } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';
import { parseProjectFormData, type ProjectFormValues } from '@/lib/validation/project';
import type { ProjectActionState } from '@/types/project';

export async function loginAction(_previousState: ProjectActionState, formData: FormData): Promise<ProjectActionState> {
  if (!isSupabaseConfigured) {
    return { status: 'error', message: `${supabaseConfigurationError ?? 'Supabase 尚未配置。'} 请检查 .env.local 并执行数据库迁移。` };
  }

  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { status: 'error', message: '请输入邮箱和密码。' };

  const supabase = await createClient();
  if (!supabase) return { status: 'error', message: 'Supabase 连接不可用。' };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { status: 'error', message: '登录失败，请检查邮箱、密码或账号状态。' };

  const admin = await getAdminSession();
  if (admin.error === 'membership_lookup_failed') {
    await supabase.auth.signOut();
    return { status: 'error', message: '无法读取管理员权限，请确认数据库迁移与 RLS 策略已正确执行。' };
  }
  if (!(admin.isAdmin || admin.role === 'editor') || admin.status === 'disabled') {
    await supabase.auth.signOut();
    return { status: 'error', message: '该账号没有管理员权限。' };
  }

  redirect('/admin/dashboard');
}

export async function logoutAction() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect('/admin/login');
}

function projectPayload(values: ProjectFormValues) {
  return {
    title: values.title,
    title_en: values.titleEn || null,
    slug: values.slug,
    category: values.category,
    description: values.description,
    description_en: values.descriptionEn || null,
    cover_image: values.coverImage,
    images: values.images,
    tags: values.tags,
    project_url: values.projectUrl || null,
    github_url: values.githubUrl || null,
    featured: values.featured,
    published: values.published,
    sort_order: values.sortOrder,
  };
}

function revalidateProjectPaths(...slugs: Array<string | undefined>) {
  revalidatePath('/');
  revalidatePath('/work');
  revalidatePath('/sitemap.xml');
  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/projects');
  for (const slug of new Set(slugs.filter((value): value is string => Boolean(value)))) {
    revalidatePath(`/work/${slug}`);
  }
}

export async function createProjectAction(_previousState: ProjectActionState, formData: FormData): Promise<ProjectActionState> {
  await requireEditor();
  const parsed = parseProjectFormData(formData);
  if (!parsed.success) {
    return { status: 'error', message: '请检查表单中的错误。', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  if (!supabase) return { status: 'error', message: 'Supabase 连接不可用。' };
  const { data: created, error } = await supabase
    .from('projects')
    .insert(projectPayload(parsed.data))
    .select('id')
    .maybeSingle();

  if (error || !created) {
    const message = error?.code === '23505' ? 'Slug 已被使用，请更换后重试。' : '新增作品失败，请稍后重试。';
    return { status: 'error', message };
  }

  revalidateProjectPaths(parsed.data.slug);
  redirect('/admin/projects?status=created');
}

export async function updateProjectAction(id: string, _previousState: ProjectActionState, formData: FormData): Promise<ProjectActionState> {
  await requireEditor();
  const parsed = parseProjectFormData(formData);
  if (!parsed.success) {
    return { status: 'error', message: '请检查表单中的错误。', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  if (!supabase) return { status: 'error', message: 'Supabase 连接不可用。' };

  const { data: current, error: currentError } = await supabase
    .from('projects')
    .select('slug')
    .eq('id', id)
    .maybeSingle();
  if (currentError) return { status: 'error', message: '读取原作品失败，请稍后重试。' };
  if (!current) return { status: 'error', message: '该作品已不存在，请返回列表刷新后重试。' };

  const { data: updated, error } = await supabase
    .from('projects')
    .update(projectPayload(parsed.data))
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error || !updated) {
    const message = error?.code === '23505' ? 'Slug 已被使用，请更换后重试。' : '保存作品失败，请稍后重试。';
    return { status: 'error', message };
  }

  revalidateProjectPaths(current.slug, parsed.data.slug);
  redirect('/admin/projects?status=updated');
}

export async function deleteProjectAction(id: string) {
  await requireEditor();
  const supabase = await createClient();
  if (!supabase) redirect('/admin/projects?status=error');

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('slug')
    .eq('id', id)
    .maybeSingle();
  if (projectError || !project) redirect('/admin/projects?status=error');

  const { data: deleted, error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error || !deleted) redirect('/admin/projects?status=error');

  // Storage objects are intentionally retained. A visual can be shared by more
  // than one case study; deleting it here could break another published page.
  revalidateProjectPaths(project.slug);
  redirect('/admin/projects?status=deleted');
}
