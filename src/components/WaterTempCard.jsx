import { Thermometer } from "lucide-react";
import { Label, Pill } from "./Label";

export const WaterTempCard = ({ waterTemp }) => (
  <section className="card flex flex-col justify-between p-6">
    <div>
      <Label icon={Thermometer}>Water Temp</Label>
      <div className="mt-7 flex items-end gap-3 text-[#2D834B]">
        <div className="text-[76px] font-black leading-[0.86] tracking-[-0.06em]">{waterTemp.value}°</div>
        <div className="mb-2 text-lg font-extrabold text-[#71809E]">{waterTemp.unit}</div>
      </div>
      <Pill className="mt-6 inline-flex bg-[#EAF8EF] text-[#027A38]">{waterTemp.status}</Pill>
    </div>
    <div>
      <div className="mb-4 h-px bg-[#E6EAF0]" />
      <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#6E7DA0]">Best Window</div>
      <div className="mt-2 text-xl font-black tracking-[-0.03em] text-[#101828]">{waterTemp.bestWindow}</div>
    </div>
  </section>
);
