import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  AlertCircle,
  CircleDot,
  Circle,
  Smartphone,
} from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { supabase } from "../../lib/supabase";

/* ══════════════════════════════════════════════
   Data
   ══════════════════════════════════════════════ */

const quickAmounts = [
  { label: "10k", value: 10_000 },
  { label: "20k", value: 20_000 },
  { label: "50k", value: 50_000 },
  { label: "100k", value: 100_000 },
];

type MethodId = "mtn" | "airtel";

const methods: { id: MethodId; label: string }[] = [
  { id: "mtn", label: "MTN Mobile Money" },
  { id: "airtel", label: "Airtel Money" },
];

const PHONE = "+256 7XX XXX XXX";
const MIN_AMOUNT = 2_000;

/* ══════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════ */

function formatNumber(v: number): string {
  return v.toLocaleString("en-UG");
}

function parseAmount(raw: string): number {
  return Number(raw.replace(/[^0-9]/g, "")) || 0;
}

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function WAL02TopUpPage() {
  const navigate = useNavigate();

  const [rawAmount, setRawAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<MethodId>("mtn");
  const [showError, setShowError] = useState(false);
  const [activeChip, setActiveChip] = useState<number | null>(null);

  const numericAmount = parseAmount(rawAmount);
  const isValid = numericAmount >= MIN_AMOUNT;

  /* Handle chip tap */
  const tapChip = (value: number) => {
    setActiveChip(value);
    setRawAmount(formatNumber(value));
    setShowError(false);
  };

  /* Handle input change */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9,]/g, "");
    setRawAmount(v);
    setActiveChip(null);
    if (showError && parseAmount(v) >= MIN_AMOUNT) setShowError(false);
  };

  /* Submit */
  const handleSubmit = async () => {
    if (!isValid) {
      setShowError(true);
      return;
    }
    setShowError(false);

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user.id;
    if (userId) {
      const methodLabel = methods.find((m) => m.id === selectedMethod)?.label ?? "Mobile Money";
      // No real Mobile Money gateway integrated yet — this MVP simulates an
      // instant successful top up so the wallet is usable for pilot demos.
      await supabase.from("wallet_transactions").insert({
        user_id: userId,
        type: "topup",
        title: "Top up",
        subtitle: methodLabel,
        amount_ugx: numericAmount,
        direction: "credit",
        status: "completed",
      });
    }

    navigate("/wal-02a");
  };

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ═══════════════════════════════════════
          App bar (fixed)
         ═══════════════════════════════════════ */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 flex items-center gap-3 border-b border-brand-neutral-200">
        <button
          onClick={() => navigate("/wal-01")}
          className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
        >
          <ArrowLeft size={16} className="text-brand-neutral-900" />
        </button>
        <h2
          className="text-[17px] text-brand-neutral-900"
          style={{ fontWeight: 600 }}
        >
          Top up
        </h2>
      </div>

      {/* ═══════════════════════════════════════
          Scrollable content
         ═══════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto pt-[80px] pb-40">
        {/* ─────────────────────────────────────
            Section 1: Amount card
           ───────────────────────────────────── */}
        <div className="px-5 pt-4 pb-3">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <p
              className="text-[12px] text-brand-neutral-500 mb-2"
              style={{ fontWeight: 500, letterSpacing: "0.02em" }}
            >
              AMOUNT
            </p>

            {/* Input */}
            <div className="relative mb-3">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-brand-neutral-400"
                style={{ fontWeight: 500 }}
              >
                UGX
              </span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="e.g., 50,000"
                value={rawAmount}
                onChange={handleInputChange}
                className={`w-full h-12 pl-14 pr-4 bg-brand-neutral-100 rounded-xl text-[16px] text-brand-neutral-900 placeholder:text-brand-neutral-300 border transition-colors ${
                  showError
                    ? "border-brand-error-500"
                    : "border-transparent focus:border-brand-neutral-300"
                }`}
                style={{ fontWeight: 500 }}
              />
            </div>

            {/* Quick-amount chips */}
            <div className="flex items-center gap-2">
              {quickAmounts.map((qa) => {
                const isActive = activeChip === qa.value;
                return (
                  <button
                    key={qa.value}
                    onClick={() => tapChip(qa.value)}
                    className={`flex-1 h-9 rounded-xl text-[13px] border-[1.5px] transition-colors ${
                      isActive
                        ? "bg-brand-primary-300 border-brand-neutral-900 text-brand-neutral-900"
                        : "bg-brand-neutral-0 border-brand-neutral-200 text-brand-neutral-700 hover:border-brand-neutral-300"
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    {qa.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────
            Error banner (inline)
           ───────────────────────────────────── */}
        {showError && (
          <div className="px-5 pb-3">
            <div className="bg-brand-error-50 border border-brand-error-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <AlertCircle
                size={16}
                className="text-brand-error-500 shrink-0 mt-0.5"
              />
              <p
                className="text-[13px] text-brand-error-500"
                style={{ fontWeight: 500 }}
              >
                Enter a valid amount (min UGX 2,000).
              </p>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────
            Section 2: Payment method card
           ───────────────────────────────────── */}
        <div className="px-5 pb-3">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden">
            <p
              className="text-[12px] text-brand-neutral-500 px-4 pt-4 pb-2"
              style={{ fontWeight: 500, letterSpacing: "0.02em" }}
            >
              PAYMENT METHOD
            </p>

            {methods.map((m, i) => {
              const isSelected = selectedMethod === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMethod(m.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-brand-neutral-100 ${
                    i < methods.length - 1
                      ? "border-b border-brand-neutral-200"
                      : ""
                  }`}
                >
                  {isSelected ? (
                    <CircleDot
                      size={20}
                      className="text-brand-primary-500 shrink-0"
                    />
                  ) : (
                    <Circle
                      size={20}
                      className="text-brand-neutral-300 shrink-0"
                    />
                  )}
                  <div className="w-8 h-8 rounded-lg bg-brand-neutral-100 flex items-center justify-center shrink-0">
                    <Smartphone size={16} className="text-brand-neutral-700" />
                  </div>
                  <p
                    className="text-[14px] text-brand-neutral-900"
                    style={{ fontWeight: 500 }}
                  >
                    {m.label}
                  </p>
                </button>
              );
            })}

            {/* Helper caption */}
            <div className="px-4 pb-3.5 pt-1">
              <p
                className="text-[11px] text-brand-neutral-400"
                style={{ fontWeight: 400 }}
              >
                You&apos;ll approve a prompt on your phone.
              </p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────
            Section 3: Phone confirmation row
           ───────────────────────────────────── */}
        <div className="px-5 pb-3">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl px-4 py-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-neutral-100 flex items-center justify-center shrink-0">
              <Smartphone size={15} className="text-brand-neutral-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[11px] text-brand-neutral-400 mb-0.5"
                style={{ fontWeight: 500, letterSpacing: "0.02em" }}
              >
                FROM
              </p>
              <p
                className="text-[14px] text-brand-neutral-900"
                style={{ fontWeight: 500 }}
              >
                {PHONE}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          Sticky CTA
         ═══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 px-5 pt-3 pb-4 border-t border-brand-neutral-200">
        <button
          onClick={handleSubmit}
          className="w-full h-12 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[14px] flex items-center justify-center transition-colors"
          style={{ fontWeight: 500 }}
        >
          Request payment
        </button>
      </div>

      {/* ── Bottom Nav ── */}
    </div>
  );
}