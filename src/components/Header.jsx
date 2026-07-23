import { Dot, MapPin, RefreshCw, Waves } from "lucide-react";

export const Header = ({ conditions, isWeatherReady = true, isRefreshing = false, onRefresh }) => (
  <header className="flex h-16 items-center justify-between border-b border-[#E6EBF2] bg-[#FAFBFC] px-8">
    <div className="flex items-center gap-9">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-[12px] bg-[#192643] text-[#5CC7F7] shadow-[0_8px_18px_rgba(25,38,67,0.16)]">
          <Waves size={17} strokeWidth={2.4} />
        </div>
        <div className="text-lg font-extrabold tracking-[-0.01em] text-ink">TideFrame</div>
      </div>
      <div className="flex items-center gap-2 text-sm font-semibold text-[#7D89A3]">
        <MapPin size={14} />
        <span>{conditions.spot}</span>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex items-center text-xs font-bold text-[#8390AA]">
        <Dot size={25} className={isWeatherReady ? "text-[#3EA869]" : "text-[#F5C542]"} />
        <span>{isRefreshing ? "Refreshing data" : isWeatherReady ? `Updated ${conditions.updatedAt}` : "Updating weather"}</span>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        aria-label="Refresh TideFrame data"
        title="Refresh data"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-[14px] border border-[#DDE5EF] bg-white px-4 text-[12px] font-black uppercase tracking-[0.16em] text-[#101828] shadow-[0_8px_18px_rgba(25,38,67,0.08)] transition hover:border-[#C8D3E2] active:scale-95 disabled:cursor-wait disabled:text-[#8A94A6]"
      >
        <RefreshCw size={15} strokeWidth={2.5} className={isRefreshing ? "animate-spin" : ""} />
        <span>Refresh</span>
      </button>
    </div>
  </header>
);
