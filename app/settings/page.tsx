"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  Shield,
  Palette,
  Database,
  LogOut,
  Moon,
  Sun,
  Monitor,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [settings, setSettings] = useState({
    autoSaveEnabled: true,
    activityLoggingEnabled: true,
    notificationsEnabled: true,
    darkMode: theme || "system",
    defaultModel: "GPT-4o",
    maxContextWindow: 8192,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Settings saved successfully");
    setIsSaving(false);
  };

  const handleThemeChange = (nextTheme: string) => {
    setSettings({ ...settings, darkMode: nextTheme });
    setTheme(nextTheme as "light" | "dark" | "system");
    toast.success(`Theme changed to ${nextTheme}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Settings
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Configure application preferences and behavior
              </p>
            </div>
          </div>
          <Link href="/config">
            <Button variant="outline" className="rounded-full">
              Models
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how the application looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                  Theme
                </label>
                <RadioGroup
                  value={settings.darkMode}
                  onValueChange={(value: string) => handleThemeChange(value)}
                >
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                    <RadioGroupItem value="light" id="light-theme" />
                    <label
                      htmlFor="light-theme"
                      className="flex-1 cursor-pointer flex items-center gap-2"
                    >
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>Light</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                    <RadioGroupItem value="dark" id="dark-theme" />
                    <label
                      htmlFor="dark-theme"
                      className="flex-1 cursor-pointer flex items-center gap-2"
                    >
                      <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      <span>Dark</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                    <RadioGroupItem value="system" id="system-theme" />
                    <label
                      htmlFor="system-theme"
                      className="flex-1 cursor-pointer flex items-center gap-2"
                    >
                      <Monitor className="w-4 h-4 text-blue-500" />
                      <span>System</span>
                    </label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Feature Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Features & Behavior
              </CardTitle>
              <CardDescription>
                Enable or disable application features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Auto-save
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Automatically save conversations
                  </p>
                </div>
                <Switch
                  checked={settings.autoSaveEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoSaveEnabled: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Activity Logging
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Track user interactions and events
                  </p>
                </div>
                <Switch
                  checked={settings.activityLoggingEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      activityLoggingEnabled: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Notifications
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Receive alerts for important events
                  </p>
                </div>
                <Switch
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notificationsEnabled: checked,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Model Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Model Configuration
              </CardTitle>
              <CardDescription>
                Set default AI model and context window
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Default AI Model
                </label>
                <Select
                  value={settings.defaultModel}
                  onValueChange={(value) =>
                    setSettings({ ...settings, defaultModel: value })
                  }
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GPT-4o">GPT-4o</SelectItem>
                    <SelectItem value="GPT-4.1">GPT-4.1</SelectItem>
                    <SelectItem value="Claude Sonnet">Claude Sonnet</SelectItem>
                    <SelectItem value="Claude 3.7 Sonnet">
                      Claude 3.7 Sonnet
                    </SelectItem>
                    <SelectItem value="Gemini 2.0 Flash">
                      Gemini 2.0 Flash
                    </SelectItem>
                    <SelectItem value="Llama 3.3 70B">Llama 3.3 70B</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Max Context Window
                </label>
                <Input
                  type="number"
                  value={settings.maxContextWindow}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxContextWindow: parseInt(e.target.value) || 8192,
                    })
                  }
                  className="rounded-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-900/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <Shield className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Permanently delete data or reset settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full rounded-lg border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                onClick={() => {
                  toast.success("Settings reset to defaults");
                }}
              >
                Reset to Defaults
              </Button>
              <Button
                variant="destructive"
                className="w-full rounded-lg gap-2"
                onClick={() => {
                  toast.success("Signed out successfully");
                  router.push("/");
                }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="rounded-lg gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
