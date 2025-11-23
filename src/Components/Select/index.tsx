import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root>;
type SelectGroupProps = React.ComponentProps<typeof SelectPrimitive.Group>;
type SelectValueProps = React.ComponentProps<typeof SelectPrimitive.Value>;
interface SelectTriggerProps extends React.ComponentProps<typeof SelectPrimitive.Trigger> {
  size?: 'sm' | 'default';
}
interface SelectContentProps extends React.ComponentProps<typeof SelectPrimitive.Content> {
  position?: 'popper' | 'item-aligned';
}
type SelectLabelProps = React.ComponentProps<typeof SelectPrimitive.Label>;
type SelectItemProps = React.ComponentProps<typeof SelectPrimitive.Item>;
type SelectSeparatorProps = React.ComponentProps<typeof SelectPrimitive.Separator>;
type SelectScrollButtonProps = React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>;

export const Select: React.FC<SelectProps> = (props) => {
  return <SelectPrimitive.Root {...props} />;
};

export const SelectGroup: React.FC<SelectGroupProps> = (props) => {
  return <SelectPrimitive.Group {...props} />;
};

export const SelectValue: React.FC<SelectValueProps> = (props) => {
  return <SelectPrimitive.Value {...props} />;
};

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  className,
  size = 'default',
  children,
  ...props
}) => {
  const baseClasses =
    'flex w-full items-center justify-between whitespace-nowrap rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:ring-offset-gray-900 dark:placeholder:text-gray-400 dark:focus:ring-blue-400';
  const sizeClass = size === 'sm' ? 'h-8' : 'h-9';
  const combinedClasses = [baseClasses, sizeClass, className].filter(Boolean).join(' ');

  return (
    <SelectPrimitive.Trigger className={combinedClasses} {...props}>
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
};

export const SelectContent: React.FC<SelectContentProps> = ({
  className,
  children,
  position = 'popper',
  ...props
}) => {
  const baseClasses =
    'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50';
  const positionClass =
    position === 'popper'
      ? 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1'
      : '';
  const combinedClasses = [baseClasses, positionClass, className].filter(Boolean).join(' ');

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className={combinedClasses} position={position} {...props}>
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
};

export const SelectLabel: React.FC<SelectLabelProps> = ({ className, ...props }) => {
  const baseClasses = 'px-2 py-1.5 text-sm font-semibold';
  const combinedClasses = [baseClasses, className].filter(Boolean).join(' ');

  return <SelectPrimitive.Label className={combinedClasses} {...props} />;
};

export const SelectItem: React.FC<SelectItemProps> = ({ className, children, ...props }) => {
  const baseClasses =
    'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50';
  const combinedClasses = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <SelectPrimitive.Item className={combinedClasses} {...props}>
      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
};

export const SelectSeparator: React.FC<SelectSeparatorProps> = ({ className, ...props }) => {
  const baseClasses = '-mx-1 my-1 h-px bg-gray-100 dark:bg-gray-800';
  const combinedClasses = [baseClasses, className].filter(Boolean).join(' ');

  return <SelectPrimitive.Separator className={combinedClasses} {...props} />;
};

export const SelectScrollUpButton: React.FC<SelectScrollButtonProps> = ({
  className,
  ...props
}) => {
  const baseClasses = 'flex cursor-default items-center justify-center py-1';
  const combinedClasses = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <SelectPrimitive.ScrollUpButton className={combinedClasses} {...props}>
      <ChevronUp className="h-4 w-4" />
    </SelectPrimitive.ScrollUpButton>
  );
};

export const SelectScrollDownButton: React.FC<SelectScrollButtonProps> = ({
  className,
  ...props
}) => {
  const baseClasses = 'flex cursor-default items-center justify-center py-1';
  const combinedClasses = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <SelectPrimitive.ScrollDownButton className={combinedClasses} {...props}>
      <ChevronDown className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>
  );
};
