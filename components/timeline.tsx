import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';

const experiences = [
  {
    year: '2026',
    role: '独立设计师 / Independent Designer',
    type: '当前 · 全球合作',
    description: '与有想法的团队共同定义、设计并落地 AI 原生产品和数字体验。',
    focus: ['AI Products', 'Creative Direction', 'Digital Experiences'],
  },
  {
    year: '2025',
    role: '产品设计师 / Product Designer',
    type: '产品设计 · 全职',
    description: '从用户研究、交互设计到原型和开发协作，推动完整产品体验落地。',
    focus: ['Product Strategy', 'UI/UX', 'Prototyping'],
  },
  {
    year: '2024',
    role: '前端开发者 / Frontend Developer',
    type: '工程开发 · 全职',
    description: '构建响应式界面与可复用系统，把复杂产品概念转化为稳定的生产体验。',
    focus: ['React', 'TypeScript', 'Design Systems'],
  },
];

export function Timeline() {
  return (
    <section id="experience" className="section-shell section-space relative">
      <div className="site-container">
        <Reveal>
          <SectionHeading
            index="04"
            eyebrow="经历 / Experience"
            title="在真实项目中持续成长。"
            description="一条连接产品、设计与代码的实践路径。"
          />
        </Reveal>

        <div className="relative mt-16 lg:mt-20">
          <div className="timeline-line absolute bottom-0 left-[63px] top-0 w-px sm:left-[157px] lg:left-[260px]" aria-hidden="true" />
          <div className="space-y-4">
            {experiences.map((experience, index) => (
              <Reveal key={experience.year} delay={index * 0.07} amount={0.22}>
                <article className="timeline-row group grid grid-cols-[52px_1fr] gap-5 rounded-[20px] border border-transparent px-0 py-7 transition-all duration-300 hover:border-border hover:bg-card/55 sm:grid-cols-[120px_1fr] sm:px-6 lg:grid-cols-[210px_1fr_auto] lg:items-center lg:px-8 lg:py-9">
                  <div className="relative font-mono text-xs text-muted-foreground sm:text-sm">
                    <span className="timeline-dot absolute -right-[15px] top-1 size-2 rounded-full sm:-right-[17px] lg:-right-[22px]" aria-hidden="true" />
                    {experience.year}
                  </div>
                  <div className="pl-2 sm:pl-6 lg:pl-10">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground/65">{experience.type}</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-foreground transition-transform duration-300 group-hover:translate-x-1 sm:text-3xl">{experience.role}</h3>
                    <p className="mt-3 max-w-[590px] text-sm leading-7 text-muted-foreground sm:text-[15px]">{experience.description}</p>
                  </div>
                  <div className="col-start-2 mt-4 flex flex-wrap gap-2 pl-2 sm:pl-6 lg:col-start-auto lg:mt-0 lg:max-w-[240px] lg:justify-end lg:pl-0">
                    {experience.focus.map((item) => (
                      <span key={item} className="rounded-full border border-border bg-card/40 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-16 border-y border-border py-7 sm:mt-24">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            <div><p className="text-3xl font-medium tracking-[-0.05em]">03</p><p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-muted-foreground">跨学科能力 / Disciplines</p></div>
            <div><p className="text-3xl font-medium tracking-[-0.05em]">01</p><p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-muted-foreground">统一设计判断 / Point of view</p></div>
            <div><p className="text-3xl font-medium tracking-[-0.05em]">∞</p><p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-muted-foreground">持续好奇 / Curiosity</p></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
