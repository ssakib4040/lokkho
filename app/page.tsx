"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bot,
  Brain,
  CheckCircle2,
  CircleCheck,
  ClipboardList,
  Code2,
  Clock3,
  CreditCard,
  Database,
  FilePlus2,
  FileText,
  Gauge,
  ListTodo,
  LogOut,
  Loader2,
  Play,
  Plus,
  RefreshCcw,
  Rocket,
  Search,
  Settings,
  Sparkles,
  StopCircle,
  Trash2,
  Upload,
  UserCircle2,
  Wand2,
  Workflow,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  ActivityItem,
  AgentJob,
  ChatMessage,
  Conversation,
  DocumentItem,
  MemoryItem,
  ModelName,
  AgentMessageType,
  TimeRange,
  UsageStats,
  WorkspaceFormState,
} from "./page.types";

const templates = [
  "Draft go-to-market messaging for an AI collaboration product.",
  "Turn customer interview notes into a prioritized backlog.",
  "Prepare a concise architecture brief for investors.",
  "Design onboarding prompts for first-time team admins.",
];

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
}

function simulateAssistant(prompt: string): string {
  const normalized = prompt.toLowerCase();
  if (normalized.includes("pricing")) {
    return "Use seat-based pricing plus usage credits. Add clear overage alerts and workspace-level spend caps in the first release.";
  }
  if (normalized.includes("agent") || normalized.includes("automation")) {
    return "Ship three default automations first: daily digest, support triage, and release note draft generation with human approval.";
  }
  if (normalized.includes("memory")) {
    return "Expose memory controls inline in chat so users can add, edit, and forget context without switching screens.";
  }
  return "Scope looks strong. Next step is a vertical slice: one chat flow, one memory CRUD path, and one analytics report with real data.";
}

function buildAgentMessages(
  prompt: string,
): Array<Omit<ChatMessage, "id" | "role">> {
  const answer = simulateAssistant(prompt);
  const base: Array<Omit<ChatMessage, "id" | "role">> = [
    {
      text: answer,
      messageType: "regular",
    },
    {
      text: "Execution status updated.",
      messageType: "status",
    },
    {
      text: "Task: finalize workspace role permissions matrix.",
      messageType: "task",
    },
    {
      text: "Delivery progress is currently healthy.",
      messageType: "progress",
      progress: {
        label: "MVP completion",
        value: 62,
        eta: "ETA 4 days",
      },
    },
    {
      text: "Next tasks to unblock release",
      messageType: "tasks",
      tasks: [
        { id: "t-1", label: "Finalize onboarding flow", done: true },
        { id: "t-2", label: "Add usage quota warnings", done: false },
        { id: "t-3", label: "Ship billing settings page", done: false },
      ],
    },
    {
      text: "Recommended decision",
      messageType: "decision",
      bullets: [
        "Keep chat + memory as first-class navigation items",
        "Gate automation templates by workspace plan",
        "Introduce role-based approval for production agents",
      ],
    },
  ];

  if (prompt.toLowerCase().includes("error")) {
    base.push({
      text: "Potential risks detected in this plan.",
      messageType: "warning",
      bullets: [
        "No retry policy defined for failed jobs",
        "Missing analytics event for automation stop actions",
      ],
    });
  }

  if (
    prompt.toLowerCase().includes("code") ||
    prompt.toLowerCase().includes("api")
  ) {
    base.push({
      text: "Example contract payload",
      messageType: "code",
      code: `{
  "workspaceId": "wk_123",
  "conversationId": "conv_456",
  "messageType": "progress",
  "status": "running"
}`,
    });
  }

  base.push({
    text: "Summary",
    messageType: "summary",
    bullets: [
      "You now have rich message UI types",
      "Agent outputs can mix status, progress, and tasks",
      "The same pipeline can later map directly to backend events",
    ],
  });

  return base;
}

