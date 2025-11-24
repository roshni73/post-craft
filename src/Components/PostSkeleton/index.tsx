import { Skeleton } from '@/Components/Skeleton';

export function PostSkeleton() {
    return (
        <div className="flex flex-col h-full bg-card rounded-2xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-24 rounded-md" />
                <Skeleton className="size-4 rounded-full" />
            </div>
            <Skeleton className="h-8 w-3/4 mb-3" />
            <div className="space-y-2 mb-6 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border/30 mt-auto">
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-1">
                    <Skeleton className="size-8 rounded-full" />
                    <Skeleton className="size-8 rounded-full" />
                </div>
            </div>
        </div>
    );
}
