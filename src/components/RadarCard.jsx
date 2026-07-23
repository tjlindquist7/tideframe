import React from "react";
import { RadioTower, X } from "lucide-react";
import { Label } from "./Label";

const RADAR_URL = "https://radar.weather.gov/ridge/standard/KDIX_0.gif";
const RADAR_REFRESH_MS = 5 * 60 * 1000;

const formatUpdateTime = (date) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

export const RadarCard = () => {
  const [radarVersion, setRadarVersion] = React.useState(() => Date.now());
  const [updatedAt, setUpdatedAt] = React.useState("");
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRadarVersion(Date.now());
    }, RADAR_REFRESH_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  React.useEffect(() => {
    if (!isFullscreen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsFullscreen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const radarSrc = `${RADAR_URL}?v=${radarVersion}`;

  return (
    <>
      <section className="card overflow-hidden p-5">
        <div className="flex items-center justify-between">
          <Label icon={RadioTower}>Weather Radar</Label>
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8A94A6]">
            NWS KDIX{updatedAt ? ` - Updated ${updatedAt}` : ""}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          aria-label="Open weather radar full screen"
          className="mt-4 block h-[256px] w-full overflow-hidden rounded-[16px] border border-[#E1E7EF] bg-[#F7F9FC] text-left transition active:scale-[0.99]"
        >
          <img
            src={radarSrc}
            alt="National Weather Service radar for KDIX"
            className="h-full w-full object-cover"
            onLoad={() => setUpdatedAt(formatUpdateTime(new Date()))}
          />
        </button>
      </section>

      {isFullscreen ? (
        <div className="fixed inset-0 z-50 bg-[#07101F]">
          <div className="absolute left-6 top-5 z-10 flex items-center gap-3 rounded-[16px] bg-white/95 px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
            <Label icon={RadioTower}>Weather Radar</Label>
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8A94A6]">
              NWS KDIX{updatedAt ? ` - Updated ${updatedAt}` : ""}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            aria-label="Close full screen radar"
            className="absolute right-6 top-5 z-10 grid h-12 w-12 place-items-center rounded-[16px] bg-white text-[#101828] shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition active:scale-95"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
          <img
            src={radarSrc}
            alt="National Weather Service radar for KDIX full screen"
            className="h-full w-full object-contain"
            onLoad={() => setUpdatedAt(formatUpdateTime(new Date()))}
          />
        </div>
      ) : null}
    </>
  );
};
