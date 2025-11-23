import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({ children, className = '', ...props }) => {
  const baseClasses =
    'flex items-center gap-2 text-sm leading-none font-medium select-none disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <label className={`${baseClasses} ${className}`} {...props}>
      {children}
    </label>
  );
};
Label.displayName = 'Label';
