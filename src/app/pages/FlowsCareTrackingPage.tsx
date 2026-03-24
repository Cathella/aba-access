import { MobileFrame } from "../components/MobileFrame";
import { PageNav } from "../components/PageNav";
import { SectionLabel } from "../components/SectionLabel";
import { Activity, TrendingUp, Target, Calendar } from "lucide-react";

export function FlowsCareTrackingPage() {
  return (
    <MobileFrame>
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[22px] tracking-[-0.01em] text-brand-neutral-900" style={{ fontWeight: 600 }}>
            Care Tracking
          </h2>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-brand-warning-50 text-brand-warning-500 text-[11px]" style={{ fontWeight: 500 }}>
            MVP1 Placeholder
          </span>
        </div>
        <p className="text-[14px] text-brand-neutral-500 mb-6" style={{ fontWeight: 400 }}>
          Session & progress tracking
        </p>
      </div>

      {/* Placeholder wireframe */}
      <div className="px-5 mb-5">
        <div className="bg-brand-neutral-100 border-2 border-dashed border-brand-neutral-200 rounded-2xl p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-brand-neutral-200 flex items-center justify-center mb-3">
              <Activity size={24} className="text-brand-neutral-500" />
            </div>
            <div className="text-[16px] text-brand-neutral-900 mb-1" style={{ fontWeight: 500 }}>
              Care Tracking Flow
            </div>
            <div className="text-[13px] text-brand-neutral-500 max-w-[240px]" style={{ fontWeight: 400 }}>
              Track sessions, goals, and outcomes per package. Full flow coming in MVP2.
            </div>
          </div>

          {/* Wireframe stat cards */}
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {[
              {
                icon: <Calendar size={16} className="text-brand-secondary-500" />,
                label: "Sessions",
                value: "—",
                bg: "bg-brand-secondary-50",
              },
              {
                icon: <Target size={16} className="text-brand-primary-400" />,
                label: "Goals Met",
                value: "—",
                bg: "bg-brand-primary-50",
              },
              {
                icon: <TrendingUp size={16} className="text-brand-success-500" />,
                label: "Progress",
                value: "—",
                bg: "bg-brand-success-50",
              },
              {
                icon: <Activity size={16} className="text-brand-warning-500" />,
                label: "Hours",
                value: "—",
                bg: "bg-brand-warning-50",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`${stat.bg} rounded-xl p-3.5 border border-brand-neutral-200/30`}
              >
                <div className="mb-2">{stat.icon}</div>
                <div className="text-[20px] text-brand-neutral-300 mb-0.5" style={{ fontWeight: 600 }}>
                  {stat.value}
                </div>
                <div className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Wireframe chart placeholder */}
          <div className="bg-brand-neutral-0/60 border border-brand-neutral-200/30 rounded-xl p-4">
            <div className="text-[12px] text-brand-neutral-300 mb-3" style={{ fontWeight: 500 }}>
              Progress Over Time
            </div>
            <div className="h-24 flex items-end gap-1.5">
              {[30, 45, 35, 60, 50, 70, 55, 80, 65, 75, 85, 90].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-brand-primary-500/15 rounded-t-sm"
                    style={{ height: `${h}%` }}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Planned features */}
      <SectionLabel label="Planned for MVP2" className="mb-3" />
      <div className="px-5 mb-2">
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 space-y-3">
          {[
            "Session note templates",
            "Goal progress tracking & graphing",
            "Data collection during sessions",
            "BCBA supervision logging",
            "Outcome reports & exports",
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
