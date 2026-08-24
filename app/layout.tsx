import type { Metadata, Viewport } from 'next';
import { Geist_Mono, Noto_Sans_SC, Sora } from 'next/font/google';
import { Providers } from '@/components/providers';
import { getCmsConfig } from '@/lib/supabase/cms';
import { siteUrl } from '@/lib/site';
import './globals.css';

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoSansSc = Noto_Sans_SC({
  variable: '--font-noto-sans-sc',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getCmsConfig();
  const seo = cms.seo.find((item) => item.pageKey === 'home') ?? cms.seo[0];
  return {
    metadataBase: new URL(siteUrl),
    title: { default: seo.title, template: `%s — ${cms.site.siteName}` },
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: 'Yu Wang', url: siteUrl }], creator: 'Yu Wang', category: 'design', alternates: { canonical: '/' },
    openGraph: { type: 'website', locale: 'zh_CN', alternateLocale: 'en_US', url: '/', siteName: cms.site.siteName, title: seo.shareTitle || seo.title, description: seo.shareDescription || seo.description, images: seo.ogImage ? [{ url: seo.ogImage, alt: seo.shareTitle || seo.title }] : [] },
    twitter: { card: 'summary_large_image', title: seo.shareTitle || seo.title, description: seo.shareDescription || seo.description, images: seo.ogImage ? [seo.ogImage] : [] },
    robots: { index: true, follow: true }, icons: { icon: cms.site.faviconUrl, shortcut: cms.site.faviconUrl, apple: cms.site.faviconUrl },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#05010A' },
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cms = await getCmsConfig();
  return (
    <html lang="zh-CN" data-language="zh" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{var l=localStorage.getItem('portfolio-language');if(l==='en'||l==='zh'){document.documentElement.dataset.language=l;document.documentElement.lang=l==='en'?'en':'zh-CN'}}catch(e){}" }} />
      </head>
      <body
        className={`${sora.variable} ${geistMono.variable} ${notoSansSc.variable} antialiased`}
      >
        <Providers cms={cms}>{children}</Providers>
      </body>
    </html>
  );
}
