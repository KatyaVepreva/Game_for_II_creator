type ProgressBarsProps = {
  clarity: number;
  chaos: number;
  flash?: "clarity" | "chaos" | null;
};

function Bar({
  label,
  value,
  colorClass,
  isFlashing
}: {
  label: string;
  value: number;
  colorClass: string;
  isFlashing: boolean;
}) {
  return (
    <div className={`w-full rounded-lg p-1 transition ${isFlashing ? "bar-flash" : ""}`}>
      <div className="mb-1 flex items-center justify-between text-xs text-textSoft">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/10">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function ProgressBars({ clarity, chaos, flash = null }: ProgressBarsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Bar
        label="Ясность"
        value={clarity}
        colorClass="bg-gradient-to-r from-emerald-400 to-cyan-400"
        isFlashing={flash === "clarity"}
      />
      <Bar
        label="Хаос"
        value={chaos}
        colorClass="bg-gradient-to-r from-fuchsia-500 to-rose-500"
        isFlashing={flash === "chaos"}
      />
    </div>
  );
}
