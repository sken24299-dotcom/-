import type { Metadata } from 'next';
import { Footer } from '@/components/footer';
import { Localized } from '@/components/localized';
import { Navbar } from '@/components/navbar';
import { Projects } from '@/components/projects';
import { InnerHero } from '@/components/site/inner-hero';
import { getAllProjects } from '@/lib/supabase/projects';
import { getCmsConfig } from '@/lib/supabase/cms';

export async function generateMetadata(): Promise<Metadata> { const cms = await getCmsConfig(); const seo = cms.seo.find((item) => item.pageKey === 'work'); return { title: seo?.title, description: seo?.description, keywords: seo?.keywords, alternates: { canonical: '/work' }, openGraph: seo ? { title: seo.shareTitle || seo.title, description: seo.shareDescription || seo.description, images: seo.ogImage ? [seo.ogImage] : [] } : undefined }; }

export default async function WorkPage() {
  const projects = await getAllProjects();
  return <><Navbar /><main id="main-content" className="overflow-hidden bg-background text-foreground"><InnerHero eyebrow={<Localized zh="精选作品" en="Selected Work" />} title={<Localized zh="作品，记录思考与结果。" en="Work that shows the thinking and the outcome." />} description={<Localized zh="从 AI 产品到品牌与前端，每个案例聚焦一个真实问题和清晰解法。" en="From AI products to brand and frontend, each case focuses on a real problem and a clear response." />} /><Projects projects={projects} archive /></main><Footer /></>;
}
