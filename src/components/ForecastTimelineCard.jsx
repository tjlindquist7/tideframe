import { ArrowDown, ArrowUp, BarChart3 } from "lucide-react";
import { Label } from "./Label";

const AXIS_X = [82, 202, 322, 442, 562];
const NAVY = "#17213A";

const graphPoints = (values, { min, max, height = 132, padTop = 16, padBottom = 30 }) => {
  const span = max - min || 1;
  return values.map((value, index) => {
    const x = AXIS_X[index];
    const y = padTop + (1 - (value - min) / span) * (height - padTop - padBottom);
    return `${x},${y}`;
  });
};

const TideCurve = ({ tide }) => (
  <div>
    <div className="flex items-start justify-between">
      <Label icon={ArrowUp}>Tide</Label>
    </div>
    <div className="mt-3 grid grid-cols-2 gap-3">
      <div className="rounded-[15px] bg-[#EEF6FF] px-4 py-3">
        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B8FD0]"><ArrowUp size={12} /> High</div>
        <div className="mt-2 text-xl font-black tracking-[-0.03em] text-[#101828]">{tide.high}</div>
      </div>
      <div className="rounded-[15px] bg-[#F4F6FA] px-4 py-3">
        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7B87A2]"><ArrowDown size={12} /> Low</div>
        <div className="mt-2 text-xl font-black tracking-[-0.03em] text-[#101828]">{tide.low}</div>
      </div>
    </div>
    <div className="relative mt-3 h-[124px] overflow-hidden rounded-[16px] bg-[#F8FBFD]">
      <svg viewBox="0 0 626 170" className="h-full w-full">
        <defs>
          <linearGradient id="tideFillRight" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#BCD1DC" stopOpacity="0.62" />
            <stop offset="100%" stopColor="#D9E6EC" stopOpacity="0.42" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="626" height="170" fill="#F8FBFD" />
        {[42, 78, 114, 150, 186, 222, 258, 294, 330, 366, 402, 438, 474, 510, 546, 582].map((x, index) => (
          <line key={x} x1={x} x2={x} y1={118} y2={index % 3 === 0 ? 132 : 126} stroke="#A9B8C4" strokeWidth="1" opacity="0.7" />
        ))}
        <line x1="0" x2="626" y1="118" y2="118" stroke="#9FB0BD" strokeWidth="1.2" />
        <path d="M0 84 C52 70 82 68 126 86 C176 106 202 116 250 108 C304 99 328 74 380 68 C436 62 468 84 512 98 C552 112 584 116 626 94 L626 118 L0 118 Z" fill="url(#tideFillRight)" />
        <path d="M0 84 C52 70 82 68 126 86 C176 106 202 116 250 108 C304 99 328 74 380 68 C436 62 468 84 512 98 C552 112 584 116 626 94" fill="none" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
        <line x1="438" x2="438" y1="84" y2="118" stroke="#89A4B6" strokeWidth="2" />
        <circle cx="438" cy="84" r="8" fill={NAVY} stroke="#FFFFFF" strokeWidth="4" />
        <text x="438" y="55" textAnchor="middle" fill="#6B7FA2" fontSize="12" fontWeight="800" letterSpacing="2">NOW</text>
        {[
          { label: "6 AM", x: AXIS_X[0] },
          { label: "9 AM", x: AXIS_X[1] },
          { label: "12 PM", x: AXIS_X[2] },
          { label: "3 PM", x: AXIS_X[3] },
          { label: "6 PM", x: AXIS_X[4] }
        ].map((tick) => (
          <text key={tick.label} x={tick.x} y="154" textAnchor="middle" fill="#8A94A6" fontSize="13" fontWeight="800">{tick.label}</text>
        ))}
      </svg>
    </div>
  </div>
);

const LineGraph = ({ title, unit, values, times, min, max, color, fillId, nowIndex = 3 }) => {
  const points = graphPoints(values, { min, max });
  const [nowX] = points[nowIndex].split(",").map(Number);
  const area = `${points[0]} ${points.join(" ")} ${points[points.length - 1].split(",")[0]},86 42,86`;
  const yTicks = [max, Math.round((max + min) / 2), min];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6E7DA0]">{title} <span className="tracking-[0.12em] text-[#8A94A6]">({unit})</span></div>
      </div>
      <div className="rounded-[16px] bg-[#F7F9FC] px-4 py-2">
        <svg viewBox="0 0 626 136" className="h-[124px] w-full overflow-visible">
          <defs>
            <linearGradient id={fillId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {yTicks.map((tick, index) => (
            <g key={tick}>
              <line x1="42" x2="582" y1={18 + index * 40} y2={18 + index * 40} stroke="#E5EAF1" strokeDasharray="3 6" />
              <text x="8" y={23 + index * 40} fill="#7D89A3" fontSize="10" fontWeight="800">{tick}</text>
            </g>
          ))}
          <polygon points={area} fill={`url(#${fillId})`} />
          <line x1={nowX} x2={nowX} y1="12" y2="86" stroke="#C9D3DE" strokeWidth="2" />
          <text x={nowX} y="10" textAnchor="middle" fill="#C0C8D4" fontSize="11" fontWeight="900">NOW</text>
          <polyline points={points.join(" ")} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((point) => {
            const [x, y] = point.split(",").map(Number);
            return <circle key={point} cx={x} cy={y} r="4" fill={color} stroke="#FFFFFF" strokeWidth="3" />;
          })}
          {times.map((time, index) => (
            <text key={time} x={AXIS_X[index]} y="132" textAnchor="middle" fill="#8A94A6" fontSize="10" fontWeight="800">{time}</text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export const ForecastTimelineCard = ({ tide, graphs }) => (
  <section className="card p-6">
    <TideCurve tide={tide} />
    <div className="mt-3">
      <Label icon={BarChart3}>Forecast Trends</Label>
      <div className="mt-3 grid grid-rows-2 gap-3">
        <LineGraph title="Wave Height" unit="ft" values={graphs.waveHeight} times={graphs.times} min={1} max={3} color={NAVY} fillId="waveLineFill" />
        <LineGraph title="Wind" unit="mph" values={graphs.windSpeed} times={graphs.times} min={0} max={20} color={NAVY} fillId="windLineFill" />
      </div>
    </div>
  </section>
);
