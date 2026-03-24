import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import {
  Users,
  HelpCircle,
  FileText,
  ChevronRight,
  Shield,
  Bell,
  CreditCard,
  Lock,
  Info,
  UserCircle,
  LogOut,
} from "lucide-react";

/* ══════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════ */

interface MenuItem {
  icon: typeof Users;
  label: string;
  route: string;
}

/* ══════════════════════════════════════════════
   Section data
   ══════════════════════════════════════════════ */

const settingsItems: MenuItem[] = [
  { icon: Users, label: "Dependents", route: "/dep-01" },
  { icon: Lock, label: "Security & PIN", route: "/set-02" },
  { icon: Bell, label: "Notifications", route: "/set-03" },
  { icon: CreditCard, label: "Payment methods", route: "/set-04" },
  { icon: Shield, label: "Privacy policy", route: "/set-05" },
  { icon: FileText, label: "Terms of service", route: "/set-06" },
  { icon: HelpCircle, label: "Help & support", route: "/set-07" },
];

const secondaryItems: MenuItem[] = [
  { icon: Info, label: "About AbaAccess", route: "#" },
];

/* ══════════════════════════════════════════════
   Shared list renderer
   ══════════════════════════════════════════════ */

function SettingsList({
  items,
  navigate,
}: {
  items: MenuItem[];
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden">
      {items.map((item, idx) => {
        const Icon = item.icon;
        const isLast = idx === items.length - 1;
        return (
          <button
            key={item.label}
            onClick={() => {
              if (item.route !== "#") navigate(item.route);
            }}
            className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-brand-neutral-100 ${
              !isLast ? "border-b border-brand-neutral-200" : ""
            }`}
          >
            {/* Icon container */}
            <div className="w-9 h-9 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
              <Icon size={18} className="text-brand-neutral-700" />
            </div>

            {/* Label */}
            <p
              className="flex-1 min-w-0 text-[14px] text-brand-neutral-900"
              style={{ fontWeight: 500 }}
            >
              {item.label}
            </p>

            {/* Chevron */}
            <ChevronRight
              size={16}
              className="text-brand-neutral-300 shrink-0"
            />
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function MorePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ Header (fixed) ══ */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <h2
          className="text-[17px] text-brand-neutral-900"
          style={{ fontWeight: 600 }}
        >
          More
        </h2>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[80px]">
        {/* ── A) Profile summary card ── */}
        <div className="px-5 pt-4">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5">
            <div className="flex items-center gap-3.5">
              {/* Avatar placeholder */}
              <div className="w-12 h-12 rounded-full bg-brand-secondary-50 flex items-center justify-center shrink-0">
                <UserCircle size={28} className="text-brand-secondary-500" />
              </div>

              {/* Name + phone */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[16px] text-brand-neutral-900"
                  style={{ fontWeight: 600 }}
                >
                  Catherine Nakitto
                </p>
                <p
                  className="text-[13px] text-brand-neutral-500 mt-0.5"
                  style={{ fontWeight: 400 }}
                >
                  +256 7XX XXX XXX
                </p>
              </div>
            </div>

            {/* View profile link */}
            <button
              onClick={() => navigate("/set-01")}
              className="mt-4 w-full h-10 rounded-xl text-[13px] flex items-center justify-center gap-1.5 border-[1.5px] border-brand-neutral-900 bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 transition-colors"
              style={{ fontWeight: 500 }}
            >
              View profile
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* ── B) Settings section ── */}
        <div className="px-5 pt-4">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            SETTINGS
          </p>
          <SettingsList items={settingsItems} navigate={navigate} />
        </div>

        {/* ── C) Secondary section ── */}
        <div className="px-5 pt-4 pb-2">
          <SettingsList items={secondaryItems} navigate={navigate} />
        </div>

        {/* ── D) Log out ── */}
        <div className="px-5 pt-2 pb-2">
          <button
            onClick={() => navigate("/auth-09")}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl text-left transition-colors hover:bg-brand-neutral-100"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-warning-50 flex items-center justify-center shrink-0">
              <LogOut size={18} className="text-brand-warning-500" />
            </div>
            <p
              className="flex-1 min-w-0 text-[14px] text-brand-neutral-900"
              style={{ fontWeight: 500 }}
            >
              Log out
            </p>
            <ChevronRight
              size={16}
              className="text-brand-neutral-300 shrink-0"
            />
          </button>
        </div>
      </div>

      {/* ══ Bottom Navigation ══ */}
      <BottomNav activeTab="more" />
    </div>
  );
}