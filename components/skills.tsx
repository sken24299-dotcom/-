'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Blocks, Bot, Braces, Component, Fingerprint, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';

const capabilities = [
  { number: '01', title: 'AI 产品设计', titleEn: 'AI Product Design', description: '把复杂模型能力转化为清晰、可信、真正能够解决问题的产品体验。', icon: Bot },
  { number: '02', title: '前端界面开发', titleEn: 'Frontend Development', description: '用可访问、响应式、生产级代码精准实现设计意图与品牌细节。', icon: Braces },
  { number: '03', title: '电商视觉系统', titleEn: 'Commerce Visual Systems', description: '连接内容、转化与品牌识别，建立适合多渠道扩展的商业视觉语言。', icon: Component },
  { number: '04', title: '品牌视觉设计', titleEn: 'Brand Experience', description: '为数字产品建立清晰、有辨识度，并能跨触点延展的品牌体验。', icon: Fingerprint },
  { number: '05', title: '交互动效设计', titleEn: 'Motion & Interaction', description: '使用克制而有意义的动效增强层级、反馈和产品记忆点。', icon: Sparkles },
  { number: '06', title: '设计系统搭建', titleEn: 'Design Systems', description: '构建可复用的组件、规则与协作基础，提高一致性和交付效率。', icon: Blocks },
];

export function Skills() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="capabilities" className="section-shell section-space relative">
      <div className="section-glow section-glow-left" aria-hidden="true" />
      <div className="site-container">
        <Reveal>
          <SectionHeading
            index="03"
            eyebrow="我能提供什么 / What I Do"
            title="从方向到落地。"
            description="用一致的设计判断连接产品、品牌与技术实现。"
          />
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-[18px] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <Reveal key={capability.number} delay={index * 0.05} className="h-full" amount={0.12}>
                <motion.article
                  className="skill-card group relative h-full min-h-[230px] overflow-hidden bg-card p-6"
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="skill-card-glow" aria-hidden="true" />
                  <div className="relative z-[1] flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground/60">{capability.number}</span>
                      <span className="flex size-10 items-center justify-center rounded-full border border-border bg-muted/60 text-muted-foreground transition-all duration-300 group-hover:border-violet-400/30 group-hover:bg-violet-500/10 group-hover:text-violet-500">
                        <Icon size={17} strokeWidth={1.5} />
                      </span>
                    </div>
                    <div className="mt-auto pt-12">
                      <h3 className="text-xl font-semibold tracking-[-0.035em] text-foreground sm:text-2xl">{capability.title}</h3>
                      <p className="mt-1.5 text-[9px] uppercase tracking-[0.13em] text-violet-500/70">{capability.titleEn}</p>
                      <p className="mt-4 max-w-[32ch] text-sm leading-7 text-muted-foreground transition-colors duration-300 group-hover:text-foreground/75">{capability.description}</p>
                    </div>
                  </div>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
