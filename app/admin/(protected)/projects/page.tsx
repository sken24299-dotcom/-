import { ProjectTable } from '@/components/admin/project-table';
import { getAdminProjects } from '@/lib/supabase/projects';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const [projects, params] = await Promise.all([getAdminProjects(), searchParams]);
  return <ProjectTable projects={projects} notice={params.status} />;
}

