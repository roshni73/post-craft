'use client';

import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { Button } from '../Button';

function mergeClasses(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function AlertDialog(props: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root {...props} />;
}

export function AlertDialogTrigger(
  props: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>
) {
  return <AlertDialogPrimitive.Trigger {...props} />;
}

export function AlertDialogPortal(props: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal {...props} />;
}

export function AlertDialogOverlay({
  className = '',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      className={mergeClasses(
        'fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out',
        className
      )}
      {...props}
    />
  );
}

export function AlertDialogContent({
  className = '',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        className={mergeClasses(
          'fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background text-foreground p-6 shadow-lg',
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

export function AlertDialogHeader({ className = '', ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={mergeClasses('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  );
}

export function AlertDialogFooter({ className = '', ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={mergeClasses('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}

export function AlertDialogTitle({
  className = '',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      className={mergeClasses('text-lg font-semibold', className)}
      {...props}
    />
  );
}

export function AlertDialogDescription({
  className = '',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={mergeClasses('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export function AlertDialogAction({
  className = '',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action asChild>
      <Button className={className} {...props} />
    </AlertDialogPrimitive.Action>
  );
}

export function AlertDialogCancel({
  className = '',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel asChild>
      <Button variant="outline" className={className} {...props} />
    </AlertDialogPrimitive.Cancel>
  );
}
