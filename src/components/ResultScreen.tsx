type ResultScreenProps = {
  clarity: number;
  chaos: number;
  title: string;
  description: string;
  recommendation: string;
  onRestart: () => void;
  onCopy: () => void;
  copied: boolean;
};

export function ResultScreen({
  clarity,
  chaos,
  title,
  description,
  recommendation,
  onRestart,
  onCopy,
  copied
}: ResultScreenProps) {
  return (
    <section className="glass-card mx-auto w-full max-w-2xl rounded-3xl p-6 shadow-glow animate-fadeUp md:p-10">
      <p className="text-sm uppercase tracking-[0.14em] text-accentAlt">Финал игры</p>
      <h2 className="mt-2 text-3xl font-semibold text-textMain md:text-4xl">{title}</h2>
      <p className="mt-4 leading-relaxed text-textSoft">{description}</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4">
          <p className="text-xs text-textSoft">Ясность</p>
          <p className="mt-1 text-2xl font-semibold text-textMain">{clarity}%</p>
        </div>
        <div className="rounded-2xl border border-fuchsia-400/30 bg-fuchsia-400/10 p-4">
          <p className="text-xs text-textSoft">Хаос</p>
          <p className="mt-1 text-2xl font-semibold text-textMain">{chaos}%</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm leading-relaxed text-textSoft">
        {recommendation}
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <button
          onClick={onRestart}
          className="rounded-2xl border border-accent/50 bg-white/5 px-4 py-3 font-medium text-textMain transition hover:bg-white/10"
        >
          Сыграть еще раз
        </button>
        <button
          onClick={onCopy}
          className="rounded-2xl bg-gradient-to-r from-accent to-accentAlt px-4 py-3 font-medium text-white transition hover:brightness-110"
        >
          {copied ? "Результат скопирован" : "Скопировать мой результат"}
        </button>
      </div>
    </section>
  );
}
