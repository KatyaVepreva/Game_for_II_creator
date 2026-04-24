import { useEffect, useMemo, useState } from "react";
import { GameScreen } from "./components/GameScreen";
import { ResultScreen } from "./components/ResultScreen";
import { StartScreen } from "./components/StartScreen";
import { TOTAL_TIME_SECONDS, lunaTips, questions, reactionPools } from "./data/questions";

type Phase = "start" | "game" | "result";

type FinalResult = {
  title: string;
  description: string;
  recommendation: string;
  funnyComment: string;
};

type AnswerHistoryItem = {
  questionId: number;
  prompt: string;
  answerText: string;
  clarityDelta: number;
  chaosDelta: number;
};

type BriefReview = {
  strengths: string[];
  improvements: string[];
};

type BestResult = {
  bestClarity: number;
  bestChaos: number;
  bestTitle: string;
};

const BEST_RESULT_KEY = "brief60.bestResult";

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

const pickRandom = (items: string[]) => items[Math.floor(Math.random() * items.length)];

const buildReview = (answers: AnswerHistoryItem[], clarity: number, chaos: number): BriefReview => {
  const strengths: string[] = [];
  const improvements: string[] = [];

  const answerByQuestion = new Map<number, AnswerHistoryItem>();
  answers.forEach((answer) => answerByQuestion.set(answer.questionId, answer));

  const pushStrength = (text: string) => {
    if (!strengths.includes(text) && strengths.length < 3) strengths.push(text);
  };

  const pushImprove = (text: string) => {
    if (!improvements.includes(text) && improvements.length < 3) improvements.push(text);
  };

  const goalAnswer = answerByQuestion.get(1);
  const styleAnswer = answerByQuestion.get(2);
  const usageAnswer = answerByQuestion.get(3);
  const refsAnswer = answerByQuestion.get(4);
  const moodAnswer = answerByQuestion.get(5);
  const formatAnswer = answerByQuestion.get(6);
  const deadlineAnswer = answerByQuestion.get(7);

  if (goalAnswer && goalAnswer.clarityDelta >= 12) {
    pushStrength("Цель описана четко, исполнитель понимает задачу.");
  } else {
    pushImprove("Уточни, зачем нужен визуал: личный бренд, продажи или оформление сообщества.");
  }

  if (refsAnswer && refsAnswer.clarityDelta >= 12) {
    pushStrength("Референсы заданы хорошо, это ускоряет попадание в стиль.");
  } else {
    pushImprove("Добавь 2-3 референса, чтобы убрать гадание и сократить правки.");
  }

  if (formatAnswer && formatAnswer.clarityDelta >= 12) {
    pushStrength("Формат указан заранее, значит результат проще применить сразу.");
  } else {
    pushImprove("Определи формат публикации (9:16, 4:5, квадрат), чтобы не терять качество.");
  }

  if (deadlineAnswer && deadlineAnswer.clarityDelta >= 12) {
    pushStrength("Дедлайн понятен, это снижает стресс и хаос в процессе.");
  } else {
    pushImprove("Назови конкретный дедлайн, а не просто 'побыстрее'.");
  }

  if (styleAnswer && styleAnswer.clarityDelta >= 12 && moodAnswer && moodAnswer.clarityDelta >= 12) {
    pushStrength("Стиль и настроение совпадают, у проекта есть единый характер.");
  } else {
    pushImprove("Зафиксируй стиль и настроение в 2-3 словах, чтобы визуал был цельным.");
  }

  if (usageAnswer && usageAnswer.clarityDelta >= 12) {
    pushStrength("Понимание места использования помогает выбрать точную композицию.");
  }

  if (clarity < 40 || chaos > 70) {
    pushImprove("Собери мини-бриф из 5 пунктов: цель, стиль, референсы, формат и срок.");
  }

  return {
    strengths: strengths.length ? strengths : ["Ты уже начала структурировать запрос, это хороший базис."],
    improvements: improvements.length
      ? improvements
      : ["Запрос собран уверенно. Перед заказом просто проверь детали по чеклисту."]
  };
};

