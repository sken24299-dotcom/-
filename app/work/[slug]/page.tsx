import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudy } from '@/components/case-study';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';
import { Localized } from '@/components/localized';
import { Navbar } from '@/components/navbar';
import { projects as fallbackProjects } from '@/lib/projects';
import { getAllProjects, getProjectBySlug } from '@/lib/supabase/projects';

type PageProps = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export function generateStaticParams() {
  return fallbackProjects.map((project) => ({ slug: project.slug }));
}
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: `${project.title} | 作品案例`,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: 'article',
      title: project.title,
      description: project.description,
      url: `/work/${project.slug}`,
      images: project.coverImage ? [{ url: project.coverImage, width: 1536, height: 1024, alt: `${project.title} 项目封面` }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

export default async function WorkPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([getProjectBySlug(slug), getAllProjects()]);
  if (!project) notFound();

  const currentIndex = allProjects.findIndex((item) => item.id === project.id);
  const nextProject = allProjects.length > 1 ? allProjects[(currentIndex + 1) % allProjects.length] : undefined;

  return (
    <>
      <a className="skip-link" href="#main-content"><Localized zh="跳到主要内容" en="Skip to main content" /></a>
      <Navbar />
      <CaseStudy project={project} nextProject={nextProject?.id === project.id ? undefined : nextProject} />
      <Contact />
      <Footer />
    </>
  );
}
