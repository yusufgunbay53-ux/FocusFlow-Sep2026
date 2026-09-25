import { AppState, STORAGE_KEY, Stats } from "@/types/models";

const defaultStats = (): Stats => ({
  completedToday: 0,
  focusMinutesToday: 0,
  streak: 0,
  lastActiveDate: new Date().toISOString().slice(0, 10),
});

export const defaultState = (): AppState => ({
  tasks: [
    {
      id: crypto.randomUUID(),
      title: "FocusFlow’u keşfet",
      notes: "Kanban, Pomodoro ve AI koçu dene.",
      priority: "high",
      column: "todo",
      createdAt: new Date().toISOString(),
      order: 0,
    },
    {
      id: crypto.randomUUID(),
      title: "25 dakikalık ilk odak seansı",
      priority: "medium",
      column: "doing",
      createdAt: new Date().toISOString(),
      order: 0,
    },
  ],
  sessions: [],
  stats: defaultStats(),
});

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as AppState;
    return {
      tasks: parsed.tasks ?? [],
      sessions: parsed.sessions ?? [],
      stats: { ...defaultStats(), ...parsed.stats },
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
