import type { CmsConfig } from '@/types/cms';

export const defaultCmsConfig: CmsConfig = {
  hero: {
    eyebrow: { zh: 'AI 设计师 · 创意开发者', en: 'AI Designer · Creative Developer' },
    title: { zh: '用 AI 与设计\n创造数字体验', en: 'Designing useful\ndigital experiences.' },
    subtitle: { zh: '我将 AI 产品设计、前端开发与品牌视觉整合为清晰、可信的数字产品。', en: 'I bring product design, frontend engineering and brand systems together to create clear, useful digital products.' },
    primaryLabel: { zh: '查看作品', en: 'View Work' },
    primaryHref: '/work',
    secondaryLabel: { zh: '获取简历', en: 'Resume' },
    secondaryHref: 'mailto:hello@yuwang.design?subject=Resume%20Request',
    portrait: '/images/yu-wang-ai-designer.png',
  },
  about: {
    title: { zh: '设计清晰，也把它做出来。', en: 'I design clearly—and build what I design.' },
    description: { zh: '专注 AI 产品、数字品牌与前端体验，用设计判断连接创意与生产。', en: 'Focused on AI products, digital brands and frontend experiences—connecting creative direction with production.' },
  },
  sectionHeadings: {
    servicesTitle: { zh: '设计与开发，一体完成。', en: 'Design and development, together.' }, servicesDescription: { zh: '从产品方向到界面落地，提供清晰、完整的数字体验设计。', en: 'From product direction to interface delivery, I create focused digital experiences.' },
    workTitle: { zh: '用作品证明判断。', en: 'Selected work, clearly presented.' }, workDescription: { zh: 'AI 产品、商业视觉、品牌与前端开发案例。', en: 'Case studies across AI products, commerce, branding and frontend development.' },
    skillsTitle: { zh: '跨越设计与技术。', en: 'Across design and technology.' }, skillsDescription: { zh: '五类核心能力，覆盖从概念到上线的完整过程。', en: 'Five core capabilities supporting the journey from concept to launch.' },
  },
  contact: {
    eyebrow: { zh: '联系', en: 'Contact' },
    title: { zh: '一起做点好作品。', en: 'Let’s create something meaningful.' },
    description: { zh: '如果你有项目需求，欢迎交流合作。', en: 'If you have a project in mind, I would be glad to hear about it.' },
  },
  footer: { zh: '设计清晰，体验完整。', en: 'Clear design. Complete experiences.' },
  site: {
    siteName: 'ZhiLink AI',
    logoUrl: '/images/zhilink-ai-logo.png',
    faviconUrl: '/favicon.svg',
    description: '专注于 AI 产品设计、前端开发、电商视觉系统与数字品牌体验的个人作品集网站。',
    email: 'hello@yuwang.design',
    phone: '',
    wechat: 'YuWangDesign',
    whatsapp: '',
    telegram: '',
    github: 'https://github.com/yuwang',
    linkedin: 'https://www.linkedin.com/in/yuwang',
    twitter: '',
    location: 'Singapore · Remote',
    copyright: '© 2026 Yu Wang. All rights reserved.',
  },
  navigation: [
    { id: 'top', labelZh: '首页', labelEn: 'Home', href: '/#top', sortOrder: 10, visible: true, newWindow: false },
    { id: 'services', labelZh: '服务', labelEn: 'Services', href: '/#services', sortOrder: 20, visible: true, newWindow: false },
    { id: 'work', labelZh: '作品', labelEn: 'Works', href: '/#work', sortOrder: 30, visible: true, newWindow: false },
    { id: 'experience', labelZh: '履历', labelEn: 'Resume', href: '/#experience', sortOrder: 40, visible: true, newWindow: false },
    { id: 'skills', labelZh: '技能', labelEn: 'Skills', href: '/#skills', sortOrder: 50, visible: true, newWindow: false },
    { id: 'testimonials', labelZh: '评价', labelEn: 'Testimonials', href: '/#testimonials', sortOrder: 60, visible: true, newWindow: false },
    { id: 'contact', labelZh: '联系', labelEn: 'Contact', href: '/#contact', sortOrder: 70, visible: true, newWindow: false },
  ],
  seo: [
    { pageKey: 'home', title: 'AI 产品设计师作品集 | Yu Wang Portfolio', description: '专注于 AI 产品设计、前端开发、电商视觉系统与数字品牌体验的个人作品集网站。', keywords: ['AI 产品设计', '前端开发', '作品集'], ogImage: '/opengraph-image', shareTitle: 'Yu Wang Portfolio', shareDescription: 'AI 产品设计、前端开发与数字品牌体验。' },
    { pageKey: 'work', title: '精选作品 | Yu Wang Portfolio', description: '浏览 AI 产品、电商视觉、品牌设计与前端开发案例。', keywords: ['作品集', 'Case Study'], ogImage: '/opengraph-image', shareTitle: 'Selected Work', shareDescription: 'Selected AI product and digital experience work.' },
    { pageKey: 'about', title: '关于我 | Yu Wang Portfolio', description: 'AI 产品设计师与创意前端开发者 Yu Wang。', keywords: ['About', 'Yu Wang'], ogImage: '/opengraph-image', shareTitle: 'About Yu Wang', shareDescription: 'AI designer and creative developer.' },
    { pageKey: 'contact', title: '联系合作 | Yu Wang Portfolio', description: '联系 Yu Wang 讨论 AI 产品、品牌视觉与前端项目。', keywords: ['Contact', '合作'], ogImage: '/opengraph-image', shareTitle: 'Work with Yu Wang', shareDescription: 'Start a conversation about your next digital product.' },
  ],
  theme: {
    primary: '#8750F7', secondary: '#2563EB', lightBackground: '#F8FAFC', lightForeground: '#09090B', darkBackground: '#05010A', darkForeground: '#FFFFFF', baseFontSize: 15, radius: 14, containerWidth: 1120, shadow: 'soft',
  },
};
