import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/hero';
import { Localized } from '@/components/localized';
import { Navbar } from '@/components/navbar';
import { Projects } from '@/components/projects';
import { Articles } from '@/components/site/articles';
import { ExperienceEducation } from '@/components/site/experience-education';
import { PageLoader } from '@/components/site/page-loader';
import { Services } from '@/components/site/services';
import { SkillMeters } from '@/components/site/skill-meters';
import { Stats } from '@/components/site/stats';
import { Testimonials } from '@/components/site/testimonials';
import { getFeaturedProjects } from '@/lib/supabase/projects';

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Yu Wang',
  url: 'https://yuwang.design',
  jobTitle: ['AI 产品设计师', '创意前端开发者', '电商视觉设计师', '数字体验设计师'],
  knowsAbout: ['AI Product Design', 'Frontend Development', 'E-commerce Visual Design', 'Design Systems', 'Brand Experience'],
  sameAs: ['https://github.com/yuwang', 'https://www.linkedin.com/in/yuwang'],
};

export default async function Home() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <a className="skip-link" href="#main-content"><Localized zh="跳到主要内容" en="Skip to main content" /></a>
      <PageLoader />
      <Navbar />
      <main id="main-content" className="overflow-hidden bg-background text-foreground">
        <Hero />
        <Stats />
        <Services />
        <Projects projects={featuredProjects} />
        <ExperienceEducation />
        <SkillMeters />
        <Testimonials />
        <Articles />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
