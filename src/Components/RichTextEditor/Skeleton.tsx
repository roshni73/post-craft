import { Skeleton } from '@/Components/Skeleton';

export const RichTextEditorSkeleton = () => {
    return (
        <div className="border border-input rounded-md overflow-hidden">
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-input bg-muted/20">
                <div className="flex gap-1 pr-2 border-r border-input/50">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-8 w-8 rounded-md" />
                    ))}
                </div>
                <div className="flex gap-1 pr-2 border-r border-input/50">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-8 w-8 rounded-md" />
                    ))}
                </div>
                <div className="flex-1" />
            </div>
            <Skeleton className="h-[300px] w-full rounded-none" />
        </div>
    );
};
