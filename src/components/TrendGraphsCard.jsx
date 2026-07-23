import { BarChart3 } from "lucide-react";
import { Label } from "./Label";

const BLUE = "#286C9F";
const AXIS_X = [56, 180, 304, 428, 552];

const graphPoints = (values, { min, max }) => {
  const span = max - min || 1;
  return values.map((value, index) => {
    const x = AXIS_X[index];
    const y = 16 + (1 - (value - min) / span) * 72;
    return `${x},${y}`;
  });
};

const LineGraph = ({ title, unit, values, times, min, max, fillId }) => {
  const points = graphPoints(values, { min, max });
  const yTicks = [max, Math.round((max + min) / 2), min];
  const area = `${points[0]} ${points.join(" ")} ${points[points.length - 1].split(",")[0]},90 ${AXIS_X[0]},90`;

  return (
    <div>
      <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6E7DA0]">
        {title} <span className="tracking-[0.12em] text-[#8A94A6]">({unit})</span>
      </div>
      <div className="rounded-[16px] bg-[#F7F9FC] px-4 py-2">
        <svg viewBox="0 0 608 112" className="h-[94px] w-full overflow-visible">
          <defs>
            <linearGradient id={fillId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={BLUE} stopOpacity="0.18" />
              <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
            </linearGradient>
          </defs>
          {yTicks.map((tick, index) => (
            <g key={tick}>
              <line x1="42" x2="564" y1={18 + index * 34} y2={18 + index * 34} stroke="#E5EAF1" strokeDasharray="3 6" />
              <text x="6" y={23 + index * 34} fill="#7D89A3" fontSize="10" fontWeight="800">{tick}</text>
            </g>
          ))}
          <polygon points={area} fill={`url(#${fillId})`} />
          <line x1={AXIS_X[3]} x2={AXIS_X[3]} y1="12" y2="90" stroke="#C9D3DE" strokeWidth="2" />
          <text x={AXIS_X[3]} y="10" textAnchor="middle" fill="#C0C8D4" fontSize="10" fontWeight="900">NOW</text>
          <polyline points={points.join(" ")} fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((point) => {
            const [x, y] = point.split(",").map(Number);
            return <circle key={point} cx={x} cy={y} r="4" fill={BLUE} stroke="#FFFFFF" strokeWidth="3" />;
          })}
          {times.map((time, index) => (
            <text key={time} x={AXIS_X[index]} y="108" textAnchor="middle" fill="#8A94A6" fontSize="10" fontWeight="800">{time}</text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export const TrendGraphsCard = ({ graphs }) => (
  <section className="card p-5">
    <Label icon={BarChart3}>Forecast Trends</Label>
    <div className="mt-3 space-y-3">
      <LineGraph title="Wave Height" unit="ft" values={graphs.waveHeight} times={graphs.times} min={1} max={3} fillId="waveTrendFill" />
      <LineGraph title="Wind" unit="mph" values={graphs.windSpeed} times={graphs.times} min={0} max={20} fillId="windTrendFill" />
    </div>
  </section>
);