const buildBriefTemplate = (answers: AnswerHistoryItem[]) => {
  const byId = new Map<number, AnswerHistoryItem>();
  answers.forEach((item) => byId.set(item.questionId, item));

  return [
    "Хочу заказать нейровизуал.",
    `1) Цель: ${byId.get(1)?.answerText ?? "уточняю"}.`,
    `2) Стиль: ${byId.get(2)?.answerText ?? "уточняю"}.`,
    `3) Где использовать: ${byId.get(3)?.answerText ?? "уточняю"}.`,
    `4) Референсы: ${byId.get(4)?.answerText ?? "добавлю 2-3 примера"}.`,
    `5) Настроение: ${byId.get(5)?.answerText ?? "уточняю"}.`,
    `6) Формат: ${byId.get(6)?.answerText ?? "уточняю"}.`,
    `7) Дедлайн: ${byId.get(7)?.answerText ?? "уточняю"}.`,
    "Хочу получить 1-2 концепта и финал в согласованном формате."
  ].join("\n");
};

function getFinalResult(clarity: number, chaos: number): FinalResult {
  if (clarity >= 85) {
    return {
      title: "Бриф мечты",
      description:
        "Исполнитель счастлив, нейросети готовы к работе, хаос сидит в углу и молчит. С таким запросом уже можно делать визуал, который не просто красивый, а реально подходит под задачу.",
      recommendation:
        "Чтобы сохранить этот уровень, перед каждым заказом фиксируй цель, аудиторию, формат, настроение и сроки.",
      funnyComment: "уже подбирает шрифт без нервного тика"
    };
  }
  if (clarity >= 65) {
    return {
      title: "Почти идеальный клиент",
      description:
        "Бриф хороший, но пару деталей лучше уточнить. Исполнитель не плачет, просто задает вопросы. Это уже победа.",
      recommendation:
        "Добавь больше конкретики в референсы и форматы. Так исполнитель быстрее попадет в цель.",
      funnyComment: "вздохнул и даже сделал себе кофе"
    };
  }
  if (clarity >= 40 && chaos <= 70) {
    return {
      title: "Творческий туман",
      description:
        "Что-то понятно, что-то живет в загадочной области 'ну вы же понимаете'. Результат может получиться классным, но без уточнений исполнитель начнет разговаривать с ноутбуком.",
      recommendation:
        "Перед следующим заказом подготовь минимум 2-3 референса и четко определи формат публикации.",
      funnyComment: "поглядывает в сторону свечей и ноутбука"
    };
  }
  return {
    title: "Исполнитель плачет в углу",
    description:
      "Запрос звучит примерно так: 'сделайте красиво, но я не знаю как, а если не понравится, переделаем'. Шкала хаоса победила. Срочно нужны цель, стиль, примеры и формат.",
    recommendation:
      "Чтобы получить лучший результат, перед заказом подготовь: цель визуала, 2-3 референса, формат, настроение и дедлайн.",
    funnyComment: "тихо шепчет: 'только не правки в 3 ночи'"
  };
}

