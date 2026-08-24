import { cache } from 'react';
import { getFallbackProject, projects as fallbackProjects } from '@/lib/projects';
import { createClient } from '@/lib/supabase/server';
import type { Project, ProjectRow } from '@/types/project';

function mapRow(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    titleEn: row.title_en ?? undefined,
    slug: row.slug,
    category: row.category,
    description: row.description,
    descriptionEn: row.description_en ?? undefined,
    coverImage: row.cover_image,
    images: row.images ?? [],
    tags: row.tags ?? [],
    projectUrl: row.project_url ?? undefined,
    githubUrl: row.github_url ?? undefined,
    featured: row.featured,
    published: row.published ?? true,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    year: new Date(row.created_at).getFullYear().toString(),
  };
}

type ProjectQueryResult =
  | { configured: false; rows: null }
  | { configured: true; rows: Project[] | null };

const sortedFallbackProjects = [...fallbackProjects].sort((a, b) => a.sortOrder - b.sortOrder);

async function fetchRows(): Promise<ProjectQueryResult> {
  const supabase = await createClient();
  if (!supabase) return { configured: false, rows: null };

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Unable to load projects from Supabase:', error.message);
    return { configured: true, rows: null };
  }
  return { configured: true, rows: (data as ProjectRow[]).map(mapRow) };
}

async function projectTableIsEmpty() {
  const supabase = await createClient();
  if (!supabase) return true;

  const { count, error } = await supabase
    .from('projects')
    .select('id', { count: 'exact', head: true });
  if (error) {
    console.error('Unable to inspect the projects table:', error.message);
    return false;
  }
  return count === 0;
}

export const getFeaturedProjects = cache(async () => {
  const result = await fetchRows();
  if (!result.configured || result.rows?.length === 0) {
    return sortedFallbackProjects.filter((project) => project.featured);
  }
  if (!result.rows) return [];
  return result.rows.filter((project) => project.featured && project.published !== false);
});

export const getAllProjects = cache(async () => {
  const result = await fetchRows();
  if (!result.configured || result.rows?.length === 0) return sortedFallbackProjects;
  return (result.rows ?? []).filter((project) => project.published !== false);
});

export const getProjectBySlug = cache(async (slug: string) => {
  const supabase = await createClient();
  if (!supabase) return getFallbackProject(slug);

  const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
  if (error) {
    console.error('Unable to load project from Supabase:', error.message);
    return undefined;
  }
  if (data) { const project = mapRow(data as ProjectRow); return project.published === false ? undefined : project; }
  return await projectTableIsEmpty() ? getFallbackProject(slug) : undefined;
});

export const getProjectById = cache(async (id: string) => {
  const supabase = await createClient();
  if (!supabase) return fallbackProjects.find((project) => project.id === id);

  const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
  if (error) {
    console.error('Unable to load project from Supabase:', error.message);
    return undefined;
  }
  if (data) return mapRow(data as ProjectRow);
  return await projectTableIsEmpty() ? fallbackProjects.find((project) => project.id === id) : undefined;
});

export async function getAdminProjects() {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as ProjectRow[]).map(mapRow);
}

export async function getAdminProjectById(id: string) {
  const supabase = await createClient();
  if (!supabase) return undefined;
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
  if (error) {
    console.error('Unable to load an admin project:', error.message);
    return undefined;
  }
  if (!data) return undefined;
  return mapRow(data as ProjectRow);
}
