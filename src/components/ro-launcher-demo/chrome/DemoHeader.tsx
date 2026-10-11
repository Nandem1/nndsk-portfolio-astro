export function DemoHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between bg-[rgb(var(--ro-c-surface))] px-4">
      <div className="min-w-0 flex-1">
        <h1 className="font-sans text-[17px] font-semibold leading-normal tracking-[-0.01em]">
          <span className="text-[rgb(var(--ro-c-accent))]">RO</span>
          <span className="text-[rgb(var(--ro-c-ink))]">-Launcher</span>
        </h1>
        <p className="mt-0.5 text-xs text-[rgb(var(--ro-c-muted))]">Ragnarok Online · Linux</p>
      </div>
      <p className="shrink-0 font-mono text-[11px] font-medium text-[rgb(var(--ro-c-muted))]">
        Demo
      </p>
    </header>
  );
}
