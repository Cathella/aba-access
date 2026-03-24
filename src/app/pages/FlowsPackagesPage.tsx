import { MobileFrame } from "../components/MobileFrame";
import { PageNav } from "../components/PageNav";
import { SectionLabel } from "../components/SectionLabel";
import {
  Search,
  Plus,
  Package,
  ChevronRight,
  Filter,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Home,
  ClipboardList,
  Activity,
} from "lucide-react";

const packages = [
  {
    name: "ABA Therapy — Standard",
    client: "Jordan M.",
    sessions: 24,
    goals: 6,
    status: "Active",
    statusColor: "bg-brand-success-50 text-brand-success-500",
    icon: <CheckCircle2 size={14} className="text-brand-success-500" />,
    updated: "2h ago",
  },
  {
    name: "Social Skills Group",
    client: "Alex T.",
    sessions: 12,
    goals: 3,
    status: "Pending",
    statusColor: "bg-brand-warning-50 text-brand-warning-500",
    icon: <Clock size={14} className="text-brand-warning-500" />,
    updated: "1d ago",
  },
  {
    name: "Early Intervention",
    client: "Sam K.",
    sessions: 16,
    goals: 5,
    status: "Draft",
    statusColor: "bg-brand-neutral-100 text-brand-neutral-700",
    icon: <AlertTriangle size={14} className="text-brand-neutral-500" />,
    updated: "3d ago",
  },
  {
    name: "Parent Training",
    client: "Casey W.",
    sessions: 8,
    goals: 2,
    status: "Active",
    statusColor: "bg-brand-success-50 text-brand-success-500",
    icon: <CheckCircle2 size={14} className="text-brand-success-500" />,
    updated: "5h ago",
  },
];

export function FlowsPackagesPage() {
  return (
    <MobileFrame>
      {/* Header */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[22px] tracking-[-0.01em] text-brand-neutral-900" style={{ fontWeight: 600 }}>
            Packages
          </h2>
          <button className="w-9 h-9 rounded-xl bg-brand-primary-300 hover:bg-brand-primary-400 border-[1.5px] border-brand-neutral-900 flex items-center justify-center transition-colors">
            <Plus size={18} className="text-brand-neutral-900" />
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-5">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-neutral-500"
            />
            <input
              type="text"
              placeholder="Search packages..."
              className="w-full h-10 pl-9 pr-3 bg-brand-neutral-100 border-0 rounded-xl text-[13px] placeholder:text-brand-neutral-300"
              readOnly
            />
          </div>
          <button className="w-10 h-10 rounded-xl border border-brand-neutral-200 flex items-center justify-center bg-brand-neutral-0">
            <Filter size={15} className="text-brand-neutral-500" />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 mb-1">
          {["All", "Active", "Pending", "Draft"].map((tab, i) => (
            <button
              key={tab}
              className={`px-3 py-1.5 rounded-full text-[12px] ${
                i === 0
                  ? "bg-brand-neutral-900 text-brand-neutral-0"
                  : "bg-brand-neutral-100 text-brand-neutral-500"
              }`}
              style={{ fontWeight: 500 }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="px-5 py-4">
        <div className="flex gap-2">
          {[
            { label: "Total", value: "12" },
            { label: "Active", value: "8" },
            { label: "Pending", value: "3" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex-1 bg-brand-neutral-0 border border-brand-neutral-200 rounded-xl px-3 py-2.5 text-center"
            >
              <div className="text-[18px] tracking-[-0.01em] text-brand-neutral-900" style={{ fontWeight: 600 }}>
                {stat.value}
              </div>
              <div className="text-[11px] text-brand-neutral-500" style={{ fontWeight: 400 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package list */}
      <SectionLabel label="Recent Packages" className="mb-3" />
      <div className="px-5 space-y-2.5 mb-6">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-secondary-50 flex items-center justify-center shrink-0">
                <Package size={18} className="text-brand-secondary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[14px] text-brand-neutral-900 mb-0.5" style={{ fontWeight: 500 }}>
                    {pkg.name}
                  </div>
                  <button className="text-brand-neutral-300 shrink-0 bg-transparent">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                <div className="text-[12px] text-brand-neutral-500 mb-2" style={{ fontWeight: 400 }}>
                  {pkg.client} · {pkg.sessions} sessions · {pkg.goals} goals
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] ${pkg.statusColor}`}
                    style={{ fontWeight: 500 }}
                  >
                    {pkg.icon}
                    {pkg.status}
                  </span>
                  <span className="text-[11px] text-brand-neutral-300" style={{ fontWeight: 400 }}>
                    {pkg.updated}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <SectionLabel label="Quick Actions" className="mb-3" />
      <div className="px-5 mb-2">
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden divide-y divide-brand-neutral-200">
          {[
            { label: "Create new package", desc: "Start from scratch or template" },
            { label: "Import from ABA Partner", desc: "Sync existing packages" },
            { label: "Bulk update statuses", desc: "Manage multiple packages" },
          ].map((action) => (
            <div
              key={action.label}
              className="flex items-center px-4 py-3.5 gap-3"
            >
              <div className="flex-1">
                <div className="text-[14px] text-brand-neutral-900" style={{ fontWeight: 500 }}>{action.label}</div>
                <div className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>
                  {action.desc}
                </div>
              </div>
              <ChevronRight size={14} className="text-brand-neutral-300" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Navigation ── */}
      <div className="px-5 mb-2">
        <div className="bg-brand-neutral-0 border-t border-brand-neutral-200 rounded-xl pt-2.5 pb-1.5">
          <div className="flex items-center justify-around">
            {[
              { icon: <Home size={20} />, label: "Home", active: false },
              { icon: <Package size={20} />, label: "Packages", active: true },
              { icon: <ClipboardList size={20} />, label: "Approvals", active: false },
              { icon: <Activity size={20} />, label: "Tracking", active: false },
            ].map((tab) => (
              <div
                key={tab.label}
                className={`flex flex-col items-center gap-0.5 ${
                  tab.active ? "text-brand-primary-500" : "text-brand-neutral-500"
                }`}
              >
                {tab.icon}
                <span className="text-[10px]" style={{ fontWeight: tab.active ? 500 : 400 }}>
                  {tab.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PageNav />
    </MobileFrame>
  );
}