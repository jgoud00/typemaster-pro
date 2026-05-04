'use client';

import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

import { SHARE_URLS, buildShareUrl } from '@/lib/config/constants';

interface ShareButtonsProps {
    url?: string;
    title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.origin : '');
    const shareText = `${title}\n\nTry Aloo Type: ${shareUrl}`;

    const shareToTwitter = () => {
        const twitterUrl = buildShareUrl(SHARE_URLS.TWITTER, shareText, shareUrl);
        window.open(twitterUrl, '_blank');
    };

    const shareToFacebook = () => {
        const fbUrl = buildShareUrl(SHARE_URLS.FACEBOOK, shareText, shareUrl);
        window.open(fbUrl, '_blank');
    };

    const shareToReddit = () => {
        const redditUrl = buildShareUrl(SHARE_URLS.REDDIT, title, shareUrl);
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
