type LunaMessageProps = {
  message: string;
  imageSrc?: string;
};

export function LunaMessage({
  message,
  imageSrc = `${import.meta.env.BASE_URL}luna.png`
}: LunaMessageProps) {
  return (
    <div className="glass-card rounded-2xl border border-accentAlt/35 p-4 text-sm text-textSoft animate-fadeUp">
      <div className="flex items-center gap-3">
        <img
          src={imageSrc}
          alt="Луна"
          className="h-12 w-12 shrink-0 rounded-xl border border-accentAlt/40 object-cover shadow-glow"
          loading="lazy"
        />
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-accentAlt">Комментарий Луны</p>
          <p className="text-sm text-textMain">Луна, AI-помощница по брифам</p>
        </div>
      </div>
      <p className="mt-3 leading-relaxed">
        {message}
      </p>
    </div>
  );
}
