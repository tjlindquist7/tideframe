import { ThermometerSun } from "lucide-react";
import { Label } from "./Label";

export const TemperatureCard = ({ wind, waterTemp }) => (
  <section className="card flex flex-col p-6">
    <Label icon={ThermometerSun}>Temperature</Label>

    <div className="mt-6 flex min-h-0 flex-1 flex-col gap-4">
      <div className="rounded-[16px] bg-[#F5F8FC] px-5 py-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7B87A2]">Air Temp</div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#9AA5B8]">Air</div>
            <div className="mt-1 text-[30px] font-black leading-none tracking-[-0.05em] text-[#101828]">{wind.airTemp}&deg;</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#A48931]">Feels Like</div>
            <div className="mt-1 text-[30px] font-black leading-none tracking-[-0.05em] text-[#101828]">{wind.realFeel}&deg;</div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center rounded-[16px] bg-[#EAF8EF] px-5 py-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B9A70]">Water Temp</div>
        <div className="mt-3 text-[54px] font-black leading-none tracking-[-0.07em] text-[#2D834B]">{waterTemp.value}&deg; <span className="text-2xl tracking-normal">{waterTemp.unit}</span></div>
      </div>
    </div>
  </section>
);
