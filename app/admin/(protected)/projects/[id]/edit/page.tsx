import { notFound } from 'next/navigation';
import { ProjectForm } from '@/components/admin/project-form';
import { getAdminProjectById } from '@/lib/supabase/projects';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getAdminProjectById(id);
  if (!project) notFound();
  return <ProjectForm project={project} />;
}

