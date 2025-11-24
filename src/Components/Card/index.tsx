import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Card: React.FC<CardProps> = ({ className = '', ...props }) => (
  <div
    data-slot="card"
    className={`bg-card text-card-foreground flex flex-col gap-6 rounded-xl border ${className}`}
    {...props}
  />
);

export const CardHeader: React.FC<CardProps> = ({ className = '', ...props }) => (
  <div
    data-slot="card-header"
    className={`@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 ${className}`}
    {...props}
  />
);

export const CardTitle: React.FC<CardProps> = ({ className = '', ...props }) => (
  <h4 data-slot="card-title" className={`leading-none ${className}`} {...props} />
);

export const CardDescription: React.FC<CardProps> = ({ className = '', ...props }) => (
  <p data-slot="card-description" className={`text-muted-foreground ${className}`} {...props} />
);

export const CardAction: React.FC<CardProps> = ({ className = '', ...props }) => (
  <div
    data-slot="card-action"
    className={`col-start-2 row-span-2 row-start-1 self-start justify-self-end ${className}`}
    {...props}
  />
);

export const CardContent: React.FC<CardProps> = ({ className = '', ...props }) => (
  <div data-slot="card-content" className={`px-6 [&:last-child]:pb-6 ${className}`} {...props} />
);

export const CardFooter: React.FC<CardProps> = ({ className = '', ...props }) => (
  <div
    data-slot="card-footer"
    className={`flex items-center px-6 pb-6 [.border-t]:pt-6 ${className}`}
    {...props}
  />
);
Card.displayName = 'Card';
