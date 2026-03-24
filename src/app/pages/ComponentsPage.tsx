import { MobileFrame } from "../components/MobileFrame";
import { PageNav } from "../components/PageNav";
import { SectionLabel } from "../components/SectionLabel";
import {
  Search,
  ChevronRight,
  Bell,
  User,
  Package,
  Check,
  AlertCircle,
  Plus,
  Home,
  ClipboardList,
  ShieldCheck,
  Activity,
} from "lucide-react";

export function ComponentsPage() {
  return (
    <MobileFrame>
      <div className="px-5 pt-4 pb-2">
        <h2 className="text-[22px] tracking-[-0.01em] text-brand-neutral-900 mb-1" style={{ fontWeight: 600 }}>
          02 Components
        </h2>
        <p className="text-[14px] text-brand-neutral-500 mb-6" style={{ fontWeight: 400 }}>
          Reusable UI kit for AbaAccess
        </p>
      </div>

      {/* ── Buttons ── */}
      <SectionLabel label="Buttons" className="mb-3" />
      <div className="px-5 mb-6">
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5 space-y-3">
          {/* Primary */}
          <div>
            <div className="text-[11px] text-brand-neutral-500 mb-1.5" style={{ fontWeight: 400 }}>
              Primary · bg Primary/300 · black text · 1.5px border
            </div>
            <button className="w-full h-12 bg-brand-primary-300 hover:bg-brand-primary-400 active:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[15px] flex items-center justify-center transition-colors" style={{ fontWeight: 500 }}>
              Primary Action
            </button>
          </div>

          {/* Secondary */}
          <div>
            <div className="text-[11px] text-brand-neutral-500 mb-1.5" style={{ fontWeight: 400 }}>
              Secondary · bg Primary/100 · black text · 1.5px border
            </div>
            <button className="w-full h-12 bg-brand-primary-100 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[15px] flex items-center justify-center transition-colors" style={{ fontWeight: 500 }}>
              Secondary Action
            </button>
          </div>

          {/* Tertiary link */}
          <div>
            <div className="text-[11px] text-brand-neutral-500 mb-1.5" style={{ fontWeight: 400 }}>
              Tertiary link · text Secondary/500
            </div>
            <button className="w-full h-12 bg-transparent text-brand-secondary-500 rounded-xl text-[15px] flex items-center justify-center transition-colors" style={{ fontWeight: 500 }}>
              Tertiary Link
            </button>
          </div>

          {/* Destructive */}
          <div>
            <div className="text-[11px] text-brand-neutral-500 mb-1.5" style={{ fontWeight: 400 }}>
              Destructive · bg Error/50 · black text · 1.5px border
            </div>
            <button className="w-full h-12 bg-brand-error-50 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[15px] flex items-center justify-center transition-colors" style={{ fontWeight: 500 }}>
              Destructive
            </button>
          </div>

          {/* Compact pair */}
          <div className="border-t border-brand-neutral-200 pt-3">
            <div className="text-[11px] text-brand-neutral-500 mb-1.5" style={{ fontWeight: 400 }}>
              Compact pair
            </div>
            <div className="flex gap-2">
              <button className="flex-1 h-10 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-lg text-[13px] flex items-center justify-center gap-1.5 transition-colors" style={{ fontWeight: 500 }}>
                <Plus size={14} /> Add
              </button>
              <button className="flex-1 h-10 bg-brand-neutral-100 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-lg text-[13px] flex items-center justify-center transition-colors" style={{ fontWeight: 500 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Inputs ── */}
      <SectionLabel label="Inputs" className="mb-3" />
      <div className="px-5 mb-6">
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-neutral-500"
            />
            <input
              type="text"
              placeholder="Search packages..."
              className="w-full h-11 pl-10 pr-4 bg-brand-neutral-100 border border-brand-neutral-300 rounded-full text-[14px] text-brand-neutral-900 placeholder:text-brand-neutral-300"
              readOnly
            />
          </div>
          {/* Text input */}
          <div>
            <label className="text-[12px] text-brand-neutral-500 mb-1.5 block" style={{ fontWeight: 500 }}>
              Package Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              className="w-full h-11 px-3.5 bg-brand-neutral-0 border border-brand-neutral-200 rounded-[6px] text-[14px] text-brand-neutral-900 placeholder:text-brand-neutral-300"
              readOnly
            />
          </div>
          {/* Select mock */}
          <div>
            <label className="text-[12px] text-brand-neutral-500 mb-1.5 block" style={{ fontWeight: 500 }}>
              Status
            </label>
            <div className="w-full h-11 px-3.5 bg-brand-neutral-0 border border-brand-neutral-200 rounded-[6px] text-[14px] flex items-center justify-between text-brand-neutral-300">
              <span>Select status</span>
              <ChevronRight size={14} className="rotate-90 text-brand-neutral-500" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Cards ── */}
      <SectionLabel label="Cards" className="mb-3" />
      <div className="px-5 mb-6 space-y-3">
        {/* Info card */}
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-secondary-50 flex items-center justify-center shrink-0">
              <Package size={18} className="text-brand-secondary-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] text-brand-neutral-900 mb-0.5" style={{ fontWeight: 500 }}>
                ABA Therapy — Basic
              </div>
              <div className="text-[13px] text-brand-neutral-500" style={{ fontWeight: 400 }}>
                12 sessions · 4 goals
              </div>
            </div>
            <ChevronRight size={16} className="text-brand-neutral-300 mt-2.5" />
          </div>
        </div>
        {/* Status card */}
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-success-50 flex items-center justify-center shrink-0">
              <Check size={18} className="text-brand-success-500" />
            </div>
            <div className="flex-1">
              <div className="text-[15px] text-brand-neutral-900 mb-0.5" style={{ fontWeight: 500 }}>
                Approved
              </div>
              <div className="text-[13px] text-brand-neutral-500" style={{ fontWeight: 400 }}>
                Package approved on Feb 12
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── List Items ── */}
      <SectionLabel label="List Items" className="mb-3" />
      <div className="px-5 mb-6">
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden divide-y divide-brand-neutral-200">
          {[
            { icon: <Package size={16} />, label: "Packages", badge: "3" },
            { icon: <User size={16} />, label: "Dependents", badge: null },
            { icon: <Bell size={16} />, label: "Notifications", badge: "5" },
            { icon: <AlertCircle size={16} />, label: "Alerts", badge: null },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center px-4 py-3.5 gap-3"
            >
              <div className="text-brand-neutral-500">{item.icon}</div>
              <span className="flex-1 text-[14px] text-brand-neutral-900" style={{ fontWeight: 450 }}>
                {item.label}
              </span>
              {item.badge && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-primary-500 text-brand-neutral-0 text-[11px]" style={{ fontWeight: 600 }}>
                  {item.badge}
                </span>
              )}
              <ChevronRight size={14} className="text-brand-neutral-300" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Approval Chips ── */}
      <SectionLabel label="Approval Chips" className="mb-3" />
      <div className="px-5 mb-6">
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Requested", color: "bg-brand-neutral-100 text-brand-neutral-700" },
              { label: "Approved", color: "bg-brand-success-50 text-brand-success-500" },
              { label: "Declined", color: "bg-brand-error-50 text-brand-error-500" },
              { label: "Timed out", color: "bg-brand-warning-50 text-brand-warning-500" },
            ].map((chip) => (
              <span
                key={chip.label}
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] ${chip.color}`}
                style={{ fontWeight: 500 }}
              >
                {chip.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Coverage Chips ── */}
      <SectionLabel label="Coverage Chips" className="mb-3" />
      <div className="px-5 mb-6">
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Covered", color: "bg-brand-success-50 text-brand-success-500" },
              { label: "Discount applied", color: "bg-brand-secondary-50 text-brand-secondary-500" },
              { label: "Out-of-pocket", color: "bg-brand-warning-50 text-brand-warning-500" },
            ].map((chip) => (
              <span
                key={chip.label}
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] ${chip.color}`}
                style={{ fontWeight: 500 }}
              >
                {chip.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── General Badges ── */}
      <SectionLabel label="Badges & Tags" className="mb-3" />
      <div className="px-5 mb-6">
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Active", color: "bg-brand-success-50 text-brand-success-500" },
              { label: "Pending", color: "bg-brand-warning-50 text-brand-warning-500" },
              { label: "Draft", color: "bg-brand-neutral-100 text-brand-neutral-700" },
              { label: "Expired", color: "bg-brand-error-50 text-brand-error-500" },
              { label: "Approved", color: "bg-brand-secondary-50 text-brand-secondary-500" },
              { label: "In Review", color: "bg-brand-primary-50 text-brand-primary-500" },
            ].map((badge) => (
              <span
                key={badge.label}
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] ${badge.color}`}
                style={{ fontWeight: 500 }}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Navigation ── */}
      <SectionLabel label="Bottom Navigation" className="mb-3" />
      <div className="px-5 mb-2">
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
          <div className="text-[11px] text-brand-neutral-500 mb-3" style={{ fontWeight: 400 }}>
            Active = Primary/500 · Inactive = Neutral/500 · bg Neutral/0 + top border Neutral/200
          </div>
          {/* Nav bar mock */}
          <div className="bg-brand-neutral-0 border-t border-brand-neutral-200 rounded-b-xl pt-2 pb-1">
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
      </div>

      <PageNav />
    </MobileFrame>
  );
}