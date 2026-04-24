import { useEffect, useMemo, useState } from "react";
import { GameScreen } from "./components/GameScreen";
import { ResultScreen } from "./components/ResultScreen";
import { StartScreen } from "./components/StartScreen";
import { TOTAL_TIME_SECONDS, lunaTips, questions } from "./data/questions";

type Phase = "start" | "game" | "result";

type FinalResult = {
  title: string;
  description: string;
  recommendation: string;
  funnyComment: string;
};

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

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
  const [copied, setCopied] = useState(false);
  const [lunaIndex, setLunaIndex] = useState(0);

  const activeQuestion = questions[currentQuestion];
  const result = useMemo(() => getFinalResult(clarity, chaos), [clarity, chaos]);

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
    }, 7000);

    return () => window.clearInterval(tipInterval);
  }, [phase]);

  useEffect(() => {
    if (!reaction) return;
    const timeoutId = window.setTimeout(() => {
      setReaction("");
    }, 1000);
    return () => window.clearTimeout(timeoutId);
  }, [reaction]);

  const startGame = () => {
    setPhase("game");
    setCurrentQuestion(0);
    setClarity(0);
    setChaos(0);
    setTimer(TOTAL_TIME_SECONDS);
    setReaction("");
    setCopied(false);
    setLunaIndex(0);
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

    setClarity((prev) => clampPercent(prev + selectedOption.clarity));
    setChaos((prev) => clampPercent(prev + selectedOption.chaos));
    setReaction(selectedOption.reaction);
    finishIfNeeded(currentQuestion + 1);
  };

  const handleCopyResult = async () => {
    const shareText =
      `Я прошла игру 'Бриф за 60 секунд' и мой результат: ${result.title}, ясность ${clarity}%, хаос ${chaos}%. ` +
      `Кажется, мой будущий исполнитель ${result.funnyComment}.`;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 md:py-14">
      {phase === "start" ? <StartScreen onStart={startGame} /> : null}

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
          copied={copied}
          onRestart={startGame}
          onCopy={handleCopyResult}
        />
      ) : null}
    </main>
  );
}

export default App;
