import { Navigation, Wind } from "lucide-react";
import { Label, Pill } from "./Label";

export const WindCard = ({ wind }) => {
  const chartWidth = 590;
  const xStep = chartWidth / (wind.nextHours.length - 1);
  const shifted = wind.nextHours.map((value, index) => {
    const x = 36 + index * xStep;
    const y = 132 - value * 4.4;
    return `${x},${y}`;
  });

  return (
    <section className="card p-6">
      <div className="flex items-start justify-between">
        <Label icon={Wind}>Wind</Label>
        <Pill className="bg-[#EAF8EF] text-[#027A38]">{wind.status}</Pill>
      </div>

      <div className="mt-5 flex items-center gap-5">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-[#D1D8E4] bg-[#F4F7FB]">
          <Navigation size={29} className="rotate-[292deg] fill-[#57B879] text-[#57B879]" />
        </div>
        <div className="flex items-end gap-2">
          <div className="text-[58px] font-black leading-none tracking-[-0.06em] text-[#18223E]">{wind.speed}</div>
          <div className="mb-3 text-base font-semibold text-[#6D7893]">{wind.unit}</div>
        </div>
        <div className="pt-3">
          <div className="text-lg font-black leading-none text-[#111C35]">{wind.direction}</div>
          <div className="mt-2 text-xs font-semibold text-[#8490AA]">Gusts {wind.gusts} mph</div>
        </div>
      </div>

      <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#6E7DA0]">Next 6 hours</div>
      <div className="relative mt-2 h-[145px]">
        <svg viewBox="0 0 662 168" className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id="windAreaTall" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#5CCB86" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#5CCB86" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[20, 10, 0].map((tick, i) => (
            <g key={tick}>
              <line x1="36" x2="626" y1={28 + i * 52} y2={28 + i * 52} stroke="#EDF1F6" strokeDasharray="3 7" />
              <text x="4" y={33 + i * 52} fill="#7D89A3" fontSize="12" fontWeight="800">{tick}</text>
            </g>
          ))}
          <polygon points={`36,138 ${shifted.join(" ")} 626,138`} fill="url(#windAreaTall)" />
          <polyline points={shifted.join(" ")} fill="none" stroke="#38B96B" strokeWidth="3" strokeLinecap="round" />
          {["Now", "1h", "2h", "3h", "4h", "5h", "6h"].map((label, index) => (
            <g key={label}>
              <text x={36 + index * xStep} y="154" textAnchor="middle" fill="#68758F" fontSize="13" fontWeight="900">{label}</text>
              <text x={36 + index * xStep} y="169" textAnchor="middle" fill="#8E99AD" fontSize="12" fontWeight="900">{wind.hourlyDirections[index]}</text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
};
