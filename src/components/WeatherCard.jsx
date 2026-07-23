import { Cloud, CloudRain, CloudSun, Sun, Wind } from "lucide-react";
import { Label } from "./Label";

const WeatherIcon = ({ condition }) => {
  const className = "text-[#F5C542]";
  if (condition === "rain") return <CloudRain size={25} className="text-[#5F8FB7]" />;
  if (condition === "cloudy") return <Cloud size={25} className="text-[#9AA5B8]" />;
  if (condition === "partly") return <CloudSun size={25} className={className} />;
  return <Sun size={25} className={className} />;
};

export const WeatherCard = ({ wind }) => (
  <section className="card p-6">
    <Label icon={Wind}>Weather</Label>
    <div className="mt-5 grid grid-cols-4 gap-4">
      {wind.hourlyForecast.map((hour) => (
        <div key={hour.time} className="flex h-[245px] flex-col items-center justify-between rounded-[15px] bg-[#F7F9FC] px-4 py-4 text-center">
          <div>
            <div className="text-[13px] font-black uppercase tracking-[0.12em] text-[#68758F]">{hour.time}</div>
            <div className="mt-3 grid place-items-center">
              <WeatherIcon condition={hour.condition} />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#9AA5B8]">Wind</div>
              <div className="mt-1 text-lg font-black leading-none text-[#101828]">{hour.speed}<span className="ml-0.5 text-[9px] font-bold text-[#8A94A6]">mph</span></div>
              <div className="mt-1 text-[10px] font-black text-[#68758F]">{hour.direction}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#9AA5B8]">Temp</div>
              <div className="mt-1 text-lg font-black leading-none text-[#101828]">{hour.temp}&deg;</div>
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A48931]">Real Feel</div>
              <div className="mt-1 text-lg font-black leading-none text-[#101828]">{hour.realFeel}&deg;</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);
