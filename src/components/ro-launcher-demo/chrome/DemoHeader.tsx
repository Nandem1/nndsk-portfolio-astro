export function DemoHeader() {
  return (
    <header className="flex items-end justify-between gap-3 px-4 py-2.5 border-b border-white/[0.06] bg-zinc-950/60 backdrop-blur-sm shrink-0">
      <div>
        <p className="text-xl font-bold tracking-tight">
          <span className="text-amber-400">RO</span>
          <span className="text-zinc-100">-Launcher</span>
        </p>
        <p className="text-xs text-zinc-500 mt-0.5">Ragnarok Online · Linux</p>
      </div>
      <p className="text-[11px] text-zinc-600 shrink-0">Demo</p>
    </header>
  );
}
