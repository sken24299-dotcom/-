import { BrainCircuit, Braces, Cuboid, Layers3, MousePointer2, ShoppingBag } from 'lucide-react';

export const stats = [
  { value: 3, suffix: '+', label: '年设计经验', labelEn: 'Years Experience' },
  { value: 80, suffix: '+', label: '项目完成', labelEn: 'Projects Completed' },
  { value: 20, suffix: '+', label: '客户服务', labelEn: 'Clients Served' },
  { value: 100, suffix: '%', label: '专注设计', labelEn: 'Design Focus' },
];

export const services = [
  {
    number: '01',
    title: 'AI 产品设计',
    titleEn: 'AI Product Design',
    scope: '产品策略 · UI/UX',
    scopeEn: 'Product strategy & interface',
    description: '把复杂的 AI 能力转化为清晰、可信、易用的产品体验。',
    descriptionEn: 'Turn complex AI capabilities into clear, useful and trustworthy product experiences.',
    icon: BrainCircuit,
  },
  {
    number: '02',
    title: '前端界面开发',
    titleEn: 'Frontend Development',
    scope: '产品界面 · 工程实现',
    scopeEn: 'Responsive web engineering',
    description: '用 Next.js、React 与 TypeScript 将设计准确落地。',
    descriptionEn: 'Build precise, responsive interfaces with Next.js, React and TypeScript.',
    icon: Braces,
  },
  {
    number: '03',
    title: '电商视觉设计',
    titleEn: 'E-commerce Visuals',
    scope: '内容系统 · 商业视觉',
    scopeEn: 'Commerce visuals & conversion',
    description: '以清晰层级和统一视觉提升商品理解与品牌识别。',
    descriptionEn: 'Improve product clarity and brand recognition through structured commerce visuals.',
    icon: ShoppingBag,
  },
  {
    number: '04',
    title: '品牌视觉系统',
    titleEn: 'Brand Systems',
    scope: '品牌识别与系统',
    scopeEn: 'Brand identity & systems',
    description: '将品牌策略转化为一致、可扩展的数字视觉语言。',
    descriptionEn: 'Translate brand strategy into a coherent, scalable digital visual language.',
    icon: Layers3,
  },
  {
    number: '05',
    title: '交互动效设计',
    titleEn: 'Motion & Interaction',
    scope: '动效与交互反馈',
    scopeEn: 'Motion & interaction',
    description: '用克制的动效强化层级、反馈与体验节奏。',
    descriptionEn: 'Use restrained motion to strengthen hierarchy, feedback and rhythm.',
    icon: MousePointer2,
  },
  {
    number: '06',
    title: '作品集网站搭建',
    titleEn: 'Portfolio Experiences',
    scope: '个人品牌与展示',
    scopeEn: 'Personal brand & showcase',
    description: '用作品、观点与技术建立清晰的个人品牌体验。',
    descriptionEn: 'Build a clear personal brand around selected work, perspective and craft.',
    icon: Cuboid,
  },
];

export const experience = [
  {
    period: '2025 — 至今',
    periodEn: '2025 — PRESENT',
    title: 'AI 视觉设计师',
    titleEn: 'AI Visual Designer',
    organization: '自由职业 / 工作室',
    organizationEn: 'Freelance / Studio',
    description: '负责 AI 产品、数字品牌与商业视觉的设计和落地。',
    descriptionEn: 'Lead design and delivery for AI products, digital brands and commerce experiences.',
  },
  {
    period: '2024 — 2025',
    periodEn: '2024 — 2025',
    title: '前端开发者',
    titleEn: 'Frontend Developer',
    organization: '个人项目',
    organizationEn: 'Personal Projects',
    description: '以 React、Next.js 与动效技术构建响应式产品界面。',
    descriptionEn: 'Built responsive product interfaces with React, Next.js and motion.',
  },
  {
    period: '2023 — 2024',
    periodEn: '2023 — 2024',
    title: '电商视觉设计师',
    titleEn: 'E-commerce Designer',
    organization: '线上商业项目',
    organizationEn: 'Online Business',
    description: '为 Listing 与详情页建立可复用的商业视觉系统。',
    descriptionEn: 'Created reusable visual systems for listings and product detail pages.',
  },
];

