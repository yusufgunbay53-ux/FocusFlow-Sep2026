import { Bot } from "lucide-react";
import { AppState } from "@/types/models";
import { getCoachMessage } from "@/lib/coach";

export function CoachPanel({ state }: { state: AppState }) {
  const msg = getCoachMessage(state);
  return (
    <section className="glass page-enter rounded-2xl p-5">
      <div className="mb-3 flex items-center gap-2 text-neon">
        <Bot size={18} />
        <h2 className="text-sm font-semibold">AI Performans Koçu</h2>
      </div>
      <p className="text-base font-medium">{msg.title}</p>
      <p className="mt-1 text-sm text-cyan-100/60">{msg.body}</p>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-xl bg-black/20 p-2">
          <dt className="text-cyan-100/45">Görev</dt>
          <dd className="mt-1 text-lg font-semibold text-neon">{state.stats.completedToday}</dd>
        </div>
        <div className="rounded-xl bg-black/20 p-2">
          <dt className="text-cyan-100/45">Odak dk</dt>
          <dd className="mt-1 text-lg font-semibold text-neon">{state.stats.focusMinutesToday}</dd>
        </div>
        <div className="rounded-xl bg-black/20 p-2">
          <dt className="text-cyan-100/45">Seri</dt>
          <dd className="mt-1 text-lg font-semibold text-neon">{state.stats.streak}</dd>
        </div>
      </dl>
      <p className="mt-3 text-[11px] text-cyan-100/35">
        Mock koç. İleride OpenAI / Groq API buraya bağlanabilir.
      </p>
    </section>
  );
}
