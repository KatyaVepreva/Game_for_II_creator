import { useEffect, useMemo } from "react";
import type { GameQuestion } from "../data/questions";
import { ProgressBars } from "./ProgressBars";
import { LunaMessage } from "./LunaMessage";

type GameScreenProps = {
  question: GameQuestion;
  currentQuestion: number;
  totalQuestions: number;
  clarity: number;
  chaos: number;
  timer: number;
  reaction: string;
  lunaTip: string;
  remainingQuestions: number;
  barFlash: "clarity" | "chaos" | null;
  onAnswer: (optionId: string) => void;
};

export function GameScreen({
  question,
  currentQuestion,
  totalQuestions,
  clarity,
  chaos,
  timer,
  reaction,
  lunaTip,
  remainingQuestions,
  barFlash,
  onAnswer
}: GameScreenProps) {
  const timerState = useMemo(() => {
    if (timer > 35) return "text-emerald-300";
    if (timer > 15) return "text-amber-300";
    return "text-rose-300 animate-pulseSoft";
  }, [timer]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyIndex = Number(event.key) - 1;
      if (Number.isNaN(keyIndex) || keyIndex < 0 || keyIndex > 3) return;
      const option = question.options[keyIndex];
      if (!option) return;
      event.preventDefault();
      onAnswer(option.id);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [question, onAnswer]);

  return (
    <section className="mx-auto w-full max-w-5xl animate-fadeUp">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="glass-card rounded-3xl p-5 shadow-glow md:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className={`text-lg font-semibold md:text-xl ${timerState}`}>⏳ {timer} сек</p>
          <p className="rounded-full border border-white/20 px-3 py-1 text-sm text-textSoft">
            {currentQuestion} / {totalQuestions}
          </p>
        </div>

        <ProgressBars clarity={clarity} chaos={chaos} flash={barFlash} />

        <h2 className="mt-6 text-xl font-semibold text-textMain md:text-3xl">{question.prompt}</h2>
        <p className="mt-2 text-sm text-textSoft">
          Осталось вопросов: {remainingQuestions}
          <span className="ml-2 hidden text-textSoft/80 md:inline">Подсказка: кнопки 1-4 работают с клавиатуры.</span>
        </p>
        <div className="mt-5 grid gap-3">
          {question.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => onAnswer(option.id)}
              className="rounded-2xl border border-accentAlt/30 bg-white/5 px-4 py-3 text-left text-sm text-textMain transition hover:border-accent hover:bg-white/10 hover:shadow-glow active:scale-[0.99] md:text-base"
            >
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-xs text-textSoft">
                {index + 1}
              </span>
              {option.text}
            </button>
          ))}
        </div>

        <div className="mt-4 min-h-12">
          {reaction ? (
            <div className="rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-textMain animate-fadeUp">
              <p className="mb-1 text-xs uppercase tracking-[0.12em] text-accentAlt">Быстрый комментарий Луны</p>
              {reaction}
            </div>
          ) : null}
        </div>
      </div>
        <div className="lg:sticky lg:top-4">
          <LunaMessage message={lunaTip} />
        </div>
      </div>
    </section>
  );
}
