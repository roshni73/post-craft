import { lazy, Suspense } from 'react';
import { RichTextEditorSkeleton } from './Skeleton';

const RichTextEditorComponent = lazy(() =>
  import('./index').then((module) => ({ default: module.RichTextEditor }))
);

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const RichTextEditor = (props: RichTextEditorProps) => {
  return (
    <Suspense fallback={<RichTextEditorSkeleton />}>
      <RichTextEditorComponent {...props} />
    </Suspense>
  );
};
