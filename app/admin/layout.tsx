import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: '作品管理后台', template: '%s | Portfolio Admin' },
  description: '管理个人作品集内容、封面、标签与首页展示顺序。',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

