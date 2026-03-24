import { ReactNode } from "react";

interface MobileFrameProps {
  children: ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-brand-neutral-200 flex items-start justify-center py-8">
      <div
        className="bg-brand-neutral-0 rounded-[40px] shadow-xl overflow-hidden relative"
        style={{ width: 390, minHeight: 844 }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-8 pt-3 pb-1 text-brand-neutral-900">
          <span className="text-[13px] tracking-tight" style={{ fontWeight: 600 }}>
            9:41
          </span>
          <div className="flex items-center gap-1.5">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <rect x="0" y="3" width="3" height="9" rx="1" fill="currentColor" />
              <rect x="4.5" y="2" width="3" height="10" rx="1" fill="currentColor" />
              <rect x="9" y="0.5" width="3" height="11.5" rx="1" fill="currentColor" />
              <rect x="13.5" y="0" width="3" height="12" rx="1" fill="currentColor" />
            </svg>
            <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
              <path d="M7.5 3.5C9.4 3.5 11.1 4.3 12.3 5.5L13.7 4.1C12.1 2.5 10 1.5 7.5 1.5C5 1.5 2.9 2.5 1.3 4.1L2.7 5.5C3.9 4.3 5.6 3.5 7.5 3.5Z" fill="currentColor" />
              <path d="M7.5 6.5C8.6 6.5 9.6 6.9 10.4 7.5L11.8 6.1C10.6 5.1 9.1 4.5 7.5 4.5C5.9 4.5 4.4 5.1 3.2 6.1L4.6 7.5C5.4 6.9 6.4 6.5 7.5 6.5Z" fill="currentColor" />
              <circle cx="7.5" cy="10" r="1.5" fill="currentColor" />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
              <rect x="0" y="1" width="21" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
              <rect x="1.5" y="2.5" width="18" height="7" rx="1" fill="currentColor" />
              <rect x="22" y="4" width="2" height="4" rx="1" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Dynamic Island notch */}
        <div className="flex justify-center -mt-0.5 mb-1">
          <div className="w-[126px] h-[34px] bg-brand-neutral-900 rounded-full" />
        </div>

        {/* Content */}
        <div className="px-0 pb-8">{children}</div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <div className="w-[134px] h-[5px] bg-brand-neutral-900/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}