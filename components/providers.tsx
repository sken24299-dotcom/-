'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { GlobalMotionLayer } from '@/components/global-motion-layer';
import { LanguageProvider } from '@/components/language-provider';
import { CmsProvider, CmsThemeStyle } from '@/components/cms-provider';
import type { CmsConfig } from '@/types/cms';

export function Providers({ children, cms }: { children: React.ReactNode; cms: CmsConfig }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
      <CmsProvider config={cms}>
        <CmsThemeStyle config={cms} />
        <LanguageProvider>
          <GlobalMotionLayer />
          <div className="app-content relative min-h-screen">{children}</div>
          <Toaster position="top-right" toastOptions={{ className: 'border-border bg-card text-card-foreground shadow-2xl' }} />
        </LanguageProvider>
      </CmsProvider>
    </ThemeProvider>
  );
}
