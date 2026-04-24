type ProgressBarsProps = {
  clarity: number;
  chaos: number;
};

function Bar({
  label,
  value,
  colorClass
}: {
  label: string;
  value: number;
  colorClass: string;
}) {
  return (
    <div className="w-full">
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

export function ProgressBars({ clarity, chaos }: ProgressBarsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Bar
        label="Ясность"
        value={clarity}
        colorClass="bg-gradient-to-r from-emerald-400 to-cyan-400"
      />
      <Bar
        label="Хаос"
        value={chaos}
        colorClass="bg-gradient-to-r from-fuchsia-500 to-rose-500"
      />
    </div>
  );
}
