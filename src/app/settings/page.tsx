'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, Monitor, Keyboard, Shield, Download, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useSettingsStore } from '@/stores/settings-store';
import { useProgressStore } from '@/stores/progress-store';
import toast from 'react-hot-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

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

                            <div className="pt-2">
                                <div className="font-medium mb-3">Language (Corpus)</div>
                                <div className="flex flex-wrap gap-2">
                                    {(['en', 'es'] as const).map((lang) => (
                                        <Button
                                            key={lang}
                                            variant={settings.language === lang ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => updateSetting('language', lang)}
                                            className="uppercase"
                                        >
                                            {lang === 'en' ? 'English' : 'Español'}
                                        </Button>
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Practice texts and algorithms will switch to the selected language
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

                {/* Privacy & Data */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
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
                                variant="default"
                                className="w-full gap-2"
                                onClick={() => {
                                    exportData();
                                    toast.success('Data export downloaded!');
                                }}
                            >
                                <Download className="w-4 h-4" />
                                Export My Data
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

                            {/* Danger Zone */}
                            <div className="border border-red-900/40 bg-red-950/20 rounded-xl p-4 mt-8">
                                <div className="text-red-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Danger Zone
                                </div>
                                <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" className="w-full">
                                            🗑️ Delete All My Data
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription>
                                                This will permanently delete ALL your data! We recommend downloading your data first.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter className="mt-4">
                                            <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
                                                Cancel
                                            </Button>
                                            <Button variant="destructive" onClick={handleResetData}>
                                                Yes, Delete All
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}
