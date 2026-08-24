'use client';

import { BrandLogo } from '@/components/brand-logo';
import { useCms } from '@/components/cms-provider';
import { Localized } from '@/components/localized';
import { ScrollToTop } from '@/components/site/scroll-to-top';

export function Footer() {
  const { footer, site } = useCms();
  return (
    <>
      <footer className="border-t border-border bg-background py-7 text-center">
        <div className="site-container flex flex-col items-center">
          <a href="/#top" className="inline-flex items-center" aria-label="ZhiLink AI home">
            <BrandLogo />
          </a>
          <p className="mt-3 text-sm leading-6 text-muted-foreground"><Localized zh={footer.zh} en={footer.en} /></p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/65">{site.copyright}</p>
        </div>
      </footer>
      <ScrollToTop />
    </>
  );
}
