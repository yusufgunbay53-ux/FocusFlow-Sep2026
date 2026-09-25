export type Priority = "low" | "medium" | "high";
export type ColumnId = "todo" | "doing" | "done";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  column: ColumnId;
  createdAt: string;
  completedAt?: string;
  order: number;
}

export interface PomodoroSession {
  id: string;
  mode: "focus" | "break";
  startedAt: string;
  endedAt?: string;
  durationSec: number;
  completed: boolean;
}

export interface Stats {
  completedToday: number;
  focusMinutesToday: number;
  streak: number;
  lastActiveDate: string;
}

export interface AppState {
  tasks: Task[];
  sessions: PomodoroSession[];
  stats: Stats;
}

export const STORAGE_KEY = "focusflow:v1";
