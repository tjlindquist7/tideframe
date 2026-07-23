import { Label } from "./Label";

const ratingStyles = {
  good: "bg-[#BDE7CB] text-[#101828]",
  fair: "bg-[#F5C542] text-[#101828]",
  poor: "bg-[#F3B1B1] text-[#101828]",
};

const ForecastBox = ({ period, forecast }) => (
  <div className="h-[78px] overflow-hidden rounded-[13px] border border-[#E5EAF1] bg-white text-center shadow-[0_10px_20px_rgba(20,32,55,0.05)]">
    <div className={`grid h-5 place-items-center text-[9px] font-black uppercase tracking-[0.18em] ${ratingStyles[forecast.rating]}`}>
      {period}
    </div>
    <div className="grid h-[58px] place-items-center px-2">
      <div className="space-y-1">
        <div className="text-[19px] font-black leading-none tracking-[-0.04em] text-[#101828]">{forecast.height}</div>
        <div className="text-[12px] font-semibold leading-none text-[#516078]">{forecast.wind} mph</div>
        <div className="text-[12px] font-semibold leading-none text-[#516078]">{forecast.direction}</div>
      </div>
    </div>
  </div>
);

export const SurfForecastCard = ({ outlook }) => (
  <section className="card p-5">
    <div className="flex items-start justify-between">
      <Label>3 Day Surf Outlook</Label>
      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8A94A6]">Surf / Wind</div>
    </div>
    <div className="mt-4 grid h-[258px] grid-cols-3 gap-3">
      {outlook.slice(0, 3).map((day) => (
        <div key={day.day} className="flex min-w-0 flex-col rounded-[16px] border border-[#E8EDF3] bg-[#F8FAFC] px-3 py-4 shadow-[0_10px_22px_rgba(20,32,55,0.04)]">
          <div className="text-center">
            <div className="flex h-12 items-center justify-center text-[17px] font-semibold leading-tight text-[#6B7280]">{day.day}</div>
          </div>

          <div className="mt-auto space-y-3">
            <ForecastBox period="AM" forecast={day.am} />
            <ForecastBox period="PM" forecast={day.pm} />
          </div>
        </div>
      ))}
    </div>
  </section>
);
