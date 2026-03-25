"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Brain,
  Rocket,
  Bot,
  Wand2,
  Gauge,
  Workflow,
  Sparkles,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Check,
  Copy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { AIModelConfig, ModelName } from "../page.types";

type AIModelConfigState = Omit<AIModelConfig, "id" | "createdAt">;

const MODEL_ICONS: Record<ModelName, React.ReactNode> = {
  "GPT-5.3-Codex": <Sparkles className="w-4 h-4" />,
  "GPT-4.1": <Brain className="w-4 h-4" />,
  "GPT-4o": <Rocket className="w-4 h-4" />,
  "Claude Sonnet": <Bot className="w-4 h-4" />,
  "Claude 3.7 Sonnet": <Wand2 className="w-4 h-4" />,
  "Gemini 2.0 Flash": <Gauge className="w-4 h-4" />,
  "Llama 3.3 70B": <Workflow className="w-4 h-4" />,
};

const PROVIDERS = ["OpenAI", "Anthropic", "Google", "Meta", "Other"] as const;

export default function ConfigPage() {
  const router = useRouter();
  const [configs, setConfigs] = useState<AIModelConfig[]>([
    {
      id: "1",
      modelName: "GPT-4o",
      provider: "OpenAI",
      apiKey: "sk-proj-••••••••••••••••••••",
      maxTokens: 8192,
      isActive: true,
      createdAt: new Date(),
    },
  ]);

  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<AIModelConfigState>({
    modelName: "GPT-4o",
    provider: "OpenAI",
    apiKey: "",
    apiUrl: "",
    maxTokens: 8192,
    isActive: true,
  });

  const handleAddModel = () => {
    if (!formData.apiKey.trim()) {
      toast.error("API Key is required");
      return;
    }

    const newConfig: AIModelConfig = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date(),
    };

    setConfigs([...configs, newConfig]);
    toast.success(`${formData.modelName} added successfully`);
    setFormData({
      modelName: "GPT-4o",
      provider: "OpenAI",
      apiKey: "",
      apiUrl: "",
      maxTokens: 8192,
      isActive: true,
    });
    setIsDialogOpen(false);
  };

  const handleToggleActive = (id: string) => {
    setConfigs(
      configs.map((config) =>
        config.id === id ? { ...config, isActive: !config.isActive } : config
      )
    );
    toast.success("Model status updated");
  };

  const handleDeleteConfig = (id: string) => {
    setConfigs(configs.filter((config) => config.id !== id));
    toast.success("Model configuration removed");
  };

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API Key copied to clipboard");
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return "••••••••";
    return key.slice(0, 4) + "••••••••" + key.slice(-4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
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
                AI Models Configuration
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Manage your AI model API keys and settings
              </p>
            </div>
          </div>
          <Link href="/settings">
            <Button variant="outline" className="rounded-full">
              Settings
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Add Model Button */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Configured Models
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Total: {configs.length} model{configs.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full gap-2">
                <Plus className="w-4 h-4" />
                Add Model
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add AI Model Configuration</DialogTitle>
                <DialogDescription>
                  Add a new AI model with its API credentials
                </DialogDescription>
              </DialogHeader>

              {/* Model Selection */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    AI Model
                  </label>
                  <Select
                    value={formData.modelName}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        modelName: value as ModelName,
                      })
                    }
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(MODEL_ICONS).map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Provider */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Provider
                  </label>
                  <Select
                    value={formData.provider}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        provider: value as "OpenAI" | "Anthropic" | "Google" | "Meta" | "Other",
                      })
                    }
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVIDERS.map((provider) => (
                        <SelectItem key={provider} value={provider}>
                          {provider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* API Key */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    API Key *
                  </label>
                  <Input
                    type="password"
                    placeholder="sk-proj-..."
                    value={formData.apiKey}
                    onChange={(e) =>
                      setFormData({ ...formData, apiKey: e.target.value })
                    }
                    className="rounded-lg"
                  />
                </div>

                {/* API URL */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    API URL (optional)
                  </label>
                  <Input
                    type="url"
                    placeholder="https://api.openai.com/v1"
                    value={formData.apiUrl || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, apiUrl: e.target.value })
                    }
                    className="rounded-lg"
                  />
                </div>

                {/* Max Tokens */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Max Tokens
                  </label>
                  <Input
                    type="number"
                    placeholder="8192"
                    value={formData.maxTokens || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxTokens: parseInt(e.target.value) || 8192,
                      })
                    }
                    className="rounded-lg"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddModel}
                  className="flex-1 rounded-lg gap-2"
                >
                  <Check className="w-4 h-4" />
                  Add Model
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Models List */}
        <div className="space-y-4">
          {configs.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <Brain className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <p className="text-slate-600 dark:text-slate-400">
                  No AI models configured yet
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  Add your first AI model to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            configs.map((config) => (
              <Card
                key={config.id}
                className={`transition-all ${
                  config.isActive
                    ? "border-slate-200 dark:border-slate-700"
                    : "border-slate-200 dark:border-slate-700 opacity-60"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    {/* Model Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                          {MODEL_ICONS[config.modelName]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {config.modelName}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {config.provider}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* API Key Display */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                          API Key
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-mono break-all">
                            {showKeyId === config.id
                              ? config.apiKey
                              : maskApiKey(config.apiKey)}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setShowKeyId(
                                showKeyId === config.id ? null : config.id
                              )
                            }
                            className="rounded-lg"
                          >
                            {showKeyId === config.id ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopyApiKey(config.apiKey)}
                            className="rounded-lg"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        {config.apiUrl && (
                          <div>
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                              API URL
                            </p>
                            <p className="text-sm text-slate-900 dark:text-white break-all">
                              {config.apiUrl}
                            </p>
                          </div>
                        )}
                        {config.maxTokens && (
                          <div>
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                              Max Tokens
                            </p>
                            <p className="text-sm text-slate-900 dark:text-white">
                              {config.maxTokens.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant={config.isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleActive(config.id)}
                        className="rounded-lg"
                      >
                        {config.isActive ? "Active" : "Inactive"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteConfig(config.id)}
                        className="rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
