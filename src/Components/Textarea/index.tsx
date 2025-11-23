import * as React from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

function Textarea({ className, ...props }: TextareaProps) {
  const baseClasses =
    'resize-none border border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:bg-gray-900/30 flex min-h-16 w-full rounded-md bg-white px-3 py-2 text-base transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-gray-600 dark:bg-gray-900 dark:placeholder:text-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400/50';
  const combinedClasses = [baseClasses, className].filter(Boolean).join(' ');

  return <textarea className={combinedClasses} {...props} />;
}

export { Textarea };
