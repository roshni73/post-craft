import React from 'react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ variant = 'default', className = '', ...props }) => {
  const baseClasses =
    'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current';

  const variantClasses =
    variant === 'destructive'
      ? 'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90'
      : 'bg-card text-card-foreground';

  return (
    <div
      data-slot="alert"
      role="alert"
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    />
  );
};

export const AlertTitle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...props
}) => (
  <div
    data-slot="alert-title"
    className={`col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight ${className}`}
    {...props}
  />
);

export const AlertDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...props
}) => (
  <div
    data-slot="alert-description"
    className={`text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed ${className}`}
    {...props}
  />
);
Alert.displayName = 'Alert';
