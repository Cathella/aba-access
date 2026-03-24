import { MobileFrame } from "../components/MobileFrame";
import { PageNav } from "../components/PageNav";
import { SectionLabel } from "../components/SectionLabel";
import { ShieldCheck, CheckCircle2, Clock, XCircle } from "lucide-react";

export function FlowsApprovalsPage() {
  return (
    <MobileFrame>
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[22px] tracking-[-0.01em] text-brand-neutral-900" style={{ fontWeight: 600 }}>
            Approvals
          </h2>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-brand-warning-50 text-brand-warning-500 text-[11px]" style={{ fontWeight: 500 }}>
            MVP1 Placeholder
          </span>
        </div>
        <p className="text-[14px] text-brand-neutral-500 mb-6" style={{ fontWeight: 400 }}>
          Package approval workflows
        </p>
      </div>

      {/* Placeholder wireframe */}
      <div className="px-5 mb-5">
        <div className="bg-brand-neutral-100 border-2 border-dashed border-brand-neutral-200 rounded-2xl p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-brand-neutral-200 flex items-center justify-center mb-3">
              <ShieldCheck size={24} className="text-brand-neutral-500" />
            </div>
            <div className="text-[16px] text-brand-neutral-900 mb-1" style={{ fontWeight: 500 }}>
              Approvals Flow
            </div>
            <div className="text-[13px] text-brand-neutral-500 max-w-[240px]" style={{ fontWeight: 400 }}>
              Multi-step approval for packages and clinical changes. Coming in MVP2.
            </div>
          </div>

          {/* Wireframe approval pipeline */}
          <div className="space-y-2.5">
            {[
              {
                label: "Submitted",
                count: 3,
                icon: <Clock size={14} className="text-brand-warning-500" />,
                bg: "bg-brand-warning-50",
              },
              {
                label: "In Review",
                count: 2,
                icon: <Clock size={14} className="text-brand-secondary-500" />,
                bg: "bg-brand-secondary-50",
              },
              {
                label: "Approved",
                count: 8,
                icon: <CheckCircle2 size={14} className="text-brand-success-500" />,
                bg: "bg-brand-success-50",
              },
              {
                label: "Rejected",
                count: 1,
                icon: <XCircle size={14} className="text-brand-error-500" />,
                bg: "bg-brand-error-50",
              },
            ].map((step) => (
              <div
                key={step.label}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl ${step.bg} border border-brand-neutral-200/30`}
              >
                <div className="flex items-center gap-2.5">
                  {step.icon}
                  <span className="text-[14px] text-brand-neutral-700" style={{ fontWeight: 450 }}>
                    {step.label}
                  </span>
                </div>
                <span className="text-[13px] text-brand-neutral-300" style={{ fontWeight: 500 }}>
                  {step.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Planned features */}
      <SectionLabel label="Planned for MVP2" className="mb-3" />
      <div className="px-5 mb-2">
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 space-y-3">
          {[
            "Multi-tier approval chains",
            "BCBA sign-off workflow",
            "Insurance pre-auth integration",
            "Approval history & audit log",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-neutral-300" />
              <span className="text-[13px] text-brand-neutral-500" style={{ fontWeight: 400 }}>
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      <PageNav />
    </MobileFrame>
  );
}