export default function Home() {
  // Top-level workspace controls and global UI modes.
  const [model, setModel] = useState<ModelName>("GPT-5.3-Codex");
  const [range, setRange] = useState<TimeRange>("7d");
  const [profileBusy, setProfileBusy] = useState<boolean>(false);

  // Header sheet form state for creating a workspace.
  const [workspaceOpen, setWorkspaceOpen] = useState<boolean>(false);
  const [workspaceLoading, setWorkspaceLoading] = useState<boolean>(false);
  const [workspaceForm, setWorkspaceForm] = useState<WorkspaceFormState>({
    name: "",
    slug: "",
  });

  // Conversation and composer state used by the Assistant tab.
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv-1",
      title: "Founder strategy sync",
      messages: [
        {
          id: "msg-1",
          role: "assistant",
          text: "I can help you scope your OpenClaw alternative. Focus on chat, memory, and team workflows first.",
          messageType: "regular",
        },
        {
          id: "msg-2",
          role: "assistant",
          text: "Planning status",
          messageType: "status",
        },
        {
          id: "msg-3",
          role: "assistant",
          text: "Roadmap execution",
          messageType: "progress",
          progress: {
            label: "Core UI completion",
            value: 74,
            eta: "ETA 3 days",
          },
        },
        {
          id: "msg-3b",
          role: "assistant",
          text: "Task: finalize Cosmos DB partition key strategy.",
          messageType: "task",
        },
        {
          id: "msg-4",
          role: "assistant",
          text: "Immediate action items",
          messageType: "tasks",
          tasks: [
            { id: "seed-t-1", label: "Finalize top bar actions", done: true },
            {
              id: "seed-t-2",
              label: "Implement message type renderer",
              done: true,
            },
            { id: "seed-t-3", label: "Add backend adapter stubs", done: false },
          ],
        },
        {
          id: "msg-5",
          role: "assistant",
          text: "Recommendation",
          messageType: "decision",
          bullets: [
            "Separate UI state from transport payloads",
            "Track every agent response as typed event",
            "Keep one reusable message renderer component",
          ],
        },
        {
          id: "msg-6",
          role: "assistant",
          text: "Potential release blocker",
          messageType: "warning",
          bullets: [
            "No optimistic rollback flow defined yet",
            "Automation failures need retry telemetry",
          ],
        },
        {
          id: "msg-7",
          role: "assistant",
          text: "Message contract preview",
          messageType: "code",
          code: `{
  "type": "tasks",
  "tasks": [{ "label": "Ship profile menu", "done": true }]
}`,
        },
        {
          id: "msg-8",
          role: "assistant",
          text: "Thread summary",
          messageType: "summary",
          bullets: [
            "Multiple message types are now supported",
            "Agent outputs can be rich and structured",
            "UI is prepared for real backend events",
          ],
        },
      ],
    },
  ]);
  const [activeConversationId, setActiveConversationId] =
    useState<string>("conv-1");
  const [composer, setComposer] = useState<string>("");
  const [composerLoading, setComposerLoading] = useState<boolean>(false);

  // Memory panel state (right rail).
  const [memories, setMemories] = useState<MemoryItem[]>([
    {
      id: "mem-1",
      text: "Founder wants polished UI and realistic interactions.",
    },
    {
      id: "mem-2",
      text: "Prototype should stay frontend-first while APIs are pending.",
    },
  ]);
  const [memoryInput, setMemoryInput] = useState<string>("");
  const [memoryLoading, setMemoryLoading] = useState<boolean>(false);

  // Knowledge base state (documents and indexing simulation).
  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: "doc-1", title: "Product-Brief-v2.pdf", chunks: 84, status: "ready" },
    { id: "doc-2", title: "Support-SOP.md", chunks: 29, status: "indexing" },
  ]);
  const [documentInput, setDocumentInput] = useState<string>("");
  const [documentLoading, setDocumentLoading] = useState<boolean>(false);

  // Automation jobs displayed in the Automation tab.
  const [jobs, setJobs] = useState<AgentJob[]>([
    {
      id: "job-1",
      title: "Daily product digest",
      status: "running",
      progress: 54,
    },
    {
      id: "job-2",
      title: "Support ticket triage",
      status: "idle",
      progress: 0,
    },
    {
      id: "job-3",
      title: "Release notes drafter",
      status: "paused",
      progress: 61,
    },
  ]);
  const [jobLoadingId, setJobLoadingId] = useState<string | null>(null);

  // Analytics KPIs and refresh state.
  const [usageStats, setUsageStats] = useState<UsageStats>({
    tokens: 118420,
    requests: 932,
    successRate: 98.3,
    avgLatency: 642,
  });
  const [usageLoading, setUsageLoading] = useState<boolean>(false);

  // Global activity feed shown in the right rail.
  const [activity, setActivity] = useState<ActivityItem[]>([
    {
      id: "act-1",
      text: "RAG index completed for Product-Brief-v2.pdf",
      tag: "ops",
    },
    {
      id: "act-2",
      text: "Memory updated with preferred UI style",
      tag: "memory",
    },
    {
      id: "act-3",
      text: "Assistant generated pricing recommendation",
      tag: "chat",
    },
  ]);

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === activeConversationId,
      ) ?? null,
    [activeConversationId, conversations],
  );

  const pushActivity = (text: string, tag: ActivityItem["tag"]) => {
    setActivity((previous) =>
      [{ id: makeId("act"), text, tag }, ...previous].slice(0, 10),
    );
  };

  const setConversationMessages = (
    conversationId: string,
    nextMessages: ChatMessage[],
  ) => {
    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, messages: nextMessages }
          : conversation,
      ),
    );
  };

  const createConversation = () => {
    const created: Conversation = {
      id: makeId("conv"),
      title: `Discovery thread ${conversations.length + 1}`,
      messages: [],
    };
    setConversations((previous) => [created, ...previous]);
    setActiveConversationId(created.id);
    pushActivity("Created a new conversation workspace", "chat");
    toast.success("Conversation created");
  };

  const clearConversation = () => {
    if (!activeConversation) {
      toast.error("No active conversation selected");
      return;
    }
    setConversationMessages(activeConversation.id, []);
    pushActivity("Cleared conversation history", "chat");
    toast.info("Conversation cleared");
  };

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeConversation) {
      toast.error("Create or select a conversation first");
      return;
    }

    const trimmed = composer.trim();
    if (trimmed.length < 4) {
      toast.error("Message is too short", {
        description: "Please use at least 4 characters.",
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: makeId("msg"),
      role: "user",
      text: trimmed,
    };

    setComposerLoading(true);
    setComposer("");

    const nextMessages = [...activeConversation.messages, userMessage];
    setConversationMessages(activeConversation.id, nextMessages);

    await new Promise((resolve) => setTimeout(resolve, 900));

    if (Math.random() < 0.1) {
      setComposerLoading(false);
      toast.error("Mock API failure", {
        description: "Please retry sending the message.",
      });
      return;
    }

    const assistantMessages: ChatMessage[] = buildAgentMessages(trimmed).map(
      (message) => ({
        ...message,
        id: makeId("msg"),
        role: "assistant",
      }),
    );

    setConversationMessages(activeConversation.id, [
      ...nextMessages,
      ...assistantMessages,
    ]);
    setComposerLoading(false);
    pushActivity(`Assistant replied using ${model}`, "chat");
    toast.success("Response generated", {
      description: `Model: ${model} | ${assistantMessages.length} message blocks`,
    });
  };

  const applyTemplate = (template: string) => {
    setComposer(template);
    toast.success("Template inserted into composer");
  };

  const saveMemory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = memoryInput.trim();
    if (value.length < 5) {
      toast.error("Memory note is too short");
      return;
    }

    setMemoryLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 650));

    if (Math.random() < 0.08) {
      setMemoryLoading(false);
      toast.error("Unable to save memory", {
        description: "Simulated backend validation error.",
      });
      return;
    }

    setMemories((previous) => [
      { id: makeId("mem"), text: value },
      ...previous,
    ]);
    setMemoryInput("");
    setMemoryLoading(false);
    pushActivity("Added a new user memory item", "memory");
    toast.success("Memory saved");
  };

  const removeMemory = (id: string) => {
    setMemories((previous) => previous.filter((item) => item.id !== id));
    pushActivity("Removed a memory item", "memory");
    toast.info("Memory removed");
  };

  const addDocument = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = documentInput.trim();
    if (title.length < 4) {
      toast.error("Provide a valid file title");
      return;
    }

    setDocumentLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 850));

    const newDocument: DocumentItem = {
      id: makeId("doc"),
      title,
      chunks: 12 + Math.floor(Math.random() * 90),
      status: "indexing",
    };

    setDocuments((previous) => [newDocument, ...previous]);
    setDocumentInput("");
    setDocumentLoading(false);
    pushActivity(`Uploaded ${title} for indexing`, "ops");
    toast.success("Document uploaded", {
      description: "Indexing started.",
    });
  };

  const reindexDocument = async (id: string) => {
    setDocuments((previous) =>
      previous.map((doc) =>
        doc.id === id ? { ...doc, status: "indexing" } : doc,
      ),
    );
    await new Promise((resolve) => setTimeout(resolve, 550));
    setDocuments((previous) =>
      previous.map((doc) =>
        doc.id === id ? { ...doc, status: "ready" } : doc,
      ),
    );
    pushActivity("Reindexed one document", "ops");
    toast.success("Reindex complete");
  };

  const removeDocument = (id: string) => {
    setDocuments((previous) => previous.filter((doc) => doc.id !== id));
    pushActivity("Removed a document from knowledge base", "ops");
    toast.info("Document removed");
  };

  const toggleJobStatus = async (job: AgentJob) => {
    setJobLoadingId(job.id);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setJobs((previous) =>
      previous.map((item) => {
        if (item.id !== job.id) {
          return item;
        }
        if (item.status === "running") {
          return { ...item, status: "paused" };
        }
        return {
          ...item,
          status: "running",
          progress: item.progress > 0 ? item.progress : 8,
        };
      }),
    );

    setJobLoadingId(null);
    pushActivity(`Updated automation: ${job.title}`, "ops");
    toast.success("Automation updated");
  };

  const tickJobs = () => {
    setJobs((previous) =>
      previous.map((job) => {
        if (job.status !== "running") {
          return job;
        }
        const nextProgress = Math.min(
          100,
          job.progress + 8 + Math.floor(Math.random() * 7),
        );
        return {
          ...job,
          progress: nextProgress,
          status: nextProgress >= 100 ? "idle" : "running",
        };
      }),
    );
    pushActivity("Advanced active automations", "ops");
    toast.success("Automation cycle executed");
  };

  const refreshAnalytics = async () => {
    setUsageLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 850));

    const multiplier = range === "24h" ? 1 : range === "7d" ? 3 : 7;
    setUsageStats((previous) => ({
      tokens:
        previous.tokens + multiplier * (300 + Math.floor(Math.random() * 200)),
      requests:
        previous.requests + multiplier * (2 + Math.floor(Math.random() * 3)),
      successRate: Math.min(
        99.9,
        Number((97.8 + Math.random() * 2).toFixed(1)),
      ),
      avgLatency: 560 + Math.floor(Math.random() * 180),
    }));

    setUsageLoading(false);
    pushActivity(`Refreshed analytics for ${range}`, "ops");
    toast.success("Analytics refreshed", {
      description: `Time range: ${range}`,
    });
  };

  const createWorkspace = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = workspaceForm.name.trim();
    const slug = workspaceForm.slug.trim();
    if (!name || !slug) {
      toast.error("Name and slug are required");
      return;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      toast.error("Workspace slug is invalid", {
        description: "Use lowercase letters, numbers, and hyphens.",
      });
      return;
    }

    setWorkspaceLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 850));

    if (Math.random() < 0.1) {
      setWorkspaceLoading(false);
      toast.error("Failed to create workspace", {
        description: "Mock timeout, please try again.",
      });
      return;
    }

    setWorkspaceLoading(false);
    setWorkspaceOpen(false);
    setWorkspaceForm({ name: "", slug: "" });
    pushActivity(`Workspace ${name} created`, "ops");
    toast.success("Workspace created", {
      description: `${name} is ready.`,
    });
  };

  const openProfileArea = (area: "account" | "billing" | "preferences") => {
    const labelMap: Record<typeof area, string> = {
      account: "Account profile",
      billing: "Billing center",
      preferences: "Preferences",
    };
    pushActivity(`Opened ${labelMap[area]}`, "ops");
    toast.success(`${labelMap[area]} opened`, {
      description: "This is a mock interaction for now.",
    });
  };

  const signOut = async () => {
    setProfileBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setProfileBusy(false);
    pushActivity("Signed out from workspace session", "ops");
    toast.info("Signed out", {
      description: "Mock sign-out completed.",
    });
  };

  const getTypeBadge = (type: AgentMessageType | undefined) => {
    const value = type ?? "regular";
    return (
      <Badge variant="outline" className="capitalize">
        {value}
      </Badge>
    );
  };

  const renderAssistantMessage = (message: ChatMessage) => {
    const type = message.messageType ?? "regular";

    // Progress messages render metric + bar.
    if (type === "progress" && message.progress) {
      return (
        <div className="space-y-2 text-xs leading-relaxed">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium">{message.progress.label}</p>
            <p className="text-muted-foreground">{message.progress.value}%</p>
          </div>
          <Progress value={message.progress.value} />
          {message.progress.eta ? (
            <p className="text-[11px] text-muted-foreground">
              {message.progress.eta}
            </p>
          ) : null}
        </div>
      );
    }

    // Tasks messages render checklist rows.
    if (type === "tasks" && message.tasks) {
      return (
        <div className="space-y-2">
          <p className="text-xs font-medium">{message.text}</p>
          <div className="grid gap-1.5">
            {message.tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2 text-xs">
                {task.done ? (
                  <CircleCheck className="size-3.5 text-emerald-500" />
                ) : (
                  <Clock3 className="size-3.5 text-amber-500" />
                )}
                <span
                  className={
                    task.done
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }
                >
                  {task.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Code messages render a preformatted snippet.
    if (type === "code" && message.code) {
      return (
        <div className="space-y-2">
          <p className="text-xs font-medium">{message.text}</p>
          <pre className="overflow-x-auto rounded-md border border-border/70 bg-background p-2 text-[11px] leading-relaxed">
            <code>{message.code}</code>
          </pre>
        </div>
      );
    }

    // Decision/summary/warning messages render bullet lists.
    if (
      (type === "decision" || type === "summary" || type === "warning") &&
      message.bullets
    ) {
      return (
        <div className="space-y-2">
          <p className="text-xs font-medium">{message.text}</p>
          <ul className="grid gap-1 text-xs text-muted-foreground">
            {message.bullets.map((bullet, index) => (
              <li
                key={`${message.id}-bullet-${index}`}
                className="flex items-start gap-2"
              >
                <span className="mt-1 block size-1.5 rounded-full bg-primary/70" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return <p className="text-xs leading-relaxed">{message.text}</p>;
  };

  return (
    <div className="h-screen bg-[radial-gradient(70%_120%_at_15%_10%,hsl(var(--chart-1)/0.2),transparent_55%),radial-gradient(80%_110%_at_85%_5%,hsl(var(--chart-2)/0.18),transparent_45%),linear-gradient(135deg,hsl(var(--background)),hsl(var(--secondary)/0.45))]">
      <div className="flex h-full w-full flex-col gap-4 p-4 md:p-5">
        {/* Top command/header bar: quick actions, workspace creation, profile menu. */}
        <Card className="border-border/70 bg-card/85 shadow-sm backdrop-blur-md">
          <CardContent className="flex flex-col gap-1.5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary p-1 text-primary-foreground shadow-sm">
                <Rocket className="size-3.5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Uccho AI Command Center</p>
                <p className="text-xs text-muted-foreground">
                  Professional OpenClaw-style workspace prototype
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <div className="flex items-center gap-1.5 rounded-md border border-border/70 bg-background px-2">
                <Search className="size-3.5 text-muted-foreground" />
                <Input
                  value={documentInput}
                  onChange={(event) => setDocumentInput(event.target.value)}
                  placeholder="Quick add doc title..."
                  className="h-7 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                  aria-label="Quick add document title"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (documentInput.trim().length < 4) {
                    toast.error("Enter at least 4 characters to quick add");
                    return;
                  }
                  const title = documentInput.trim();
                  setDocuments((previous) => [
                    {
                      id: makeId("doc"),
                      title,
                      chunks: 18 + Math.floor(Math.random() * 60),
                      status: "indexing",
                    },
                    ...previous,
                  ]);
                  setDocumentInput("");
                  pushActivity(`Quick-added ${title}`, "ops");
                  toast.success("Document added to queue");
                }}
              >
                <FilePlus2 />
                Quick Add
              </Button>
              <Sheet open={workspaceOpen} onOpenChange={setWorkspaceOpen}>
                <SheetTrigger asChild>
                  <Button size="sm" onClick={() => setWorkspaceOpen(true)}>
                    <Plus />
                    New Workspace
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Create Workspace</SheetTitle>
                    <SheetDescription>
                      Controlled form with validation, loading state, and
                      simulated API outcome.
                    </SheetDescription>
                  </SheetHeader>
                  <form className="grid gap-3 p-6" onSubmit={createWorkspace}>
                    <Input
                      value={workspaceForm.name}
                      onChange={(event) =>
                        setWorkspaceForm((previous) => ({
                          ...previous,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Workspace name"
                      aria-label="Workspace name"
                    />
                    <Input
                      value={workspaceForm.slug}
                      onChange={(event) =>
                        setWorkspaceForm((previous) => ({
                          ...previous,
                          slug: event.target.value,
                        }))
                      }
                      placeholder="workspace-slug"
                      aria-label="Workspace slug"
                    />
                    <Button type="submit" disabled={workspaceLoading}>
                      {workspaceLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Sparkles />
                      )}
                      {workspaceLoading ? "Creating..." : "Create Workspace"}
                    </Button>
                  </form>
                </SheetContent>
              </Sheet>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="default"
                    variant="outline"
                    className="h-8 gap-2 rounded-full border-border/70 bg-background pl-1 pr-2.5"
                    disabled={profileBusy}
                  >
                    <Avatar className="size-6 ring-1 ring-border/70">
                      <AvatarImage
                        src="https://api.dicebear.com/9.x/initials/svg?seed=Sakib"
                        alt="Sakib profile"
                      />
                      <AvatarFallback>SS</AvatarFallback>
                    </Avatar>
                    <span className="hidden text-xs sm:inline">Sakib</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        Sakib
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Founder Workspace
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => openProfileArea("account")}>
                    <UserCircle2 />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => openProfileArea("billing")}>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => openProfileArea("preferences")}
                  >
                    <Settings />
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => {
                      void signOut();
                    }}
                    disabled={profileBusy}
                  >
                    {profileBusy ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <LogOut />
                    )}
                    {profileBusy ? "Signing out..." : "Sign out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Main application shell: left sidebar, center workspace, right rail. */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[260px_1fr_330px]">
          {/* Left sidebar: sessions + prompt starters. */}
          <Card className="h-full border-border/70 bg-card/86 backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Sessions</CardTitle>
                <Badge variant="secondary">Live</Badge>
              </div>
              <CardDescription>
                Conversation threads and quick prompts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={createConversation}>
                <Plus />
                New Conversation
              </Button>
              <ScrollArea className="h-52 rounded-lg border border-border/70 p-2">
                <div className="grid gap-2">
                  {conversations.map((conversation) => (
                    <Button
                      key={conversation.id}
                      variant={
                        conversation.id === activeConversationId
                          ? "secondary"
                          : "ghost"
                      }
                      className="justify-start"
                      onClick={() => setActiveConversationId(conversation.id)}
                    >
                      <Bot />
                      {conversation.title}
                    </Button>
                  ))}
                </div>
              </ScrollArea>

              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Prompt Starters
                </p>
                {templates.map((template) => (
                  <Button
                    key={template}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => applyTemplate(template)}
                  >
                    <Wand2 />
                    {template.slice(0, 32)}...
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Center column: primary tabbed workspace surface. */}
          <Card className="h-full border-border/70 bg-card/90 shadow-sm backdrop-blur-md">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-sm">Workspace Core</CardTitle>
                  <CardDescription>
                    Chat, knowledge, automation, and analytics in one surface
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    value={model}
                    onValueChange={(value) => {
                      setModel(value as ModelName);
                      toast.info("Model switched", { description: value });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GPT-5.3-Codex">
                        GPT-5.3-Codex
                      </SelectItem>
                      <SelectItem value="GPT-4.1">GPT-4.1</SelectItem>
                      <SelectItem value="Claude Sonnet">
                        Claude Sonnet
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setComposer(
                            "Please produce an execution checklist for next sprint.",
                          );
                          toast.success("Draft inserted");
                        }}
                      >
                        <Sparkles />
                        Autofill
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Insert a starter draft in one click
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="assistant" className="w-full">
                <TabsList className="w-full justify-start overflow-auto">
                  <TabsTrigger value="assistant">
                    <Bot />
                    Assistant
                  </TabsTrigger>
                  <TabsTrigger value="knowledge">
                    <Database />
                    Knowledge
                  </TabsTrigger>
                  <TabsTrigger value="automation">
                    <Workflow />
                    Automation
                  </TabsTrigger>
                  <TabsTrigger value="analytics">
                    <Brain />
                    Analytics
                  </TabsTrigger>
                </TabsList>

                {/* Assistant tab: mixed typed chat messages and composer. */}
                <TabsContent value="assistant" className="mt-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => applyTemplate(templates[0])}
                    >
                      <Wand2 />
                      Use Launch Template
                    </Button>
                    <Button variant="outline" onClick={clearConversation}>
                      <Trash2 />
                      Clear
                    </Button>
                  </div>

                  <ScrollArea className="h-[40vh] rounded-lg border border-border/70 bg-background/70 p-3">
                    {activeConversation &&
                    activeConversation.messages.length > 0 ? (
                      <div className="grid gap-3">
                        {activeConversation.messages.map((message) => (
                          <div
                            key={message.id}
                            className="flex items-start gap-2"
                          >
                            <Avatar>
                              <AvatarFallback>
                                {message.role === "assistant" ? "AI" : "ME"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="rounded-lg border border-border/70 bg-card px-3 py-2">
                              <div className="mb-2 flex items-center gap-2">
                                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                  {message.role}
                                </p>
                                {message.role === "assistant"
                                  ? getTypeBadge(message.messageType)
                                  : null}
                              </div>
                              {message.role === "assistant" ? (
                                <div className="grid gap-2">
                                  {(message.messageType ?? "regular") ===
                                  "regular" ? (
                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                      <FileText className="size-3.5" />
                                      <span>Regular response</span>
                                    </div>
                                  ) : null}
                                  {(message.messageType ?? "regular") ===
                                  "task" ? (
                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                      <ListTodo className="size-3.5" />
                                      <span>Single task update</span>
                                    </div>
                                  ) : null}
                                  {(message.messageType ?? "regular") ===
                                  "progress" ? (
                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                      <Gauge className="size-3.5" />
                                      <span>Progress checkpoint</span>
                                    </div>
                                  ) : null}
                                  {(message.messageType ?? "regular") ===
                                  "tasks" ? (
                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                      <ClipboardList className="size-3.5" />
                                      <span>Task list</span>
                                    </div>
                                  ) : null}
                                  {(message.messageType ?? "regular") ===
                                  "warning" ? (
                                    <div className="flex items-center gap-2 text-[11px] text-amber-600 dark:text-amber-500">
                                      <AlertTriangle className="size-3.5" />
                                      <span>Warning</span>
                                    </div>
                                  ) : null}
                                  {(message.messageType ?? "regular") ===
                                  "code" ? (
                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                      <Code2 className="size-3.5" />
                                      <span>Code block</span>
                                    </div>
                                  ) : null}
                                  {renderAssistantMessage(message)}
                                </div>
                              ) : (
                                <p className="text-xs leading-relaxed">
                                  {message.text}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        {composerLoading && (
                          <div className="flex items-start gap-2">
                            <Avatar>
                              <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-2 rounded-lg border border-border/70 bg-card px-3 py-2">
                              <Skeleton className="h-2 w-44" />
                              <Skeleton className="h-2 w-36" />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-xs text-muted-foreground">
                          No messages yet. Start a conversation below.
                        </p>
                      </div>
                    )}
                  </ScrollArea>

                  <form className="grid gap-2" onSubmit={sendMessage}>
                    <Textarea
                      value={composer}
                      onChange={(event) => setComposer(event.target.value)}
                      placeholder="Ask for roadmap, pricing, architecture, workflows, or launch strategy..."
                      disabled={composerLoading}
                      aria-label="Message composer"
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-muted-foreground">
                        Validation: minimum 4 characters.
                      </p>
                      <Button type="submit" disabled={composerLoading}>
                        {composerLoading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Rocket />
                        )}
                        {composerLoading ? "Sending..." : "Send Message"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Knowledge tab: document ingest, indexing and item management. */}
                <TabsContent value="knowledge" className="mt-3 space-y-3">
                  <form
                    className="grid gap-2 md:grid-cols-[1fr_auto]"
                    onSubmit={addDocument}
                  >
                    <Input
                      value={documentInput}
                      onChange={(event) => setDocumentInput(event.target.value)}
                      placeholder="Document title (e.g. roadmap-q2.pdf)"
                      aria-label="Document title"
                    />
                    <Button type="submit" disabled={documentLoading}>
                      {documentLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Upload />
                      )}
                      {documentLoading ? "Uploading..." : "Upload"}
                    </Button>
                  </form>
                  <ScrollArea className="h-[45vh] rounded-lg border border-border/70 p-2">
                    <div className="grid gap-2">
                      {documents.map((doc) => (
                        <Card
                          key={doc.id}
                          className="border-border/60 bg-background/70"
                        >
                          <CardContent className="flex items-center justify-between gap-3 py-3">
                            <div>
                              <p className="text-xs font-medium">{doc.title}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {doc.chunks} chunks indexed
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  doc.status === "ready"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {doc.status}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => reindexDocument(doc.id)}
                              >
                                <RefreshCcw />
                                Reindex
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDocument(doc.id)}
                              >
                                <Trash2 />
                                Remove
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* Automation tab: agent job lifecycle and progress controls. */}
                <TabsContent value="automation" className="mt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Agent workflows execute mock scheduled tasks.
                    </p>
                    <Button variant="outline" onClick={tickJobs}>
                      <Clock3 />
                      Run Cycle
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    {jobs.map((job) => (
                      <Card
                        key={job.id}
                        className="border-border/60 bg-background/70"
                      >
                        <CardContent className="space-y-2 py-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium">{job.title}</p>
                            <Badge
                              variant={
                                job.status === "running"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {job.status}
                            </Badge>
                          </div>
                          <Progress value={job.progress} />
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] text-muted-foreground">
                              Progress: {job.progress}%
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={jobLoadingId === job.id}
                              onClick={() => toggleJobStatus(job)}
                            >
                              {jobLoadingId === job.id ? (
                                <Loader2 className="animate-spin" />
                              ) : job.status === "running" ? (
                                <StopCircle />
                              ) : (
                                <Play />
                              )}
                              {jobLoadingId === job.id
                                ? "Updating..."
                                : job.status === "running"
                                  ? "Pause"
                                  : "Run"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Analytics tab: KPI cards with range-based refresh simulation. */}
                <TabsContent value="analytics" className="mt-3 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      value={range}
                      onValueChange={(value) => setRange(value as TimeRange)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">Last 24h</SelectItem>
                        <SelectItem value="7d">Last 7d</SelectItem>
                        <SelectItem value="30d">Last 30d</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={refreshAnalytics}
                      disabled={usageLoading}
                    >
                      {usageLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <RefreshCcw />
                      )}
                      {usageLoading ? "Refreshing..." : "Refresh Metrics"}
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <Card className="border-border/60 bg-background/70">
                      <CardHeader>
                        <CardDescription>Tokens</CardDescription>
                        <CardTitle>
                          {usageStats.tokens.toLocaleString()}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                    <Card className="border-border/60 bg-background/70">
                      <CardHeader>
                        <CardDescription>Requests</CardDescription>
                        <CardTitle>
                          {usageStats.requests.toLocaleString()}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                    <Card className="border-border/60 bg-background/70">
                      <CardHeader>
                        <CardDescription>Success Rate</CardDescription>
                        <CardTitle>{usageStats.successRate}%</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card className="border-border/60 bg-background/70">
                      <CardHeader>
                        <CardDescription>Avg Latency</CardDescription>
                        <CardTitle>{usageStats.avgLatency}ms</CardTitle>
                      </CardHeader>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Right rail: user memory and activity timeline. */}
          <Card className="h-full border-border/70 bg-card/88 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-sm">Memory + Activity</CardTitle>
              <CardDescription>
                Persistent user context and operational feed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <form className="grid gap-2" onSubmit={saveMemory}>
                <Input
                  value={memoryInput}
                  onChange={(event) => setMemoryInput(event.target.value)}
                  placeholder="Add a user memory note"
                  disabled={memoryLoading}
                  aria-label="Memory note"
                />
                <Button type="submit" disabled={memoryLoading}>
                  {memoryLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Plus />
                  )}
                  {memoryLoading ? "Saving..." : "Save Memory"}
                </Button>
              </form>

              <ScrollArea className="h-[22vh] rounded-lg border border-border/70 p-2">
                <div className="grid gap-2">
                  {memories.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-md border border-border/70 bg-background/70 p-2"
                    >
                      <p className="text-xs leading-relaxed">{item.text}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1"
                        onClick={() => removeMemory(item.id)}
                      >
                        <Trash2 />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator />

              <ScrollArea className="h-[27vh] rounded-lg border border-border/70 p-2">
                <div className="space-y-2">
                  {activity.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-md border border-border/60 bg-background/70 p-2"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <Badge variant="outline">{entry.tag}</Badge>
                        {entry.tag === "ops" ? (
                          <CheckCircle2 className="size-3.5 text-emerald-500" />
                        ) : (
                          <Clock3 className="size-3.5 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-xs leading-relaxed">{entry.text}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
