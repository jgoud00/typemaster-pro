'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, Monitor, Keyboard, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useSettingsStore } from '@/stores/settings-store';
import { useProgressStore } from '@/stores/progress-store';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { settings, updateSetting, resetSettings } = useSettingsStore();
    const { exportData, importData, resetProgress } = useProgressStore();
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            const success = importData(content);
            if (success) {
                toast.success('Data imported successfully!');
            } else {
                toast.error('Failed to import data. Invalid format.');
            }
        };
        reader.readAsText(file);
    };

    const handleResetData = () => {
        resetProgress();
        resetSettings();
        setShowResetConfirm(false);
        toast.success('All data has been cleared');
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-xl font-bold">⚙️ Settings</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
                {/* Sound Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Volume2 className="w-5 h-5 text-blue-500" />
                            <h2 className="text-xl font-semibold">Sound</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Keystroke Sounds</div>
                                    <div className="text-sm text-muted-foreground">
                                        Play sound on each keypress
                                    </div>
                                </div>
                                <Switch
                                    checked={settings.keystrokeSounds}
                                    onCheckedChange={(checked) => updateSetting('keystrokeSounds', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Achievement Sounds</div>
                                    <div className="text-sm text-muted-foreground">
                                        Play sound when unlocking achievements
                                    </div>
                                </div>
                                <Switch
                                    checked={settings.achievementSounds}
                                    onCheckedChange={(checked) => updateSetting('achievementSounds', checked)}
                                />
                            </div>

                            <div>
                                <div className="font-medium mb-3">Volume: {settings.volume}%</div>
                                <Slider
                                    value={[settings.volume]}
                                    max={100}
                                    step={1}
                                    onValueChange={(value) => updateSetting('volume', value[0])}
                                />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Display Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Monitor className="w-5 h-5 text-green-500" />
                            <h2 className="text-xl font-semibold">Display</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Show Virtual Keyboard</div>
                                    <div className="text-sm text-muted-foreground">
                                        Display keyboard helper during lessons
                                    </div>
                                </div>
                                <Switch
                                    checked={settings.showVirtualKeyboard}
                                    onCheckedChange={(checked) => updateSetting('showVirtualKeyboard', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Show Finger Hints</div>
                                    <div className="text-sm text-muted-foreground">
                                        Highlight which finger to use
                                    </div>
                                </div>
                                <Switch
                                    checked={settings.showFingerHints}
                                    onCheckedChange={(checked) => updateSetting('showFingerHints', checked)}
                                />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Typing Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Keyboard className="w-5 h-5 text-purple-500" />
                            <h2 className="text-xl font-semibold">Typing</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Smooth Caret</div>
                                    <div className="text-sm text-muted-foreground">
                                        Animated cursor movement
                                    </div>
                                </div>
                                <Switch
                                    checked={settings.smoothCaret}
                                    onCheckedChange={(checked) => updateSetting('smoothCaret', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Quick Restart</div>
                                    <div className="text-sm text-muted-foreground">
                                        Press Tab to restart lesson
                                    </div>
                                </div>
                                <Switch
                                    checked={settings.quickRestart}
                                    onCheckedChange={(checked) => updateSetting('quickRestart', checked)}
                                />
                            </div>

                            <div>
                                <div className="font-medium mb-3">Font Size</div>
                                <div className="flex gap-2">
                                    {(['small', 'medium', 'large'] as const).map((size) => (
                                        <Button
                                            key={size}
                                            variant={settings.fontSize === size ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => updateSetting('fontSize', size)}
                                            className="capitalize"
                                        >
                                            {size}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Privacy & Data */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-5 h-5 text-orange-500" />
                            <h2 className="text-xl font-semibold">Privacy & Data</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <div>
                                    <div className="font-medium">Save Progress Locally</div>
                                    <div className="text-sm text-muted-foreground">
                                        Your data is stored in browser (always on)
                                    </div>
                                </div>
                                <Switch checked disabled />
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => exportData()}
                            >
                                📥 Export Your Data
                            </Button>

                            <input
                                type="file"
                                ref={fileInputRef}
                                accept=".json"
                                className="hidden"
                                onChange={handleImport}
                            />
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                📤 Import Data
                            </Button>

                            {!showResetConfirm ? (
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => setShowResetConfirm(true)}
                                >
                                    🗑️ Clear All Data
                                </Button>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-sm text-center text-destructive">
                                        Are you sure? This cannot be undone!
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => setShowResetConfirm(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="flex-1"
                                            onClick={handleResetData}
                                        >
                                            Yes, Clear All
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}
