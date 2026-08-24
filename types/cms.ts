export type UserRole = 'admin' | 'editor' | 'user';
export type UserStatus = 'active' | 'disabled';

export type CmsProfile = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastSignInAt?: string;
};

export type BilingualText = { zh: string; en: string };

export type HeroContent = {
  eyebrow: BilingualText;
  title: BilingualText;
  subtitle: BilingualText;
  primaryLabel: BilingualText;
  primaryHref: string;
  secondaryLabel: BilingualText;
  secondaryHref: string;
  portrait: string;
};

export type ContactContent = {
  eyebrow: BilingualText;
  title: BilingualText;
  description: BilingualText;
};

export type SiteSettings = {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  description: string;
  email: string;
  phone: string;
  wechat: string;
  whatsapp: string;
  telegram: string;
  github: string;
  linkedin: string;
  twitter: string;
  location: string;
  copyright: string;
};

export type NavigationItem = {
  id: string;
  labelZh: string;
  labelEn: string;
  href: string;
  sortOrder: number;
  visible: boolean;
  newWindow: boolean;
};

export type SeoSetting = {
  pageKey: string;
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  shareTitle: string;
  shareDescription: string;
};

export type ThemeSettings = {
  primary: string;
  secondary: string;
  lightBackground: string;
  lightForeground: string;
  darkBackground: string;
  darkForeground: string;
  baseFontSize: number;
  radius: number;
  containerWidth: number;
  shadow: 'none' | 'soft' | 'medium';
};

export type CmsConfig = {
  hero: HeroContent;
  contact: ContactContent;
  footer: BilingualText;
  about: { title: BilingualText; description: BilingualText };
  sectionHeadings: {
    servicesTitle: BilingualText; servicesDescription: BilingualText;
    workTitle: BilingualText; workDescription: BilingualText;
    skillsTitle: BilingualText; skillsDescription: BilingualText;
  };
  site: SiteSettings;
  navigation: NavigationItem[];
  seo: SeoSetting[];
  theme: ThemeSettings;
};

export type MediaAsset = {
  id: string;
  name: string;
  url: string;
  path: string;
  mimeType: string;
  size: number;
  category: string;
  altText: string;
  createdAt: string;
};

export type CmsActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string[]>;
};
