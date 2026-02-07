'use client';

import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface ShareButtonsProps {
    url?: string;
    title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.origin : '');
    const shareText = `${title}\n\nTry TypeMaster Pro: ${shareUrl}`;

    const shareToTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(twitterUrl, '_blank');
    };

    const shareToFacebook = () => {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(fbUrl, '_blank');
    };

    const shareToReddit = () => {
        const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`;
        window.open(redditUrl, '_blank');
    };

    const copyLink = () => {
        navigator.clipboard.writeText(shareText);
        toast.success('Copied to clipboard!', { id: 'copy-link' });
    };

    return (
        <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={shareToTwitter}>
                🐦 Twitter
            </Button>
            <Button variant="outline" size="sm" onClick={shareToFacebook}>
                📘 Facebook
            </Button>
            <Button variant="outline" size="sm" onClick={shareToReddit}>
                🔴 Reddit
            </Button>
            <Button variant="outline" size="sm" onClick={copyLink}>
                📋 Copy Link
            </Button>
        </div>
    );
}
