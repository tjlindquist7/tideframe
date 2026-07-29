import React from "react";
import { X } from "lucide-react";

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

const tideTimesText = (times) => (Array.isArray(times) && times.length ? times.join("  /  ") : "--");

const TideTimesTable = ({ days }) => (
  <div className="w-full rounded-[16px] border border-[#E0E7F0] bg-white/85 px-6 py-5 shadow-[0_14px_34px_rgba(20,32,55,0.06)]">
    <div className="grid grid-cols-[0.9fr_1.35fr_1.35fr] border-b border-[#E7EDF4] pb-3 text-[12px] font-black uppercase tracking-[0.18em] text-[#68758F]">
      <div>Day</div>
      <div>High Tide</div>
      <div>Low Tide</div>
    </div>
    <div className="divide-y divide-[#E7EDF4]">
      {days.map((day) => (
        <div key={day.day} className="grid grid-cols-[0.9fr_1.35fr_1.35fr] items-center py-4">
          <div className="text-[18px] font-black text-[#101828]">{day.day}</div>
          <div className="text-[18px] font-bold text-[#101828]">{tideTimesText(day.highs)}</div>
          <div className="text-[18px] font-bold text-[#101828]">{tideTimesText(day.lows)}</div>
        </div>
      ))}
    </div>
  </div>
);

const TideChartSvg = ({ areaPath, linePath, nowX, visibleExtremes, chartCurve, min, max, yForValue, xForTime, axisDates, className, isExpanded = false }) => (
  <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={className} preserveAspectRatio="xMidYMid meet">
    {isExpanded ? <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="transparent" /> : null}
    <path d={areaPath} fill="#DDEBF4" />
    <path d={linePath} fill="none" stroke="#18223E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
    <line x1={nowX} x2={nowX} y1={PAD_TOP - 8} y2={isExpanded ? HEIGHT - PAD_BOTTOM + 22 : HEIGHT - PAD_BOTTOM + 4} stroke="#18223E" strokeOpacity="0.35" strokeWidth="1" />
    <text x={nowX} y={PAD_TOP - 20} textAnchor="middle" className="fill-[#8A94A6] text-[9px] font-black uppercase tracking-[0.14em]">
      Now
    </text>
    {isExpanded ? (
      <>
        <text x={nowX - 3} y={PAD_TOP - 3} textAnchor="end" className="fill-[#68758F] text-[5px] font-black uppercase tracking-[0.14em]">
          High Tide
        </text>
        <text x={nowX - 3} y={HEIGHT - 15} textAnchor="end" className="fill-[#68758F] text-[5px] font-black uppercase tracking-[0.14em]">
          Low Tide
        </text>
      </>
    ) : null}

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
          <line
            x1={x}
            x2={x}
            y1={curveY - (isExpanded ? 6.5 : 2)}
            y2={curveY + (isExpanded ? 6.5 : 2)}
            stroke="#9AA6B8"
            strokeWidth="1"
          />
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
          <line x1={x} x2={x} y1={isExpanded ? HEIGHT - PAD_BOTTOM + 9 : HEIGHT - PAD_BOTTOM + 2} y2={isExpanded ? HEIGHT - PAD_BOTTOM + 22 : HEIGHT - PAD_BOTTOM + 6} stroke="#9AA6B8" strokeWidth="1" />
          <text x={x} y={isExpanded ? HEIGHT + 4 : HEIGHT - 3} textAnchor="middle" className="fill-[#8A94A6] text-[9px] font-bold">
            {compactHour(date)}
          </text>
        </g>
      );
    })}
  </svg>
);

export const TideMiniChart = ({ tide }) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const openFullscreen = React.useCallback(() => setIsFullscreen(true), []);
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
  const expandedYForValue = yForValue;
  const expandedPoints = chartCurve.map((point) => ({
    x: xForTime(point.date),
    y: expandedYForValue(point.value),
  }));
  const linePath = pathFromPoints(points);
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? WIDTH - PAD_X} ${HEIGHT - PAD_BOTTOM} L ${points[0]?.x ?? PAD_X} ${HEIGHT - PAD_BOTTOM} Z`;
  const expandedLinePath = pathFromPoints(expandedPoints);
  const expandedFillBaseline = HEIGHT - PAD_BOTTOM + 20;
  const expandedAreaPath = `${expandedLinePath} L ${expandedPoints[expandedPoints.length - 1]?.x ?? WIDTH - PAD_X} ${expandedFillBaseline} L ${expandedPoints[0]?.x ?? PAD_X} ${expandedFillBaseline} Z`;
  const nowX = clamp(xForTime(now), PAD_X, WIDTH - PAD_X);
  const visibleExtremes = nextExtremes.filter((point) => point.date >= new Date(startTime) && point.date <= new Date(endTime));
  const axisDates = [0, 6, 12, 18].map((offset) => {
    const date = new Date(startTime);
    date.setHours(date.getHours() + offset);
    return date;
  });
  const dailyExtremes = Array.isArray(tide.dailyExtremes) && tide.dailyExtremes.length
    ? tide.dailyExtremes.slice(0, 3)
    : [
        {
          day: "Today",
          highs: Array.isArray(tide.highTimes) && tide.highTimes.length ? tide.highTimes : tide.high ? [tide.high] : [],
          lows: Array.isArray(tide.lowTimes) && tide.lowTimes.length ? tide.lowTimes : tide.low ? [tide.low] : [],
        },
      ];

  React.useEffect(() => {
    if (!isFullscreen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsFullscreen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const chartProps = {
    areaPath,
    linePath,
    nowX,
    visibleExtremes,
    chartCurve,
    min,
    max,
    yForValue,
    xForTime,
    axisDates,
  };
  const expandedChartProps = {
    ...chartProps,
    areaPath: expandedAreaPath,
    linePath: expandedLinePath,
    yForValue: expandedYForValue,
  };

  return (
    <>
      <div className="mt-5">
        <button
          type="button"
          onClick={openFullscreen}
          onPointerUp={openFullscreen}
          aria-label="Open tide chart full screen"
          style={{ touchAction: "manipulation" }}
          className="block w-full cursor-pointer rounded-[16px] bg-[#F7F9FC] px-3 py-0 text-left transition active:scale-[0.99]"
        >
          <TideChartSvg {...chartProps} className="pointer-events-none h-[110px] w-full overflow-visible" />
        </button>
      </div>

      {isFullscreen ? (
        <div className="fixed inset-0 z-50 bg-[#F3F5F7] p-8">
          <div className="flex h-full flex-col overflow-hidden rounded-[20px] bg-white p-8 shadow-[0_24px_80px_rgba(20,32,55,0.18)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#68758F]">Tide Chart</div>
                <div className="mt-2 text-[32px] font-black leading-none tracking-[-0.04em] text-[#101828]">Beach Haven, NJ</div>
              </div>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                aria-label="Close full screen tide chart"
                className="grid h-12 w-12 place-items-center rounded-[16px] border border-[#DDE5EF] bg-white text-[#101828] shadow-[0_14px_32px_rgba(20,32,55,0.12)] transition active:scale-95"
              >
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>
            <div className="mt-8 flex flex-1 flex-col rounded-[18px] bg-[#F7F9FC] px-10 pb-8 pt-5">
              <div className="grid min-h-0 flex-1 place-items-center overflow-visible">
                <div className="grid w-[calc(100%-68px)] justify-self-end place-items-center overflow-visible pt-[28px]">
                  <TideChartSvg {...expandedChartProps} isExpanded className="h-[285px] w-full overflow-visible" />
                </div>
              </div>
              <TideTimesTable days={dailyExtremes} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
