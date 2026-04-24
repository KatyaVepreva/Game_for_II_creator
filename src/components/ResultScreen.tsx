type ResultScreenProps = {
  clarity: number;
  chaos: number;
  title: string;
  description: string;
  recommendation: string;
  review: {
    strengths: string[];
    improvements: string[];
  };
  bestResult: {
    bestClarity: number;
    bestChaos: number;
    bestTitle: string;
  } | null;
  onRestart: () => void;
  onCopyResult: () => void;
  onCopyChallenge: () => void;
  onCopyBrief: () => void;
  copiedType: "result" | "challenge" | "brief" | "none";
};

export function ResultScreen({
  clarity,
  chaos,
  title,
  description,
  recommendation,
  review,
  bestResult,
  onRestart,
  onCopyResult,
  onCopyChallenge,
  onCopyBrief,
  copiedType
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

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-200">Сильные стороны</p>
          <ul className="mt-2 space-y-2 text-sm text-textSoft">
            {review.strengths.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-amber-200">Что уточнить</p>
          <ul className="mt-2 space-y-2 text-sm text-textSoft">
            {review.improvements.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
      </div>

      {bestResult ? (
        <div className="mt-4 rounded-2xl border border-accentAlt/35 bg-accentAlt/10 p-4 text-sm text-textSoft">
          <p className="text-xs uppercase tracking-[0.14em] text-accentAlt">Лучший результат в этом браузере</p>
          <p className="mt-1 text-textMain">
            {bestResult.bestTitle}: ясность {bestResult.bestClarity}%, хаос {bestResult.bestChaos}%.
          </p>
        </div>
      ) : null}

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <button
          onClick={onRestart}
          className="rounded-2xl border border-accent/50 bg-white/5 px-4 py-3 font-medium text-textMain transition hover:bg-white/10"
        >
          Сыграть еще раз
        </button>
        <button
          onClick={onCopyResult}
          className="rounded-2xl bg-gradient-to-r from-accent to-accentAlt px-4 py-3 font-medium text-white transition hover:brightness-110"
        >
          {copiedType === "result" ? "Результат скопирован" : "Скопировать мой результат"}
        </button>
        <button
          onClick={onCopyChallenge}
          className="rounded-2xl border border-accentAlt/50 bg-accentAlt/15 px-4 py-3 font-medium text-textMain transition hover:bg-accentAlt/25"
        >
          {copiedType === "challenge" ? "Вызов скопирован" : "Скопировать вызов подруге"}
        </button>
        <button
          onClick={onCopyBrief}
          className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 font-medium text-textMain transition hover:bg-white/20"
        >
          {copiedType === "brief" ? "Шаблон скопирован" : "Скопировать шаблон брифа"}
        </button>
      </div>
    </section>
  );
}
