import { ArrowDown, ArrowUp } from "lucide-react";
import { Label, Pill } from "./Label";

export const TideCard = ({ tide }) => (
  <section className="card p-6">
    <div className="flex items-start justify-between">
      <Label icon={ArrowUp}>Tide</Label>
      <Pill className="bg-[#E8F4FC] text-[#227CB1]">{tide.status}</Pill>
    </div>
    <div className="mt-5 grid grid-cols-2 gap-3">
      <div className="rounded-[15px] bg-[#EEF6FF] px-4 py-3">
        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B8FD0]"><ArrowUp size={12} /> High</div>
        <div className="mt-2 text-xl font-black tracking-[-0.03em] text-[#101828]">{tide.high}</div>
      </div>
      <div className="rounded-[15px] bg-[#F4F6FA] px-4 py-3">
        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7B87A2]"><ArrowDown size={12} /> Low</div>
        <div className="mt-2 text-xl font-black tracking-[-0.03em] text-[#101828]">{tide.low}</div>
      </div>
    </div>
    <div className="relative mt-6 h-[145px] overflow-hidden rounded-[16px] bg-[#F8FBFD]">
      <svg viewBox="0 0 590 170" className="h-full w-full">
        <defs>
          <linearGradient id="tideFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#BCD1DC" stopOpacity="0.62" />
            <stop offset="100%" stopColor="#D9E6EC" stopOpacity="0.42" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="590" height="170" fill="#F8FBFD" />
        {[34, 66, 98, 130, 162, 194, 226, 258, 290, 322, 354, 386, 418, 450, 482, 514, 546].map((x, index) => (
          <line key={x} x1={x} x2={x} y1={118} y2={index % 3 === 0 ? 132 : 126} stroke="#A9B8C4" strokeWidth="1" opacity="0.7" />
        ))}
        <line x1="0" x2="590" y1="118" y2="118" stroke="#9FB0BD" strokeWidth="1.2" />
        <path d="M0 84 C48 70 74 68 112 86 C154 106 178 116 222 108 C268 100 292 74 338 68 C390 62 420 84 462 98 C504 112 536 116 590 94 L590 118 L0 118 Z" fill="url(#tideFill)" />
        <path d="M0 84 C48 70 74 68 112 86 C154 106 178 116 222 108 C268 100 292 74 338 68 C390 62 420 84 462 98 C504 112 536 116 590 94" fill="none" stroke="#162332" strokeWidth="3" strokeLinecap="round" />
        <line x1="414" x2="414" y1="84" y2="118" stroke="#89A4B6" strokeWidth="2" />
        <circle cx="414" cy="84" r="8" fill="#42A3D8" stroke="#FFFFFF" strokeWidth="4" />
        <text x="414" y="55" textAnchor="middle" fill="#6B7FA2" fontSize="12" fontWeight="800" letterSpacing="2">NOW</text>
        {[
          { label: "6 AM", x: 82 },
          { label: "9 AM", x: 202 },
          { label: "12 PM", x: 322 },
          { label: "3 PM", x: 442 },
          { label: "6 PM", x: 548 }
        ].map((tick) => (
          <text key={tick.label} x={tick.x} y="154" textAnchor="middle" fill="#8A94A6" fontSize="13" fontWeight="800">{tick.label}</text>
        ))}
      </svg>
    </div>
  </section>
);
