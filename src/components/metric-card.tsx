export function MetricCard({ label, value, unit, valueClass = "text-white" }: {
  label: string; value: string | number; unit?: string; valueClass?: string;
}) {
  return (
    <div className="bg-surface-container p-6 border-4 border-black flex flex-col justify-between h-[160px]">
      <h3 className="font-label text-sm uppercase text-on-surface-variant">{label}</h3>
      <div className={`font-headline text-6xl font-bold leading-none tracking-tighter ${valueClass}`}>
        {value}
        {unit && <span className="text-2xl">{unit}</span>}
      </div>
    </div>
  );
}