type LunaMessageProps = {
  message: string;
};

export function LunaMessage({ message }: LunaMessageProps) {
  return (
    <div className="glass-card rounded-2xl border border-accentAlt/35 p-4 text-sm text-textSoft animate-fadeUp">
      <p className="mb-1 text-xs uppercase tracking-[0.14em] text-accentAlt">Луна говорит</p>
      <p className="leading-relaxed">
        {message}
      </p>
    </div>
  );
}
