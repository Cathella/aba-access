import { MobileFrame } from "../components/MobileFrame";
import { PageNav } from "../components/PageNav";
import { Layers, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export function CoverPage() {
  const navigate = useNavigate();

  const pages = [
    { label: "01 Foundations (Styles)", path: "/foundations" },
    { label: "02 Components (UI Kit)", path: "/components" },
    { label: "03 Flows — Packages (MVP1)", path: "/flows-packages" },
    { label: "04 Flows — Dependents (MVP1)", path: "/flows-dependents" },
    { label: "05 Flows — Approvals (MVP1)", path: "/flows-approvals" },
    { label: "06 Flows — Care Tracking (MVP1)", path: "/flows-care-tracking" },
    { label: "07 Flows — Auth (MVP1)", path: "/flows-auth" },
    { label: "08 Flows — Wallet (MVP1)", path: "/flows-wallet" },
  ];

  return (
    <MobileFrame>
      <div className="px-5 pt-6">
        {/* Title card */}
        <div className="bg-brand-neutral-900 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-10 h-10 rounded-xl bg-brand-primary-500/20 flex items-center justify-center">
              <Layers size={20} className="text-brand-primary-300" />
            </div>
            <div className="text-[11px] tracking-[0.08em] uppercase text-brand-neutral-500">
              Mobile Prototype
            </div>
          </div>
          <h1 className="text-[28px] tracking-[-0.02em] text-brand-neutral-0 mb-1.5" style={{ fontWeight: 600, lineHeight: 1.15 }}>
            AbaAccess (MVP1)
          </h1>
          <p className="text-[15px] text-brand-neutral-500" style={{ fontWeight: 400, lineHeight: 1.45 }}>
            Packages-first | Consistent with ABA Partner
          </p>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 bg-brand-neutral-100 border border-brand-neutral-200 rounded-xl px-4 py-3">
            <div className="text-[11px] tracking-[0.06em] uppercase text-brand-neutral-500 mb-0.5">
              Frame size
            </div>
            <div className="text-[14px] text-brand-neutral-900" style={{ fontWeight: 500 }}>390 × 844</div>
          </div>
          <div className="flex-1 bg-brand-neutral-100 border border-brand-neutral-200 rounded-xl px-4 py-3">
            <div className="text-[11px] tracking-[0.06em] uppercase text-brand-neutral-500 mb-0.5">
              Device
            </div>
            <div className="text-[14px] text-brand-neutral-900" style={{ fontWeight: 500 }}>iPhone 13 / 14</div>
          </div>
        </div>

        {/* Version tag */}
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-brand-primary-50 text-brand-primary-500 text-[12px]" style={{ fontWeight: 500 }}>
            MVP1
          </span>
          <span className="text-[13px] text-brand-neutral-500" style={{ fontWeight: 400 }}>
            Feb 2026 · v0.1.0
          </span>
        </div>

        {/* Page index */}
        <div className="text-[11px] tracking-[0.08em] uppercase text-brand-neutral-500 mb-3 px-1">
          Page Index
        </div>
        <div className="space-y-1.5">
          {pages.map((page) => (
            <button
              key={page.path}
              onClick={() => navigate(page.path)}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-brand-neutral-0 border border-brand-neutral-200 rounded-xl hover:bg-brand-neutral-100 transition-colors text-left"
            >
              <span className="text-[14px] text-brand-neutral-900" style={{ fontWeight: 450 }}>{page.label}</span>
              <ArrowRight size={14} className="text-brand-neutral-500" />
            </button>
          ))}
        </div>
      </div>

      <PageNav />
    </MobileFrame>
  );
}