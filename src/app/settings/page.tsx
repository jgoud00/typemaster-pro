'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, Monitor, Keyboard, Shield, Download, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useSettingsStore } from '@/stores/settings-store';
import { useProgressStore } from '@/stores/progress-store';
import { downloadUserData, getStoredDataSummary, deleteAllUserData } from '@/lib/gdpr-export';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { settings, updateSetting, resetSettings } = useSettingsStore();
    const { exportData, importData, resetProgress } = useProgressStore();
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [dataSummary, setDataSummary] = useState<{ key: string; size: number; description: string }[]>([]);

    // Fetch data summary on client side only
    useEffect(() => {
        setDataSummary(getStoredDataSummary());
    }, []);

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
            <header className="glass-header">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-xl font-bold">⚙️ Settings</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Volume2 className="w-5 h-5 text-blue-500" />
                            <h2 className="text-xl font-semibold">Sound & Immersion</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Master Volume</div>
                                    <div className="text-sm text-muted-foreground">
                                        {settings.volume}%
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <Slider
                                        value={[settings.volume]}
                                        max={100}
                                        step={1}
                                        onValueChange={(value) => updateSetting('volume', value[0])}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="font-medium mb-3">Sound Profile</div>
                                <div className="grid grid-cols-4 gap-2">
                                    {(['mechanical', 'typewriter', 'digital', 'none'] as const).map((profile) => (
                                        <Button
                                            key={profile}
                                            variant={settings.keyboardSound === profile ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => updateSetting('keyboardSound', profile)}
                                            className="capitalize"
                                        >
                                            {profile}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Events</div>
                                    <div className="text-sm text-muted-foreground">
                                        Toggle specific sounds
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id="ach-sounds"
                                            checked={settings.achievementSounds}
                                            onCheckedChange={(checked) => updateSetting('achievementSounds', checked)}
                                        />
                                        <label htmlFor="ach-sounds" className="text-sm">Achievements</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Display & Typing Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Monitor className="w-5 h-5 text-green-500" />
                            <h2 className="text-xl font-semibold">Visual Customization</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="font-medium mb-3">Cursor Style</div>
                                <div className="grid grid-cols-4 gap-2">
                                    {(['line', 'block', 'underline', 'bar'] as const).map((style) => (
                                        <Button
                                            key={style}
                                            variant={settings.cursorStyle === style ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => updateSetting('cursorStyle', style)}
                                            className="capitalize"
                                        >
                                            {style}
                                        </Button>
                                    ))}
                                </div>
                            </div>

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
                                    <div className="font-medium">Show Virtual Keyboard</div>
                                </div>
                                <Switch
                                    checked={settings.showVirtualKeyboard}
                                    onCheckedChange={(checked) => updateSetting('showVirtualKeyboard', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Font Size</div>
                                </div>
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

                {/* Keyboard Layout Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Keyboard className="w-5 h-5 text-cyan-500" />
                            <h2 className="text-xl font-semibold">Keyboard Layout & Focus</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="font-medium mb-3">Keyboard Layout</div>
                                <div className="flex flex-wrap gap-2">
                                    {(['qwerty', 'dvorak', 'colemak', 'azerty'] as const).map((layout) => (
                                        <Button
                                            key={layout}
                                            variant={settings.keyboardLayout === layout ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => updateSetting('keyboardLayout', layout)}
                                            className="uppercase"
                                        >
                                            {layout}
                                        </Button>
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Virtual keyboard and finger hints will adapt to your layout
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Focus Mode</div>
                                    <div className="text-sm text-muted-foreground">
                                        Practice only your 3 weakest keys
                                    </div>
                                </div>
                                <Switch
                                    checked={settings.focusModeEnabled}
                                    onCheckedChange={(checked) => updateSetting('focusModeEnabled', checked)}
                                />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Privacy & Data (GDPR Compliant) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-5 h-5 text-orange-500" />
                            <h2 className="text-xl font-semibold">Privacy & Data</h2>
                            <span className="ml-auto text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">
                                GDPR Compliant
                            </span>
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

                            {/* Data Summary */}
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4" />
                                    <span className="font-medium text-sm">Your Data Summary</span>
                                </div>
                                <div className="text-xs text-muted-foreground space-y-1">
                                    {dataSummary.slice(0, 4).map((item) => (
                                        <div key={item.key} className="flex justify-between">
                                            <span>{item.description.slice(0, 35)}...</span>
                                            <span>{(item.size / 1024).toFixed(1)} KB</span>
                                        </div>
                                    ))}
                                    {dataSummary.length > 4 && (
                                        <div className="text-muted-foreground/70">
                                            +{dataSummary.length - 4} more categories
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* GDPR Full Export */}
                            <Button
                                variant="default"
                                className="w-full gap-2"
                                onClick={() => {
                                    downloadUserData();
                                    toast.success('Full data export downloaded!');
                                }}
                            >
                                <Download className="w-4 h-4" />
                                Download All My Data (GDPR)
                            </Button>

                            {/* Basic Progress Export */}
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => exportData()}
                            >
                                📥 Export Progress Only
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
                                    🗑️ Delete All My Data
                                </Button>
                            ) : (
                                <div className="space-y-2 p-3 border border-destructive/50 rounded-lg">
                                    <p className="text-sm text-center text-destructive font-medium">
                                        ⚠️ This will permanently delete ALL your data!
                                    </p>
                                    <p className="text-xs text-center text-muted-foreground">
                                        We recommend downloading your data first.
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
                                            onClick={() => {
                                                deleteAllUserData();
                                                resetProgress();
                                                resetSettings();
                                                setShowResetConfirm(false);
                                                toast.success('All data has been deleted');
                                            }}
                                        >
                                            Yes, Delete All
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
