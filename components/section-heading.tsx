import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  index: string;
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-8 sm:mb-9', align === 'center' && 'mx-auto max-w-3xl text-center', className)}>
      <div className={cn('mb-3 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground', align === 'center' && 'justify-center')}>
        <span className="font-mono text-violet-500 dark:text-violet-300/80">{index}</span>
        <span className="h-px w-7 bg-border" />
        <span>{eyebrow}</span>
      </div>
      <h2 className={cn('type-page-title max-w-[820px] text-balance text-foreground', align === 'center' && 'mx-auto')}>
        {title}
      </h2>
      {description ? (
        <p className={cn('body-copy mt-3 max-w-2xl text-pretty', align === 'center' && 'mx-auto')}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
