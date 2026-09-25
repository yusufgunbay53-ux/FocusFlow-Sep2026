import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-4 px-4 py-5 md:px-8">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-neon/15 text-neon shadow-neon">
          <Sparkles size={18} />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight md:text-xl">FocusFlow</h1>
          <p className="text-xs text-cyan-100/50">AI destekli görev ve odaklanma asistanı</p>
        </div>
      </div>
    </header>
  );
}
