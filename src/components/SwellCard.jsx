export const SwellCard = ({ swell, bestWindow }) => (
  <div>
    <div className="mb-4 h-px bg-[#D2EBDC]" />
    <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8EBE9E]">Swell</div>
    <div className="mt-3 space-y-2.5">
      {swell.map((item, index) => (
        <div key={item.type} className={`grid grid-cols-[6px_1fr_auto] items-center gap-3 rounded-[13px] px-3 py-3 text-[12px] font-bold ${index === 0 ? "bg-[#DDF3E7]" : "bg-white/35"}`}>
          <div className={`h-8 rounded-full ${index === 0 ? "bg-[#55B77C]" : "bg-[#A9DDBD]"}`} />
          <div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-[#80B491]">{item.type}</div>
            <div className="mt-1 text-[#2D834B]">{item.height} / {item.period}</div>
          </div>
          <div className="text-right text-[#2D834B]">
            <div>{item.direction}</div>
            <div className="mt-1 text-[10px] text-[#80B491]">{item.angle}</div>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-4 h-px bg-[#D2EBDC]" />
    <div className="mt-4 flex items-center gap-2 text-xs font-extrabold">
      <span className="h-2 w-2 rounded-full bg-[#55B77C]" />
      Best window: {bestWindow}
    </div>
  </div>
);
