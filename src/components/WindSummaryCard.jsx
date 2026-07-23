import { Navigation, Wind } from "lucide-react";
import { Label } from "./Label";

const compassNeedleRotation = (degrees) => (Number.isFinite(Number(degrees)) ? Number(degrees) - 45 : 0);

export const WindSummaryCard = ({ wind, isReady = true }) => (
  <section className="card px-5 pb-5 pt-4">
    <Label icon={Wind}>Wind</Label>
    <div className="mt-5 grid place-items-center">
      <div className="grid h-14 w-14 place-items-center rounded-full border border-[#CCD7E4] bg-[#F4F7FB]">
        <Navigation
          size={25}
          className="fill-[#5F7F9D] text-[#5F7F9D]"
          style={{ transform: `rotate(${isReady ? compassNeedleRotation(wind.directionDegrees) : 0}deg)` }}
        />
      </div>
    </div>
    <div className="mt-5 text-center">
      <div className="text-[50px] font-black leading-none tracking-[-0.07em] text-[#18223E]">{isReady ? wind.speed : "--"}</div>
      <div className="mt-1 text-sm font-bold text-[#6D7893]">{wind.unit}</div>
      <div className="mt-5 text-xl font-black text-[#101828]">{isReady ? wind.direction : "Updating"}</div>
      <div className="mt-2 text-xs font-semibold leading-relaxed text-[#8490AA]">
        Gusts<br />
        <span className="text-base font-black text-[#18223E]">{isReady ? `${wind.gusts} mph` : "--"}</span>
      </div>
    </div>
  </section>
);
