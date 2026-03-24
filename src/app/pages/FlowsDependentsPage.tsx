import { MobileFrame } from "../components/MobileFrame";
import { PageNav } from "../components/PageNav";
import { SectionLabel } from "../components/SectionLabel";
import { Users, User, ChevronRight, Search, Plus } from "lucide-react";

const placeholderDependents = [
  { name: "Jordan M.", age: 7, packages: 2, status: "Active" },
  { name: "Alex T.", age: 5, packages: 1, status: "Active" },
  { name: "Sam K.", age: 9, packages: 3, status: "Active" },
];

export function FlowsDependentsPage() {
  return (
    <MobileFrame>
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[22px] tracking-[-0.01em] text-brand-neutral-900" style={{ fontWeight: 600 }}>
            Dependents
          </h2>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-brand-warning-50 text-brand-warning-500 text-[11px]" style={{ fontWeight: 500 }}>
            MVP1 Placeholder
          </span>
        </div>
        <p className="text-[14px] text-brand-neutral-500 mb-6" style={{ fontWeight: 400 }}>
          Client dependents management
        </p>
      </div>

      {/* Placeholder wireframe */}
      <div className="px-5 mb-5">
        <div className="bg-brand-neutral-100 border-2 border-dashed border-brand-neutral-200 rounded-2xl p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-brand-neutral-200 flex items-center justify-center mb-3">
              <Users size={24} className="text-brand-neutral-500" />
            </div>
            <div className="text-[16px] text-brand-neutral-900 mb-1" style={{ fontWeight: 500 }}>
              Dependents Flow
            </div>
            <div className="text-[13px] text-brand-neutral-500 max-w-[240px]" style={{ fontWeight: 400 }}>
              Manage dependents linked to packages. Full flow coming in MVP2.
            </div>
          </div>

          {/* Wireframe search */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 h-10 bg-brand-neutral-200/60 rounded-xl flex items-center px-3 gap-2">
              <Search size={14} className="text-brand-neutral-300" />
              <span className="text-[13px] text-brand-neutral-300" style={{ fontWeight: 400 }}>
                Search dependents...
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-neutral-200/60 flex items-center justify-center">
              <Plus size={14} className="text-brand-neutral-300" />
            </div>
          </div>

          {/* Wireframe list */}
          <div className="space-y-2">
            {placeholderDependents.map((dep) => (
              <div
                key={dep.name}
                className="bg-brand-neutral-0/60 border border-brand-neutral-200/50 rounded-xl p-3.5 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-brand-neutral-200 flex items-center justify-center shrink-0">
                  <User size={14} className="text-brand-neutral-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] text-brand-neutral-700" style={{ fontWeight: 500 }}>
                    {dep.name}
                  </div>
                  <div className="text-[12px] text-brand-neutral-300" style={{ fontWeight: 400 }}>
                    Age {dep.age} · {dep.packages} pkg{dep.packages > 1 ? "s" : ""}
                  </div>
                </div>
                <ChevronRight size={14} className="text-brand-neutral-300" />
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
            "Dependent profile management",
            "Link dependents to packages",
            "Progress tracking per dependent",
            "Guardian/parent info",
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
