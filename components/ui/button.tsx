'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--wsua-teal-light)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'border border-[var(--wsua-teal)] text-[var(--wsua-teal-light)] bg-transparent hover:bg-[var(--charcoal-light)]',
        subtle:
          'bg-[var(--charcoal)] text-[var(--wsua-teal-light)] border border-[var(--wsua-teal)] hover:bg-[var(--charcoal-light)]',
        ghost: 'hover:bg-[var(--charcoal-light)] hover:text-white',
        gold: 'border border-[var(--wsua-gold)] text-[var(--wsua-gold)] hover:bg-amber-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = 'Button';

export { Button, buttonVariants };
