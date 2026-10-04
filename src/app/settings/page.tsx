'use client';
import { PageHeader } from '@/components/ui/page-header';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Volume2, Monitor, Keyboard, Shield, Download, AlertTriangle } from 'lucide-react';
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
} from '@/components/ui/dialog';

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
    <div className="min-h-full ">
      <main className="preferences-page container mx-auto px-4 py-8 max-w-4xl space-y-6 settings-content">
        <PageHeader
          title="Make this space yours."
          description="Fine-tune your typing experience, from the sound of each key to how you track your progress."
          badge={
            <span className="text-[10px] tracking-[.18em] text-muted-foreground">
              YOUR PREFERENCES
            </span>
          }
        />
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold">Workspace theme</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose a palette that feels like you.
              </p>
            </div>
            <select
              aria-label="Workspace theme"
              value={settings.theme}
              onChange={(e) => updateSetting('theme', e.target.value as typeof settings.theme)}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
            >
              <option value="light">Clear glass</option>
              <option value="dark">Smoked glass</option>
            </select>
          </div>
        </Card>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 bg-card border border-border shadow-sm rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Volume2 className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Sound & Immersion</h2>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-medium">Master Volume</div>
                  <div className="text-sm text-muted-foreground">{settings.volume}%</div>
                </div>
                <div className="w-full sm:w-1/2">
                  <Slider
                    aria-label="Volume"
                    value={[settings.volume]}
                    max={100}
                    step={1}
                    onValueChange={(value) => updateSetting('volume', value[0])}
                  />
                </div>
              </div>

              <div>
                <div className="font-medium mb-3">Sound Profile</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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

              <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-medium">Events</div>
                  <div className="text-sm text-muted-foreground">Toggle specific sounds</div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      aria-label="Events"
                      id="ach-sounds"
                      checked={settings.achievementSounds}
                      onCheckedChange={(checked) => updateSetting('achievementSounds', checked)}
                    />
                    <label htmlFor="ach-sounds" className="text-sm">
                      Achievements
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Display & Typing Settings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <Card className="p-6 bg-card border border-border shadow-sm rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Monitor className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Visual Customization</h2>
            </div>

            <div className="space-y-6">
              <div>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div><label htmlFor="stop-on-error" className="font-medium">Stop on errors</label><p className="text-sm text-muted-foreground">Keep the cursor on a mistake until you press the correct key.</p></div>
                  <Switch id="stop-on-error" aria-label="Stop on errors" checked={settings.stopOnError ?? true} onCheckedChange={checked => updateSetting('stopOnError', checked)} />
                </div>
                <div className="font-medium mb-3">Cursor Style</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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

              <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-medium">Smooth Caret</div>
                  <div className="text-sm text-muted-foreground">Animated cursor movement</div>
                </div>
                <Switch
                  aria-label="Smooth Caret"
                  checked={settings.smoothCaret}
                  onCheckedChange={(checked) => updateSetting('smoothCaret', checked)}
                />
              </div>

              <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-medium">Show Virtual Keyboard</div>
                </div>
                <Switch
                  aria-label="Show Virtual Keyboard"
                  checked={settings.showVirtualKeyboard}
                  onCheckedChange={(checked) => updateSetting('showVirtualKeyboard', checked)}
                />
              </div>

              <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-medium">Font Size</div>
                </div>
                <div className="flex flex-wrap gap-2">
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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="p-6 bg-card border border-border shadow-sm rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Keyboard className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Keyboard Layout & Focus</h2>
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

              <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-medium">Focus Mode</div>
                  <div className="text-sm text-muted-foreground">
                    Practice only your 3 weakest keys
                  </div>
                </div>
                <Switch
                  aria-label="Focus Mode"
                  checked={settings.focusModeEnabled}
                  onCheckedChange={(checked) => updateSetting('focusModeEnabled', checked)}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Privacy & Data */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-card border border-border shadow-sm rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Privacy & Data</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/60 border border-border rounded-xl">
                <div>
                  <div className="font-medium">Save Progress Locally</div>
                  <div className="text-sm text-muted-foreground">
                    Your data is stored in browser (always on)
                  </div>
                </div>
                <Switch checked disabled aria-label="Save progress locally" />
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
                Import Data
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
                      Reset local progress
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This resets your local progress and preferences. Export your progress first if you want to keep a copy.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleResetData}>
                        Reset progress
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
