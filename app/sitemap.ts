import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';
import { getAllProjects } from '@/lib/supabase/projects';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects();
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/work/${project.slug}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...['work', 'about', 'contact'].map((path) => ({
      url: `${siteUrl}/${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: path === 'work' ? 0.9 : 0.75,
    })),
    ...projectPages,
  ];
}
