export const Label = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#6E7DA0]">
    {Icon && <Icon size={13} strokeWidth={2.2} />}
    <span>{children}</span>
  </div>
);

export const Pill = ({ children, className = "" }) => (
  <div className={`rounded-full px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] ${className}`}>
    {children}
  </div>
);
