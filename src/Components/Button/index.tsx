import { useThemeStore } from '@/lib/store';
import * as React from 'react';

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'link' | 'border';
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
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:pointer-events-none disabled:opacity-50';

  let dynamicVariantClasses = '';

  if (variant === 'default') {
    dynamicVariantClasses =
      mode === 'light'
        ? 'bg-black text-white border border-black hover:bg-gray-800'
        : 'bg-white text-black border border-white hover:bg-gray-200';
  } else if (variant === 'outline') {
    dynamicVariantClasses =
      mode === 'light'
        ? 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50'
        : 'bg-transparent text-gray-300 border border-gray-600 hover:bg-gray-800';
  } else if (variant === 'ghost') {
    dynamicVariantClasses =
      mode === 'light'
        ? 'bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent'
        : 'bg-transparent text-gray-300 hover:bg-gray-800 border border-transparent';
  } else if (variant === 'border') {
    dynamicVariantClasses =
      mode === 'light'
        ? 'bg-transparent text-gray-600 border border-gray-200 hover:bg-gray-50'
        : 'bg-transparent text-gray-400 border border-gray-700 hover:bg-gray-900';
  } else if (variant === 'link') {
    dynamicVariantClasses =
      mode === 'light'
        ? 'text-gray-600 underline-offset-4 hover:underline border-transparent'
        : 'text-gray-400 underline-offset-4 hover:underline border-transparent';
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

Button.displayName = 'Button';
