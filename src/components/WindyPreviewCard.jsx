export const WindyPreviewCard = ({ spot }) => (
  <section className="windy card relative overflow-hidden bg-[#10203A]">
    <img
      src="/assets/windy-map.png"
      alt="Windy wind map preview"
      className="absolute inset-0 h-full w-full object-cover object-center"
    />
    <div className="absolute inset-0 bg-[#10203A]/10" />
    <div className="absolute bottom-3 right-4 rounded-full bg-black/35 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white/70 backdrop-blur">
      {spot}
    </div>
  </section>
);
