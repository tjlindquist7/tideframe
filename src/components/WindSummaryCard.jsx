import React from "react";
import { Navigation, Wind, X } from "lucide-react";
import { Label } from "./Label";

const compassNeedleRotation = (degrees) => (Number.isFinite(Number(degrees)) ? Number(degrees) - 45 : 0);
const WINDY_EMBED_URL =
  "https://embed.windy.com/embed2.html?lat=39.563&lon=-74.243&detailLat=39.563&detailLon=-74.243&width=1280&height=800&zoom=8&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=true&metricWind=mph&metricTemp=%C2%B0F&radarRange=-1";

export const WindSummaryCard = ({ wind, isReady = true }) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    if (!isFullscreen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsFullscreen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsFullscreen(true)}
        aria-label="Open Windy wind map full screen"
        className="card block px-5 pb-5 pt-4 text-left transition active:scale-[0.99]"
      >
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
      </button>

      {isFullscreen ? (
        <div className="fixed inset-0 z-50 bg-[#07101F]">
          <div className="absolute left-6 top-5 z-10 rounded-[16px] bg-white/95 px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
            <Label icon={Wind}>Windy.com Wind Map</Label>
          </div>
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            aria-label="Close full screen Windy map"
            className="absolute right-6 top-5 z-10 grid h-12 w-12 place-items-center rounded-[16px] bg-white text-[#101828] shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition active:scale-95"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
          <iframe
            title="Windy.com wind map"
            src={WINDY_EMBED_URL}
            className="h-full w-full border-0"
            allowFullScreen
          />
        </div>
      ) : null}
    </>
  );
};