export const education = [
  {
    period: '2025 — 至今',
    periodEn: '2025 — PRESENT',
    title: 'AI 产品设计',
    titleEn: 'AI Product Design',
    organization: '自主学习 / 实践',
    organizationEn: 'Self-learning / Practice',
    description: '研究 AI 原生交互、智能工作流与人机协作。',
    descriptionEn: 'Researching AI-native interaction, intelligent workflows and human–AI collaboration.',
  },
  {
    period: '2024 — 2025',
    periodEn: '2024 — 2025',
    title: '前端开发',
    titleEn: 'Frontend Development',
    organization: 'Next.js / React / TypeScript',
    organizationEn: 'Next.js / React / TypeScript',
    description: '将设计判断转化为可靠、响应式的生产代码。',
    descriptionEn: 'Turning design judgment into reliable, responsive production code.',
  },
  {
    period: '2023 — 2024',
    periodEn: '2023 — 2024',
    title: '品牌视觉设计',
    titleEn: 'Brand Visual Design',
    organization: '商业设计实践',
    organizationEn: 'Commercial Design Practice',
    description: '通过商业实践建立品牌系统与视觉叙事能力。',
    descriptionEn: 'Developed brand systems and visual storytelling through commercial practice.',
  },
];

export const skillMeters = [
  { name: 'AI 工具', nameEn: 'AI Tools', focus: '生成式工作流 · 原型 · 视觉探索', focusEn: 'Generative workflows · prototyping · visual exploration', value: 95, code: 'AI' },
  { name: '产品设计', nameEn: 'Product Design', focus: '策略 · UI/UX · 设计系统', focusEn: 'Strategy · UI/UX · design systems', value: 92, code: 'PD' },
  { name: '前端开发', nameEn: 'Frontend', focus: 'Next.js · React · TypeScript', focusEn: 'Next.js · React · TypeScript', value: 88, code: 'FE' },
  { name: '品牌视觉', nameEn: 'Branding', focus: '视觉方向 · 内容系统 · 电商', focusEn: 'Art direction · content systems · commerce', value: 90, code: 'BR' },
  { name: '交互动效', nameEn: 'Motion', focus: 'Framer Motion · GSAP · Micro-interaction', focusEn: 'Framer Motion · GSAP · micro-interaction', value: 85, code: 'MO' },
];

export const testimonials = [
  {
    quote: '设计沟通非常清晰，交付的视觉效果比预期更专业，也让我们的产品价值更容易被理解。',
    quoteEn: 'The design communication was exceptionally clear. The final visuals felt more professional than expected and made our product value much easier to understand.',
    name: 'Chen Yu',
    role: 'AI 创业公司创始人',
    roleEn: 'AI Startup Founder',
    initials: 'CY',
  },
  {
    quote: '能把复杂需求整理成清晰页面，设计和代码之间几乎没有落差，适合长期合作。',
    quoteEn: 'Complex requirements became a clear, coherent interface, with almost no gap between the design and the production build. An excellent long-term partner.',
    name: 'Mia Lin',
    role: '产品负责人',
    roleEn: 'Product Lead',
    initials: 'ML',
  },
  {
    quote: '对电商视觉和 AI 工具理解很强，页面层级清楚，最终转化表达也更有说服力。',
    quoteEn: 'The understanding of commerce visuals and AI tools was outstanding. The hierarchy became clearer and the final conversion story far more persuasive.',
    name: 'Leo Zhang',
    role: '电商业务负责人',
    roleEn: 'E-commerce Director',
    initials: 'LZ',
  },
];

export const articles = [
  {
    category: 'AI × 商业',
    categoryEn: 'AI × COMMERCE',
    date: '2026.08.18',
    title: '如何用 AI 提升电商主图效率',
    titleEn: 'How AI Can Accelerate E-commerce Hero Imagery',
    summary: '从创意拆解、批量探索到质量控制，建立更可靠的视觉生产流程。',
    summaryEn: 'A practical workflow for turning creative decomposition, batch exploration and quality control into a more reliable visual production system.',
  },
  {
    category: '作品集',
    categoryEn: 'PORTFOLIO',
    date: '2026.07.26',
    title: '个人作品集网站应该如何设计',
    titleEn: 'How to Design a Personal Portfolio Website',
    summary: '让作品、能力与商业价值在 30 秒内形成清晰而有说服力的叙事。',
    summaryEn: 'A framework for communicating work, capability and commercial value through a clear, persuasive story in the first 30 seconds.',
  },
  {
    category: '设计 × 代码',
    categoryEn: 'DESIGN × CODE',
    date: '2026.06.12',
    title: '设计师如何用前端增强竞争力',
    titleEn: 'How Frontend Skills Make Designers More Competitive',
    summary: '当设计判断能够直接进入生产，创意、效率与最终体验会发生什么变化。',
    summaryEn: 'What changes in creativity, speed and final experience when design judgment can move directly into production.',
  },
];
