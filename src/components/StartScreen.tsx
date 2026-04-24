type StartScreenProps = {
  onStart: () => void;
  bestResult: {
    bestClarity: number;
    bestChaos: number;
    bestTitle: string;
  } | null;
};

export function StartScreen({ onStart, bestResult }: StartScreenProps) {
  return (
    <section className="glass-card mx-auto w-full max-w-2xl rounded-3xl p-6 shadow-glow md:p-10 animate-fadeUp">
      <p className="mb-3 inline-flex rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs text-textSoft">
        Мини-игра для сообщества ВК про нейросети
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-textMain md:text-5xl">
        Бриф за 60 секунд
      </h1>
      <p className="mt-4 text-base leading-relaxed text-textSoft md:text-lg">
        Проверь, сможет ли исполнитель понять твой заказ или уйдет плакать в угол с фразой:
        {" "}
        <span className="text-textMain">«сделайте красиво».</span>
      </p>
      <button
        onClick={onStart}
        className="mt-8 w-full rounded-2xl bg-gradient-to-r from-accent to-accentAlt px-5 py-3 text-base font-semibold text-white transition hover:scale-[1.01] hover:brightness-110 active:scale-[0.99] md:w-auto"
      >
        Начать игру
      </button>
      <p className="mt-4 text-sm text-textSoft/90">
        Выбирай ответы быстро. Чем конкретнее бриф, тем меньше хаоса.
      </p>
      {bestResult ? (
        <div className="mt-5 rounded-2xl border border-accent/35 bg-accent/10 p-4 text-sm text-textSoft">
          <p className="text-xs uppercase tracking-[0.14em] text-accentAlt">Твой рекорд</p>
          <p className="mt-1 text-textMain">
            {bestResult.bestTitle} - ясность {bestResult.bestClarity}%, хаос {bestResult.bestChaos}%.
          </p>
        </div>
      ) : null}
    </section>
  );
}
