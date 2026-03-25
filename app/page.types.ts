export type ModelName = "GPT-5.3-Codex" | "GPT-4.1" | "Claude Sonnet";
export type MessageRole = "user" | "assistant";
export type JobStatus = "idle" | "running" | "paused";
export type TimeRange = "24h" | "7d" | "30d";
export type AgentMessageType =
  | "regular"
  | "task"
  | "progress"
  | "tasks"
  | "status"
  | "warning"
  | "decision"
  | "code"
  | "summary";

export interface AgentTaskItem {
  id: string;
  label: string;
  done: boolean;
}

export interface AgentProgressData {
  label: string;
  value: number;
  eta?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  messageType?: AgentMessageType;
  tasks?: AgentTaskItem[];
  progress?: AgentProgressData;
  code?: string;
  bullets?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
}

export interface MemoryItem {
  id: string;
  text: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  chunks: number;
  status: "ready" | "indexing";
}

export interface AgentJob {
  id: string;
  title: string;
  status: JobStatus;
  progress: number;
}

export interface UsageStats {
  tokens: number;
  requests: number;
  successRate: number;
  avgLatency: number;
}

export interface ActivityItem {
  id: string;
  text: string;
  tag: "chat" | "memory" | "ops";
}

export interface WorkspaceFormState {
  name: string;
  slug: string;
}
