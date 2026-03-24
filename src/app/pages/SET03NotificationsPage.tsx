import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Bell,
  Package,
  Heart,
  Megaphone,
  Smartphone,
  MessageSquare,
  Info,
} from "lucide-react";

/* ══════════════════════════════════════════════
   Toggle component
   ══════════════════════════════════════════════ */

function Toggle({
  enabled,
  onChange,
  disabled = false,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => !disabled && onChange(!enabled)}
      className={`relative inline-flex h-[26px] w-[46px] shrink-0 rounded-full border-[1.5px] transition-colors ${
        enabled
          ? "bg-brand-primary-500 border-brand-primary-500"
          : "bg-brand-neutral-200 border-brand-neutral-200"
      } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`pointer-events-none inline-block h-[22px] w-[22px] rounded-full bg-brand-neutral-0 shadow-sm transition-transform ${
          enabled ? "translate-x-[20px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

/* ══════════════════════════════════════════════
   Toggle row
   ══════════════════════════════════════════════ */

function ToggleRow({
  icon: Icon,
  label,
  caption,
  enabled,
  onChange,
  disabled = false,
  isLast = false,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  caption?: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3.5 px-4 py-3.5 ${
        !isLast ? "border-b border-brand-neutral-200" : ""
      }`}
    >
      <div className="w-9 h-9 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-brand-neutral-700" />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[14px] text-brand-neutral-900"
          style={{ fontWeight: 500 }}
        >
          {label}
        </p>
        {caption && (
          <p
            className={`text-[11px] mt-0.5 ${
              disabled ? "text-brand-neutral-400" : "text-brand-neutral-500"
            }`}
            style={{ fontWeight: 400 }}
          >
            {caption}
          </p>
        )}
      </div>
      <Toggle enabled={enabled} onChange={onChange} disabled={disabled} />
    </div>
  );
}

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function SET03NotificationsPage() {
  const navigate = useNavigate();

  /* notification type toggles */
  const [approvals, setApprovals] = useState(true);
  const [packageReminders, setPackageReminders] = useState(true);
  const [careUpdates, setCareUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  /* delivery toggles */
  const [inApp, setInApp] = useState(true);

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ App Bar (fixed) ══ */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-brand-neutral-100 px-5 pt-6 pb-3 flex items-center gap-3 border-b border-brand-neutral-200">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
        >
          <ArrowLeft size={16} className="text-brand-neutral-900" />
        </button>
        <h2
          className="text-[17px] text-brand-neutral-900"
          style={{ fontWeight: 600 }}
        >
          Notifications
        </h2>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-10">
        {/* ── Notification types ── */}
        <div className="px-5 pt-4">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            NOTIFICATION TYPES
          </p>
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden">
            <ToggleRow
              icon={Bell}
              label="Approval requests"
              caption="Facility requests to redeem coverage"
              enabled={approvals}
              onChange={setApprovals}
            />
            <ToggleRow
              icon={Package}
              label="Package reminders"
              caption="Expiry and low balance alerts"
              enabled={packageReminders}
              onChange={setPackageReminders}
            />
            <ToggleRow
              icon={Heart}
              label="Care updates"
              caption="Results and receipts"
              enabled={careUpdates}
              onChange={setCareUpdates}
            />
            <ToggleRow
              icon={Megaphone}
              label="Promotions"
              enabled={promotions}
              onChange={setPromotions}
              isLast
            />
          </div>
        </div>

        {/* ── Delivery options ── */}
        <div className="px-5 pt-5">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            DELIVERY
          </p>
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden">
            <ToggleRow
              icon={Smartphone}
              label="In-app alerts"
              enabled={inApp}
              onChange={setInApp}
            />
            <ToggleRow
              icon={MessageSquare}
              label="SMS"
              caption="Coming soon"
              enabled={false}
              onChange={() => {}}
              disabled
              isLast
            />
          </div>
        </div>

        {/* ── Helper note ── */}
        <div className="px-5 pt-3">
          <div className="flex items-start gap-2 px-1">
            <Info
              size={14}
              className="text-brand-neutral-400 mt-0.5 shrink-0"
            />
            <p
              className="text-[11px] text-brand-neutral-400"
              style={{ fontWeight: 400 }}
            >
              Approvals may still appear in-app even if push is unavailable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
