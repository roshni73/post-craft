import { useThemeStore } from '@/lib/store';
import * as React from 'react';

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-10 px-5 text-sm',
  sm: 'h-8 px-3 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10 p-2',
};

export const Button: React.FC<ButtonProps> = ({
  className = '',
  variant = 'default',
  size = 'default',
  children,
  ...props
}) => {
  const { mode } = useThemeStore();

  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-black disabled:pointer-events-none disabled:opacity-50';
  let dynamicVariantClasses = '';

  if (variant === 'default') {
    dynamicVariantClasses =
      mode === 'light'
        ? 'bg-black text-white border border-black'
        : 'bg-primary text-primary-foreground';
  } else if (variant === 'outline' || variant === 'ghost') {
    dynamicVariantClasses =
      mode === 'light'
        ? 'bg-transparent text-black border border-black hover:bg-black hover:text-white'
        : 'bg-transparent text-white border border-white hover:bg-white hover:text-black';
  } else if (variant === 'link') {
    dynamicVariantClasses =
      mode === 'light'
        ? 'text-primary underline-offset-4 hover:underline'
        : 'text-white underline-offset-4 hover:underline';
  }

  return (
    <button
      className={`${baseClasses} ${dynamicVariantClasses} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
