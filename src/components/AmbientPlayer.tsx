import { useEffect, useRef, useState } from "react";
import { CloudRain, Music2, Volume2 } from "lucide-react";

type Track = "off" | "rain" | "lofi";

export function AmbientPlayer() {
  const [track, setTrack] = useState<Track>("off");
  const [vol, setVol] = useState(0.25);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ src?: AudioBufferSourceNode; gain?: GainNode; filter?: BiquadFilterNode }>({});

  useEffect(() => {
    stop();
    if (track === "off") return;
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const gain = ctx.createGain();
    gain.gain.value = vol;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = track === "rain" ? 1800 : 900;

    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (track === "rain" ? 0.35 : 0.12);
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start();
    nodesRef.current = { src, gain, filter };
    return stop;
  }, [track]);

  useEffect(() => {
    if (nodesRef.current.gain) nodesRef.current.gain.gain.value = vol;
  }, [vol]);

  function stop() {
    nodesRef.current.src?.stop();
    ctxRef.current?.close();
    ctxRef.current = null;
    nodesRef.current = {};
  }

  return (
    <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-3">
      <p className="mb-2 flex items-center gap-2 text-xs text-cyan-100/60">
        <Volume2 size={14} /> Ortam sesi
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setTrack("off")}
          className={`rounded-lg px-2 py-1 text-xs ${track === "off" ? "bg-neon text-night" : "bg-white/5"}`}
        >
          Kapalı
        </button>
        <button
          onClick={() => setTrack("lofi")}
          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs ${track === "lofi" ? "bg-neon text-night" : "bg-white/5"}`}
        >
          <Music2 size={12} /> Lo-Fi
        </button>
        <button
          onClick={() => setTrack("rain")}
          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs ${track === "rain" ? "bg-neon text-night" : "bg-white/5"}`}
        >
          <CloudRain size={12} /> Yağmur
        </button>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={vol}
        onChange={(e) => setVol(Number(e.target.value))}
        className="mt-3 w-full accent-neon"
      />
    </div>
  );
}
