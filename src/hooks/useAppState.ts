import { useCallback, useEffect, useState } from "react";
import { AppState, ColumnId, Priority, Task } from "@/types/models";
import { loadState, saveState } from "@/lib/storage";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function useAppState() {
  const [state, setState] = useState<AppState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const d = today();
    if (state.stats.lastActiveDate !== d) {
      setState((s) => ({
        ...s,
        stats: {
          ...s.stats,
          completedToday: 0,
          focusMinutesToday: 0,
          lastActiveDate: d,
          streak:
            s.stats.lastActiveDate ===
            new Date(Date.now() - 86400000).toISOString().slice(0, 10)
              ? s.stats.streak + 1
              : 1,
        },
      }));
    }
  }, [state.stats.lastActiveDate]);

  const addTask = useCallback((title: string, priority: Priority, notes?: string) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      notes,
      priority,
      column: "todo",
      createdAt: new Date().toISOString(),
      order: Date.now(),
    };
    setState((s) => ({ ...s, tasks: [...s.tasks, task] }));
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  }, []);

  const moveTask = useCallback((id: string, column: ColumnId) => {
    setState((s) => {
      const wasDone = s.tasks.find((t) => t.id === id)?.column === "done";
      const nowDone = column === "done";
      const completedDelta = !wasDone && nowDone ? 1 : wasDone && !nowDone ? -1 : 0;
      return {
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                column,
                completedAt: nowDone ? new Date().toISOString() : undefined,
              }
            : t
        ),
        stats: {
          ...s.stats,
          completedToday: Math.max(0, s.stats.completedToday + completedDelta),
        },
      };
    });
  }, []);

  const addFocusMinutes = useCallback((minutes: number) => {
    setState((s) => ({
      ...s,
      stats: {
        ...s.stats,
        focusMinutesToday: s.stats.focusMinutesToday + minutes,
      },
      sessions: [
        ...s.sessions,
        {
          id: crypto.randomUUID(),
          mode: "focus",
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          durationSec: minutes * 60,
          completed: true,
        },
      ],
    }));
  }, []);

  return { state, addTask, updateTask, deleteTask, moveTask, addFocusMinutes };
}
