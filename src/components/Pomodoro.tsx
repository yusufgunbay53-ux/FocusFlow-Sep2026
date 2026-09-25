import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { AmbientPlayer } from "./AmbientPlayer";

const FOCUS = 25 * 60;
const BREAK = 5 * 60;

function format(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function beep() {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 880;
  gain.gain.value = 0.05;
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  setTimeout(() => {
    osc.stop();
    ctx.close();
  }, 700);
}

export function Pomodoro({ onFocusComplete }: { onFocusComplete: (minutes: number) => void }) {
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [remaining, setRemaining] = useState(FOCUS);
  const [running, setRunning] = useState(false);
  const tick = useRef<number | null>(null);

  const total = mode === "focus" ? FOCUS : BREAK;
  const progress = useMemo(() => 1 - remaining / total, [remaining, total]);

  useEffect(() => {
    if (!running) return;
    tick.current = window.setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, [running]);

  useEffect(() => {
    if (remaining > 0) return;
    setRunning(false);
    beep();
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(mode === "focus" ? "Odak bitti — 5 dk mola zamanı" : "Mola bitti — tekrar odaklan");
    }
    if (mode === "focus") onFocusComplete(25);
    const next = mode === "focus" ? "break" : "focus";
    setMode(next);
    setRemaining(next === "focus" ? FOCUS : BREAK);
  }, [remaining, mode, onFocusComplete]);

  function requestNotify() {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }

  return (
    <aside className="glass page-enter rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-neon/80">
        {mode === "focus" ? "Odak" : "Mola"}
      </p>
      <div className="relative mx-auto my-6 grid h-48 w-48 place-items-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(0,210,255,0.12)" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#00d2ff"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 52}`}
            strokeDashoffset={`${(1 - progress) * 2 * Math.PI * 52}`}
          />
        </svg>
        <div className="text-center">
          <div className="text-4xl font-semibold tabular-nums">{format(remaining)}</div>
          <div className="mt-1 text-xs text-cyan-100/50">{mode === "focus" ? "25 dk çalışma" : "5 dk mola"}</div>
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => {
            requestNotify();
            setRunning((v) => !v);
          }}
          className="glow-btn inline-flex items-center gap-2 rounded-xl bg-neon px-4 py-2 text-sm font-semibold text-night"
        >
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running ? "Duraklat" : "Başlat"}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setRemaining(mode === "focus" ? FOCUS : BREAK);
          }}
          className="rounded-xl border border-white/10 px-3 py-2 text-sm hover:border-neon/40"
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <AmbientPlayer />
    </aside>
  );
}