function App() {
  const [phase, setPhase] = useState<Phase>("start");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [clarity, setClarity] = useState(0);
  const [chaos, setChaos] = useState(0);
  const [timer, setTimer] = useState(TOTAL_TIME_SECONDS);
  const [reaction, setReaction] = useState("");
  const [copiedType, setCopiedType] = useState<"result" | "challenge" | "brief" | "none">("none");
  const [lunaIndex, setLunaIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerHistoryItem[]>([]);
  const [bestResult, setBestResult] = useState<BestResult | null>(null);
  const [barFlash, setBarFlash] = useState<"clarity" | "chaos" | null>(null);

  const activeQuestion = questions[currentQuestion];
  const result = useMemo(() => getFinalResult(clarity, chaos), [clarity, chaos]);
  const review = useMemo(() => buildReview(answers, clarity, chaos), [answers, clarity, chaos]);
  const briefTemplate = useMemo(() => buildBriefTemplate(answers), [answers]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BEST_RESULT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as BestResult;
      if (typeof parsed.bestClarity === "number") {
        setBestResult(parsed);
      }
    } catch {
      setBestResult(null);
    }
  }, []);

  useEffect(() => {
    if (phase !== "result") return;
    const shouldUpdate =
      !bestResult ||
      clarity > bestResult.bestClarity ||
      (clarity === bestResult.bestClarity && chaos < bestResult.bestChaos);
    if (!shouldUpdate) return;

    const nextBest = {
      bestClarity: clarity,
      bestChaos: chaos,
      bestTitle: result.title
    };
    setBestResult(nextBest);
    localStorage.setItem(BEST_RESULT_KEY, JSON.stringify(nextBest));
  }, [phase, clarity, chaos, result.title, bestResult]);

  useEffect(() => {
    if (phase !== "game") return;
    const intervalId = window.setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalId);
          setPhase("result");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [phase]);

  useEffect(() => {
    if (phase !== "game") return;
    const tipInterval = window.setInterval(() => {
      setLunaIndex((prev) => (prev + 1) % lunaTips.length);
    }, 12000);

    return () => window.clearInterval(tipInterval);
  }, [phase]);

  useEffect(() => {
    if (!reaction) return;
    const timeoutId = window.setTimeout(() => {
      setReaction("");
    }, 2400);
    return () => window.clearTimeout(timeoutId);
  }, [reaction]);

  const startGame = () => {
    setPhase("game");
    setCurrentQuestion(0);
    setClarity(0);
    setChaos(0);
    setTimer(TOTAL_TIME_SECONDS);
    setReaction("");
    setCopiedType("none");
    setLunaIndex(0);
    setAnswers([]);
    setBarFlash(null);
  };

  const finishIfNeeded = (nextQuestionIndex: number) => {
    if (nextQuestionIndex >= questions.length) {
      setPhase("result");
    } else {
      setCurrentQuestion(nextQuestionIndex);
    }
  };

  const handleAnswer = (optionId: string) => {
    if (phase !== "game") return;
    const selectedOption = activeQuestion.options.find((option) => option.id === optionId);
    if (!selectedOption) return;

    const nextClarity = clampPercent(clarity + selectedOption.clarity);
    const nextChaos = clampPercent(chaos + selectedOption.chaos);

    setClarity(nextClarity);
    setChaos(nextChaos);
    setAnswers((prev) => [
      ...prev,
      {
        questionId: activeQuestion.id,
        prompt: activeQuestion.prompt,
        answerText: selectedOption.text,
        clarityDelta: selectedOption.clarity,
        chaosDelta: selectedOption.chaos
      }
    ]);

    const isGood = selectedOption.clarity >= 12 && selectedOption.chaos === 0;
    const isChaos = selectedOption.chaos >= 15 || (selectedOption.clarity === 0 && selectedOption.chaos > 0);
    const extraReaction = isGood
      ? pickRandom(reactionPools.good)
      : isChaos
        ? pickRandom(reactionPools.chaos)
        : pickRandom(reactionPools.neutral);
    setReaction(`${selectedOption.reaction} ${extraReaction}`);
    setBarFlash(nextClarity >= clarity ? "clarity" : "chaos");
    window.setTimeout(() => setBarFlash(null), 350);
    finishIfNeeded(currentQuestion + 1);
  };

  const copyWithType = async (text: string, type: "result" | "challenge" | "brief") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      window.setTimeout(() => setCopiedType("none"), 1800);
    } catch {
      setCopiedType("none");
    }
  };

  const handleCopyResult = async () => {
    const shareText =
      `Я прошла игру 'Бриф за 60 секунд' и мой результат: ${result.title}, ясность ${clarity}%, хаос ${chaos}%. ` +
      `Кажется, мой будущий исполнитель ${result.funnyComment}.`;
    await copyWithType(shareText, "result");
  };

  const handleCopyChallenge = async () => {
    const challengeText =
      `Я в игре 'Бриф за 60 секунд' выбила ${clarity}% ясности и ${chaos}% хаоса (${result.title}). ` +
      "Повторишь мой результат или хаос победит? Проверь себя!";
    await copyWithType(challengeText, "challenge");
  };

  const handleCopyBrief = async () => {
    await copyWithType(briefTemplate, "brief");
  };

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 md:py-14">
      {phase === "start" ? <StartScreen onStart={startGame} bestResult={bestResult} /> : null}

      {phase === "game" && activeQuestion ? (
        <GameScreen
          question={activeQuestion}
          currentQuestion={currentQuestion + 1}
          totalQuestions={questions.length}
          clarity={clarity}
          chaos={chaos}
          timer={timer}
          reaction={reaction}
          lunaTip={lunaTips[lunaIndex]}
          remainingQuestions={Math.max(0, questions.length - (currentQuestion + 1))}
          barFlash={barFlash}
          onAnswer={handleAnswer}
        />
      ) : null}

      {phase === "result" ? (
        <ResultScreen
          clarity={clarity}
          chaos={chaos}
          title={result.title}
          description={result.description}
          recommendation={result.recommendation}
          review={review}
          bestResult={bestResult}
          copiedType={copiedType}
          onRestart={startGame}
          onCopyResult={handleCopyResult}
          onCopyChallenge={handleCopyChallenge}
          onCopyBrief={handleCopyBrief}
        />
      ) : null}
    </main>
  );
}

export default App;
