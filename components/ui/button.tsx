import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'premium-action relative isolate inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-[8px] text-sm font-semibold transition-[transform,background-color,color,border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px active:scale-[.975] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[var(--primary)] text-white shadow-[0_10px_28px_rgba(135,80,247,.2)] hover:-translate-y-px hover:bg-[var(--primary-hover)]',
        outline: 'border border-border bg-card/55 text-foreground backdrop-blur-xl hover:-translate-y-px hover:border-foreground/20 hover:bg-muted',
        ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-9 px-3.5 text-[13px]',
        lg: 'h-11 px-5 text-sm',
        icon: 'size-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

export { Button, buttonVariants };
