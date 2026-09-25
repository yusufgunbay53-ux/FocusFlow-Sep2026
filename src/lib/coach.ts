import { AppState } from "@/types/models";

export type CoachMood = "great" | "ok" | "slow";

export interface CoachMessage {
  mood: CoachMood;
  title: string;
  body: string;
}

export function getCoachMessage(state: AppState): CoachMessage {
  const { completedToday, focusMinutesToday } = state.stats;
  const open = state.tasks.filter((t) => t.column !== "done").length;

  if (completedToday >= 4 || focusMinutesToday >= 50) {
    return {
      mood: "great",
      title: "Bugün harika gidiyorsun!",
      body: `${completedToday} görev ve ${focusMinutesToday} dk odak. Ritmini koru.`,
    };
  }

  if (completedToday === 0 && focusMinutesToday < 10 && open > 0) {
    return {
      mood: "slow",
      title: "Biraz yavaşladın",
      body: "5 dakika mola veya kısa bir Pomodoro ile tekrar başlamak ister misin?",
    };
  }

  return {
    mood: "ok",
    title: "Akışın devam ediyor",
    body: `${open} açık görev var. Küçük bir adım bile ilerleme sayılır.`,
  };
}
