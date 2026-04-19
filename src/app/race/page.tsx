import { RaceMode } from '@/components/multiplayer/RaceMode';

export default function RacePage() {
    return (
        <div className="min-h-screen container pt-20">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Speed Race</h1>
                    <p className="text-muted-foreground mt-2">Challenge your friends to a real-time typing match.</p>
                </div>
                <RaceMode />
            </div>
        </div>
    );
}
