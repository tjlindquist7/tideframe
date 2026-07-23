import { TideMiniChart } from "./TideMiniChart";

const conditionColors = {
  Good: {
    text: "text-[#1F6B3D]",
    bar: "bg-[#1F6B3D]",
  },
  "Fair to Good": {
    text: "text-[#BDE7CB]",
    bar: "bg-[#BDE7CB]",
  },
  Fair: {
    text: "text-[#BDE7CB]",
    bar: "bg-[#BDE7CB]",
  },
  "Poor to Fair": {
    text: "text-[#F5C542]",
    bar: "bg-[#F5C542]",
  },
  Poor: {
    text: "text-[#F3B1B1]",
    bar: "bg-[#F3B1B1]",
  },
};

const currentConditionColor = (condition) => conditionColors[condition.label] ?? conditionColors.Fair;

export const SurfHeightCard = ({ condition, waterTemp, tide }) => (
  <div>
    <h1 className={`mt-3 max-w-[240px] text-[30px] font-black uppercase leading-[0.95] tracking-[-0.045em] ${currentConditionColor(condition).text}`}>
      {condition.label}
    </h1>
    <div className="mt-3 grid grid-cols-5 gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={`h-[4px] rounded-full ${index < condition.rating ? currentConditionColor(condition).bar : "bg-[#DDE4EC]"}`}
        />
      ))}
    </div>

    <div className="mt-3 grid grid-cols-2 items-start gap-5">
      <div>
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#6E7DA0]">Surf</div>
        <div className="flex items-end gap-2">
          <div className="text-[58px] font-black leading-[0.86] tracking-[-0.075em] text-[#101828]">{condition.height}</div>
          <div className="mb-1 text-lg font-bold text-[#101828]">{condition.unit}</div>
        </div>
      </div>
      <div>
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#6E7DA0]">Water Temp</div>
        <div className="flex items-end gap-2">
          <div className="text-[58px] font-black leading-[0.86] tracking-[-0.075em] text-[#101828]">{waterTemp.value}&deg;</div>
          <div className="mb-1 text-lg font-bold text-[#101828]">{waterTemp.unit}</div>
        </div>
      </div>
    </div>

    <TideMiniChart tide={tide} />
  </div>
);
