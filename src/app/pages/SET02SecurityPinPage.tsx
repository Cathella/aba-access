import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ChevronRight,
  KeyRound,
  RotateCcw,
  ShieldCheck,
  Lock,
  Smartphone,
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
   Component
   ══════════════════════════════════════════════ */

export function SET02SecurityPinPage() {
  const navigate = useNavigate();

  const [requirePinApprove] = useState(true); // always on
  const [requirePinOpen, setRequirePinOpen] = useState(false);

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
          Security & PIN
        </h2>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-10">
        {/* ── 1) PIN management ── */}
        <div className="px-5 pt-4">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            PIN MANAGEMENT
          </p>
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden">
            {/* Change PIN */}
            <button
              onClick={() => navigate("/set-02a")}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-brand-neutral-100 border-b border-brand-neutral-200"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
                <KeyRound size={18} className="text-brand-neutral-700" />
              </div>
              <p
                className="flex-1 min-w-0 text-[14px] text-brand-neutral-900"
                style={{ fontWeight: 500 }}
              >
                Change PIN
              </p>
              <ChevronRight
                size={16}
                className="text-brand-neutral-300 shrink-0"
              />
            </button>

            {/* Reset PIN */}
            <button
              onClick={() => navigate("/set-02b")}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-brand-neutral-100"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
                <RotateCcw size={18} className="text-brand-neutral-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[14px] text-brand-neutral-900"
                  style={{ fontWeight: 500 }}
                >
                  Reset PIN
                </p>
                <p
                  className="text-[11px] text-brand-neutral-500 mt-0.5"
                  style={{ fontWeight: 400 }}
                >
                  Set a new PIN without your current one
                </p>
              </div>
              <ChevronRight
                size={16}
                className="text-brand-neutral-300 shrink-0"
              />
            </button>
          </div>
        </div>

        {/* ── 2) App security ── */}
        <div className="px-5 pt-5">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            APP SECURITY
          </p>
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden">
            {/* Require PIN to approve */}
            <div className="flex items-center gap-3.5 px-4 py-3.5 border-b border-brand-neutral-200">
              <div className="w-9 h-9 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
                <ShieldCheck size={18} className="text-brand-neutral-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[14px] text-brand-neutral-900"
                  style={{ fontWeight: 500 }}
                >
                  Require PIN to approve requests
                </p>
                <p
                  className="text-[11px] text-brand-neutral-400 mt-0.5"
                  style={{ fontWeight: 400 }}
                >
                  Always required
                </p>
              </div>
              <Toggle
                enabled={requirePinApprove}
                onChange={() => {}}
                disabled
              />
            </div>

            {/* Require PIN to open app */}
            <div className="flex items-center gap-3.5 px-4 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
                <Lock size={18} className="text-brand-neutral-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[14px] text-brand-neutral-900"
                  style={{ fontWeight: 500 }}
                >
                  Require PIN to open app
                </p>
                <p
                  className="text-[11px] text-brand-neutral-500 mt-0.5"
                  style={{ fontWeight: 400 }}
                >
                  Adds extra privacy
                </p>
              </div>
              <Toggle
                enabled={requirePinOpen}
                onChange={setRequirePinOpen}
              />
            </div>
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
              Approvals always require your PIN for consent.
            </p>
          </div>
        </div>

        {/* ── 3) Devices ── */}
        <div className="px-5 pt-5">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            DEVICES
          </p>
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3.5 px-4 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
                <Smartphone size={18} className="text-brand-neutral-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[14px] text-brand-neutral-900"
                  style={{ fontWeight: 500 }}
                >
                  Logged-in devices
                </p>
                <p
                  className="text-[11px] text-brand-neutral-400 mt-0.5"
                  style={{ fontWeight: 400 }}
                >
                  Coming soon
                </p>
              </div>
              <ChevronRight
                size={16}
                className="text-brand-neutral-300 shrink-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
