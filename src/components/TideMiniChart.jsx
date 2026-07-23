const WIDTH = 292;
const HEIGHT = 112;
const PAD_X = 8;
const PAD_TOP = 29;
const PAD_BOTTOM = 28;

const compactHour = (value) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: true,
  })
    .format(value)
    .replace(" ", " ");

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const fallbackCurve = () => {
  const start = new Date();
  start.setMinutes(0, 0, 0);

  return Array.from({ length: 13 }).map((_, index) => {
    const time = new Date(start);
    time.setHours(start.getHours() + index * 2);
    return {
      time: time.toISOString(),
      value: 2 + Math.sin(index / 1.7),
    };
  });
};

const pathFromPoints = (points) => {
  if (!points.length) return "";
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
};

export const TideMiniChart = ({ tide }) => {
  const now = new Date();
  const extremes = Array.isArray(tide.extremes) ? tide.extremes : [];
  const nextExtremes = extremes
    .map((point) => ({ ...point, date: new Date(point.time) }))
    .filter((point) => point.date >= now)
    .slice(0, 3);
  const defaultWindowEnd = new Date(now);
  defaultWindowEnd.setHours(now.getHours() + 18);
  const lastExtremeDate = nextExtremes[nextExtremes.length - 1]?.date;
  const windowEnd = new Date(Math.max(defaultWindowEnd.getTime(), lastExtremeDate?.getTime() ?? defaultWindowEnd.getTime()));
  windowEnd.setHours(windowEnd.getHours() + 1);

  const rawCurve = Array.isArray(tide.curve) && tide.curve.length ? tide.curve : fallbackCurve();
  const curve = rawCurve
    .map((point) => ({ ...point, date: new Date(point.time) }))
    .filter((point) => point.date >= now && point.date <= windowEnd && Number.isFinite(point.value));
  const chartCurve = curve.length > 2 ? curve : rawCurve.map((point) => ({ ...point, date: new Date(point.time) })).slice(0, 18);
  const values = chartCurve.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(0.1, max - min);
  const startTime = chartCurve[0]?.date?.getTime() ?? now.getTime();
  const endTime = chartCurve[chartCurve.length - 1]?.date?.getTime() ?? windowEnd.getTime();
  const timeRange = Math.max(1, endTime - startTime);

  const xForTime = (date) => PAD_X + ((date.getTime() - startTime) / timeRange) * (WIDTH - PAD_X * 2);
  const yForValue = (value) => PAD_TOP + (1 - (value - min) / range) * (HEIGHT - PAD_TOP - PAD_BOTTOM);

  const points = chartCurve.map((point) => ({
    x: xForTime(point.date),
    y: yForValue(point.value),
  }));
  const linePath = pathFromPoints(points);
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? WIDTH - PAD_X} ${HEIGHT - PAD_BOTTOM} L ${points[0]?.x ?? PAD_X} ${HEIGHT - PAD_BOTTOM} Z`;
  const nowX = clamp(xForTime(now), PAD_X, WIDTH - PAD_X);
  const visibleExtremes = nextExtremes.filter((point) => point.date >= new Date(startTime) && point.date <= new Date(endTime));
  const axisDates = [0, 6, 12, 18].map((offset) => {
    const date = new Date(startTime);
    date.setHours(date.getHours() + offset);
    return date;
  });

  return (
    <div className="mt-5">
      <div className="rounded-[16px] bg-[#F7F9FC] px-3 py-0">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-[110px] w-full overflow-visible">
          <path d={areaPath} fill="#DDEBF4" />
          <path d={linePath} fill="none" stroke="#18223E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
          <line x1={nowX} x2={nowX} y1={PAD_TOP - 8} y2={HEIGHT - PAD_BOTTOM + 4} stroke="#18223E" strokeOpacity="0.35" strokeWidth="1" />
          <text x={nowX} y={PAD_TOP - 20} textAnchor="middle" className="fill-[#8A94A6] text-[9px] font-black uppercase tracking-[0.14em]">
            Now
          </text>

          {visibleExtremes.map((point) => {
            const x = clamp(xForTime(point.date), PAD_X + 18, WIDTH - PAD_X - 18);
            const nearby = chartCurve.reduce((closest, curvePoint) => {
              const distance = Math.abs(curvePoint.date - point.date);
              return distance < closest.distance ? { distance, value: curvePoint.value } : closest;
            }, { distance: Number.POSITIVE_INFINITY, value: (min + max) / 2 });
            const curveY = yForValue(nearby.value);
            const textY = point.type === "H" ? clamp(curveY - 10, 11, 36) : clamp(curveY + 19, 62, HEIGHT - 13);

            return (
              <g key={`${point.type}-${point.time}`}>
                <line x1={x} x2={x} y1={Math.min(textY + 3, curveY)} y2={HEIGHT - PAD_BOTTOM + 2} stroke="#18223E" strokeOpacity="0.18" strokeWidth="1" />
                <text x={x} y={textY} textAnchor="middle" className="fill-[#101828] text-[10px] font-black">
                  {point.displayTime}
                </text>
              </g>
            );
          })}

          {axisDates.map((date) => {
            const x = clamp(xForTime(date), PAD_X, WIDTH - PAD_X);
            return (
              <g key={date.toISOString()}>
                <line x1={x} x2={x} y1={HEIGHT - PAD_BOTTOM + 2} y2={HEIGHT - PAD_BOTTOM + 6} stroke="#9AA6B8" strokeWidth="1" />
                <text x={x} y={HEIGHT - 3} textAnchor="middle" className="fill-[#8A94A6] text-[9px] font-bold">
                  {compactHour(date)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
