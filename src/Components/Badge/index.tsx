import * as React from 'react';

function mergeClasses(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const base =
    'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:size-3 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden';
  let variantClasses = '';

  if (variant === 'default') {
    variantClasses = 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90';
  } else if (variant === 'secondary') {
    variantClasses =
      'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90';
  } else if (variant === 'destructive') {
    variantClasses = 'border-transparent bg-destructive text-white hover:bg-destructive/90';
  } else if (variant === 'outline') {
    variantClasses = 'text-foreground hover:bg-accent hover:text-accent-foreground';
  }

  return (
    <span data-slot="badge" className={mergeClasses(base, variantClasses, className)} {...props} />
  );
}
