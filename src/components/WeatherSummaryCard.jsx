import { Cloud, CloudRain, CloudSun, Sun } from "lucide-react";
import { Label } from "./Label";

const WeatherIcon = ({ condition }) => {
  if (condition === "rain") return <CloudRain size={28} className="text-[#5F8FB7]" />;
  if (condition === "cloudy") return <Cloud size={28} className="text-[#9AA5B8]" />;
  if (condition === "partly") return <CloudSun size={28} className="text-[#F5C542]" />;
  return <Sun size={28} className="text-[#F5C542]" />;
};

const LoadingTile = ({ label }) => (
  <div className="flex h-[176px] flex-col items-center justify-center rounded-[16px] bg-[#F7F9FC] px-4 py-4 text-center">
    <div className="text-[12px] font-black uppercase tracking-[0.14em] text-[#68758F]">{label}</div>
    <div className="mt-5 h-12 w-12 rounded-full border border-[#E2E8F0] bg-white shadow-sm" />
    <div className="mt-6 text-[34px] font-black leading-none tracking-[-0.055em] text-[#C4CBD6]">--</div>
    <div className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-[#C4CBD6]">Updating</div>
  </div>
);

export const WeatherSummaryCard = ({ forecast, sun, isReady = true }) => (
  <section className="card px-6 pb-6 pt-5">
    <div className="flex items-start justify-between gap-4">
      <Label>Weather</Label>
    </div>
    <div className="mt-4 grid grid-cols-4 gap-3">
      {(isReady ? forecast : [{ time: "Now" }, { time: "+2 hr" }, { time: "+4 hr" }, { time: "+6 hr" }]).map((hour) => (
        !isReady ? <LoadingTile key={hour.time} label={hour.time} /> :
        <div key={hour.time} className="flex h-[206px] flex-col items-center rounded-[16px] bg-[#F7F9FC] px-4 pb-4 pt-5 text-center">
          <div className="text-[12px] font-black uppercase tracking-[0.14em] text-[#68758F]">{hour.time}</div>
          <div className="mt-4 grid h-12 w-12 place-items-center rounded-full border border-[#E2E8F0] bg-white shadow-sm">
            <WeatherIcon condition={hour.condition} />
          </div>
          <div className="mt-auto text-[38px] font-black leading-none tracking-[-0.055em] text-[#101828]">{hour.temp}&deg;</div>
          <div className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#A48931]">Feels {hour.realFeel}&deg;</div>
          <div className="mt-2 flex items-start justify-center gap-2 leading-none text-[#101828]">
            <div>
              <div className="text-[18px] font-black tracking-[-0.04em]">{hour.speed}</div>
              <div className="mt-0.5 text-[8px] font-bold">mph</div>
            </div>
            <div className="pt-1.5 text-[13px] font-black uppercase tracking-[0.12em]">{hour.direction}</div>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-1 grid grid-cols-2 border-t border-[#E6EAF0] pt-2">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between pr-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A94A6]">First Light</span>
          <span className="text-sm font-black text-[#101828]">{isReady ? (sun?.firstLight ?? "--") : "--"}</span>
        </div>
        <div className="flex items-baseline justify-between pr-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A48931]">Sunrise</span>
          <span className="text-sm font-black text-[#101828]">{isReady ? (sun?.sunrise ?? "--") : "--"}</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline justify-between pl-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A94A6]">Last Light</span>
          <span className="text-sm font-black text-[#101828]">{isReady ? (sun?.lastLight ?? "--") : "--"}</span>
        </div>
        <div className="flex items-baseline justify-between pl-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A48931]">Sunset</span>
          <span className="text-sm font-black text-[#101828]">{isReady ? (sun?.sunset ?? "--") : "--"}</span>
        </div>
      </div>
    </div>
  </section>
);
