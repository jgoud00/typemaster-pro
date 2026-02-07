import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
    action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="text-center py-12 px-4">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {description}
            </p>
            {action}
        </div>
    );
}

// Pre-built empty states for common scenarios
export function NoStatsEmptyState({ onAction }: { onAction?: () => void }) {
    return (
        <EmptyState
            icon="📊"
            title="No Statistics Yet"
            description="Complete your first lesson to start tracking your progress!"
            action={
                onAction && (
                    <Button onClick={onAction}>
                        Start First Lesson
                    </Button>
                )
            }
        />
    );
}

export function NoAchievementsEmptyState() {
    return (
        <EmptyState
            icon="🏆"
            title="No Achievements Yet"
            description="Keep practicing to unlock your first achievement!"
        />
    );
}

export function NoRecordsEmptyState() {
    return (
        <EmptyState
            icon="📝"
            title="No Practice Records"
            description="Complete some practice sessions to see your history here."
        />
    );
}
