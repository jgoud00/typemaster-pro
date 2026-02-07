'use client';

import { useSound } from '@/hooks/use-sound';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SoundType } from '@/lib/sound-engine';

export function SoundSettings() {
    const { settings, isLoaded, play, updateSettings, toggleEnabled } = useSound();

    if (!isLoaded) {
        return null;
    }

    const testSound = (type: SoundType) => {
        play(type);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Sound Settings
                </CardTitle>
                <CardDescription>Customize audio feedback while typing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Master Toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {settings.enabled ? (
                            <Volume2 className="w-5 h-5 text-primary" />
                        ) : (
                            <VolumeX className="w-5 h-5 text-muted-foreground" />
                        )}
                        <Label htmlFor="sound-enabled">Sound Effects</Label>
                    </div>
                    <Switch
                        id="sound-enabled"
                        checked={settings.enabled}
                        onCheckedChange={toggleEnabled}
                    />
                </div>

                {/* Volume Slider */}
                <div className="space-y-2">
                    <Label>Volume</Label>
                    <div className="flex items-center gap-4">
                        <Slider
                            value={[settings.volume * 100]}
                            onValueChange={([value]) => updateSettings({ volume: value / 100 })}
                            max={100}
                            step={5}
                            disabled={!settings.enabled}
                            className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground w-12">
                            {Math.round(settings.volume * 100)}%
                        </span>
                    </div>
                </div>

                {/* Individual Toggles */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="keystroke-sounds">Keystroke Sounds</Label>
                            <p className="text-sm text-muted-foreground">Play a sound on each keypress</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => testSound('keystroke')}
                                disabled={!settings.enabled || !settings.keystrokeSounds}
                            >
                                Test
                            </Button>
                            <Switch
                                id="keystroke-sounds"
                                checked={settings.keystrokeSounds}
                                onCheckedChange={(checked) => updateSettings({ keystrokeSounds: checked })}
                                disabled={!settings.enabled}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="error-sounds">Error Sounds</Label>
                            <p className="text-sm text-muted-foreground">Play a sound on typing errors</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => testSound('error')}
                                disabled={!settings.enabled || !settings.errorSounds}
                            >
                                Test
                            </Button>
                            <Switch
                                id="error-sounds"
                                checked={settings.errorSounds}
                                onCheckedChange={(checked) => updateSettings({ errorSounds: checked })}
                                disabled={!settings.enabled}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="combo-sounds">Combo Sounds</Label>
                            <p className="text-sm text-muted-foreground">Play chimes on combo milestones</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => testSound('combo-2')}
                                disabled={!settings.enabled || !settings.comboSounds}
                            >
                                Test
                            </Button>
                            <Switch
                                id="combo-sounds"
                                checked={settings.comboSounds}
                                onCheckedChange={(checked) => updateSettings({ comboSounds: checked })}
                                disabled={!settings.enabled}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="completion-sounds">Completion Sounds</Label>
                            <p className="text-sm text-muted-foreground">Play a fanfare on lesson completion</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => testSound('complete')}
                                disabled={!settings.enabled || !settings.completionSounds}
                            >
                                Test
                            </Button>
                            <Switch
                                id="completion-sounds"
                                checked={settings.completionSounds}
                                onCheckedChange={(checked) => updateSettings({ completionSounds: checked })}
                                disabled={!settings.enabled}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
