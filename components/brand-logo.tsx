'use client';

import Image from 'next/image';
import { useCms } from '@/components/cms-provider';
import { cn } from '@/lib/utils';

export function BrandLogo({ inverse = false, className }: { inverse?: boolean; className?: string }) {
  const { site } = useCms();
  return (
    <span
      className={cn('relative block h-[17px] w-[116px] shrink-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      <Image
        src={site.logoUrl || '/images/zhilink-ai-logo.png'}
        alt=""
        width={1802}
        height={872}
        priority
        className={cn('absolute max-w-none', inverse ? 'brightness-[2.2]' : 'dark:brightness-[2.2]')}
        style={{ width: '128.7px', height: '62.3px', left: '-6.7px', top: '-21.4px' }}
      />
    </span>
  );
}
