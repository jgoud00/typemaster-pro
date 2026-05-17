'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SmartPracticeRedirect() {
    const router = useRouter();

    useEffect(() => {
        toast('Smart practice coming soon', { icon: '🚧' });
        router.replace('/practice?mode=free');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-pulse text-muted-foreground">Redirecting...</div>
        </div>
    );
}
