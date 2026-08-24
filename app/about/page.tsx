import type { Metadata } from 'next';
import { About } from '@/components/about';
import { Footer } from '@/components/footer';
import { Localized } from '@/components/localized';
import { Manifesto } from '@/components/manifesto';
import { Navbar } from '@/components/navbar';
import { ExperienceEducation } from '@/components/site/experience-education';
import { InnerHero } from '@/components/site/inner-hero';
import { SkillMeters } from '@/components/site/skill-meters';
import { getCmsConfig } from '@/lib/supabase/cms';

export async function generateMetadata(): Promise<Metadata> { const cms = await getCmsConfig(); const seo = cms.seo.find((item) => item.pageKey === 'about'); return { title: seo?.title, description: seo?.description, keywords: seo?.keywords, alternates: { canonical: '/about' }, openGraph: seo ? { title: seo.shareTitle || seo.title, description: seo.shareDescription || seo.description, images: seo.ogImage ? [seo.ogImage] : [] } : undefined }; }

export default function AboutPage() {
  return <><Navbar /><main id="main-content" className="overflow-hidden bg-background text-foreground"><InnerHero eyebrow={<Localized zh="关于我" en="About" />} title={<Localized zh="设计与代码，是同一种思考。" en="Design and code are one way of thinking." />} description={<Localized zh="我在 AI 产品、数字视觉与前端实现之间工作，关注清晰、可用与长期价值。" en="I work across AI products, digital design and frontend delivery—with a focus on clarity, usefulness and lasting value." />} /><About /><ExperienceEducation /><SkillMeters /><div id="insights"><Manifesto /></div></main><Footer /></>;
}
