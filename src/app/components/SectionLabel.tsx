interface SectionLabelProps {
  label: string;
  className?: string;
}

export function SectionLabel({ label, className = "" }: SectionLabelProps) {
  return (
    <div className={`px-5 ${className}`}>
      <span className="text-[11px] tracking-[0.08em] uppercase text-brand-neutral-500">
        {label}
      </span>
    </div>
  );
}