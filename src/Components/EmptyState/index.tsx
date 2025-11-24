import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/Components/Button';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    action,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-muted/30 p-4 rounded-full mb-4">
                <Icon className="size-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
            {action && (
                <Button onClick={action.onClick} className="rounded-full">
                    {action.label}
                </Button>
            )}
        </div>
    );
};
