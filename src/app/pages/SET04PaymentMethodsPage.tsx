import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Wallet,
  ChevronRight,
  Smartphone,
  Info,
  CircleDot,
  Circle,
} from "lucide-react";
import { toast } from "sonner";

/* ══════════════════════════════════════════════
   Radio option
   ══════════════════════════════════════════════ */

function RadioOption({
  label,
  caption,
  selected,
  onSelect,
  disabled = false,
  isLast = false,
}: {
  label: string;
  caption?: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  isLast?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect()}
      disabled={disabled}
      className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-colors ${
        !disabled ? "hover:bg-brand-neutral-100" : ""
      } ${!isLast ? "border-b border-brand-neutral-200" : ""}`}
    >
      {selected ? (
        <CircleDot size={20} className="text-brand-primary-500 shrink-0" />
      ) : (
        <Circle
          size={20}
          className={`shrink-0 ${disabled ? "text-brand-neutral-200" : "text-brand-neutral-300"}`}
        />
      )}
      <div className="flex-1 min-w-0">
        <p
          className={`text-[14px] ${disabled ? "text-brand-neutral-400" : "text-brand-neutral-900"}`}
          style={{ fontWeight: 500 }}
        >
          {label}
        </p>
        {caption && (
          <p
            className="text-[11px] text-brand-neutral-400 mt-0.5"
            style={{ fontWeight: 400 }}
          >
            {caption}
          </p>
        )}
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════════
   Mobile Money row
   ══════════════════════════════════════════════ */

function MobileMoneyRow({
  name,
  isLast = false,
}: {
  name: string;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3.5 px-4 py-3.5 ${
        !isLast ? "border-b border-brand-neutral-200" : ""
      }`}
    >
      <div className="w-9 h-9 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
        <Smartphone size={18} className="text-brand-neutral-700" />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[14px] text-brand-neutral-900"
          style={{ fontWeight: 500 }}
        >
          {name}
        </p>
        <p
          className="text-[11px] text-brand-neutral-400 mt-0.5"
          style={{ fontWeight: 400 }}
        >
          Coming soon
        </p>
      </div>
      <button
        onClick={() => toast("Coming soon — linking is not available yet.")}
        className="h-8 px-3.5 rounded-lg text-[12px] border-[1.5px] border-brand-neutral-200 bg-brand-neutral-0 text-brand-neutral-400 cursor-not-allowed"
        style={{ fontWeight: 500 }}
        disabled
      >
        Link
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function SET04PaymentMethodsPage() {
  const navigate = useNavigate();

  const [defaultMethod, setDefaultMethod] = useState<"wallet" | "mobile">(
    "wallet"
  );

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
          Payment methods
        </h2>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-10">
        {/* ── A) Aba Wallet ── */}
        <div className="px-5 pt-4">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            ABA WALLET
          </p>
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3.5 px-4 py-4">
              <div className="w-10 h-10 rounded-xl bg-brand-primary-100 flex items-center justify-center shrink-0">
                <Wallet size={20} className="text-brand-primary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[14px] text-brand-neutral-900"
                  style={{ fontWeight: 500 }}
                >
                  Aba Wallet
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-success-500" />
                  <p
                    className="text-[11px] text-brand-success-500"
                    style={{ fontWeight: 500 }}
                  >
                    Active
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/wal-01")}
                className="h-9 px-4 rounded-xl text-[13px] flex items-center gap-1.5 border-[1.5px] border-brand-neutral-900 bg-brand-neutral-0 text-brand-neutral-900 hover:bg-brand-neutral-100 transition-colors"
                style={{ fontWeight: 500 }}
              >
                View wallet
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── B) Mobile Money ── */}
        <div className="px-5 pt-5">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            MOBILE MONEY
          </p>
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden">
            <MobileMoneyRow name="MTN Mobile Money" />
            <MobileMoneyRow name="Airtel Money" isLast />
          </div>

          {/* Empty-state note */}
          <div className="flex items-start gap-2 px-1 mt-2.5">
            <Info
              size={14}
              className="text-brand-neutral-400 mt-0.5 shrink-0"
            />
            <p
              className="text-[11px] text-brand-neutral-400"
              style={{ fontWeight: 400 }}
            >
              No mobile money accounts linked yet.
            </p>
          </div>
        </div>

        {/* ── C) Default payment method ── */}
        <div className="px-5 pt-5">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            DEFAULT PAYMENT METHOD
          </p>
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden">
            <RadioOption
              label="Aba Wallet"
              selected={defaultMethod === "wallet"}
              onSelect={() => {
                setDefaultMethod("wallet");
                toast.success("Default set to Aba Wallet");
              }}
            />
            <RadioOption
              label="Mobile Money"
              caption="Link an account first"
              selected={defaultMethod === "mobile"}
              onSelect={() => {}}
              disabled
              isLast
            />
          </div>
        </div>

        {/* ── Helper ── */}
        <div className="px-5 pt-3 pb-6">
          <div className="flex items-start gap-2 px-1">
            <Info
              size={14}
              className="text-brand-neutral-400 mt-0.5 shrink-0"
            />
            <p
              className="text-[11px] text-brand-neutral-400"
              style={{ fontWeight: 400 }}
            >
              Your default method is used for package purchases and top-ups.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}