import type { Metadata } from 'next';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { ContactSection } from '@/components/site/contact-section';
import { getCmsConfig } from '@/lib/supabase/cms';

export async function generateMetadata(): Promise<Metadata> { const cms = await getCmsConfig(); const seo = cms.seo.find((item) => item.pageKey === 'contact'); return { title: seo?.title, description: seo?.description, keywords: seo?.keywords, alternates: { canonical: '/contact' }, openGraph: seo ? { title: seo.shareTitle || seo.title, description: seo.shareDescription || seo.description, images: seo.ogImage ? [seo.ogImage] : [] } : undefined }; }

export default function ContactPage() {
  return <><Navbar /><main id="main-content" className="overflow-hidden bg-background text-foreground"><ContactSection standalone /></main><Footer /></>;
}
