import { useNavigate } from "react-router";
import {
  Wallet,
  Clock,
  Copy,
  ArrowDownLeft,
  Package,
  CreditCard,
  ReceiptText,
  Info,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { BottomNav } from "../components/BottomNav";

/* ══════════════════════════════════════════════
   Constants
   ══════════════════════════════════════════════ */

const ABA_ID = "ABA-000183";

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function WAL01WalletHomePage() {
  const navigate = useNavigate();

  const copyId = () => {
    navigator.clipboard.writeText(ABA_ID).then(
      () => toast.success("ABA ID copied"),
      () => toast.error("Copy failed")
    );
  };

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ═══════════════════════════════════════
          1) App bar (fixed)
         ═══════════════════════════════════════ */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
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
              Wallet
            </h2>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          Scrollable content
         ═══════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto pt-[88px] pb-24">
        {/* ─────────────────────────────────────
            2) Balance card (hero)
           ───────────────────────────────────── */}
        <div className="px-5 pt-3 pb-4">
          <div className="bg-brand-neutral-900 rounded-2xl p-5">
            {/* Label */}
            <div className="flex items-center gap-2 mb-1">
              <Wallet size={14} className="text-brand-neutral-500" />
              <p
                className="text-[11px] tracking-[0.06em] uppercase text-brand-neutral-500"
                style={{ fontWeight: 500 }}
              >
                Available balance
              </p>
            </div>

            {/* Amount */}
            <h3
              className="text-[32px] tracking-[-0.02em] text-brand-neutral-0 mb-2"
              style={{ fontWeight: 600, lineHeight: 1.15 }}
            >
              UGX 0
            </h3>

            {/* ABA ID row */}
            <button
              onClick={copyId}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-neutral-800 mb-5 transition-colors hover:bg-brand-neutral-700"
            >
              <span
                className="text-[11px] text-brand-neutral-300"
                style={{ fontWeight: 400 }}
              >
                ABA ID: {ABA_ID}
              </span>
              <Copy size={11} className="text-brand-neutral-500" />
            </button>

            {/* CTAs */}
            <div className="flex items-center gap-2">
              {/* Primary: Top up → WAL-02 */}
              <button
                onClick={() => navigate("/wal-02")}
                className="flex-1 h-10 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                style={{ fontWeight: 500 }}
              >
                <ArrowDownLeft size={14} />
                Top up
              </button>

              {/* Secondary: View transactions → WAL-03 */}
              <button
                onClick={() => navigate("/wal-03")}
                className="flex-1 h-10 bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                style={{ fontWeight: 500 }}
              >
                <ReceiptText size={14} />
                View transactions
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────
            3) Quick actions row (2 cards)
           ───────────────────────────────────── */}
        <div className="px-5 pb-4">
          <div className="grid grid-cols-2 gap-2.5">
            {/* Card A: Buy a package → PKG-01 */}
            <button
              onClick={() => navigate("/pkg-01")}
              className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 flex flex-col items-start text-left hover:bg-brand-neutral-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-primary-50 flex items-center justify-center mb-3">
                <Package size={18} className="text-brand-primary-500" />
              </div>
              <p
                className="text-[13px] text-brand-neutral-900 mb-0.5"
                style={{ fontWeight: 500 }}
              >
                Buy a package
              </p>
              <p
                className="text-[11px] text-brand-neutral-500"
                style={{ fontWeight: 400, lineHeight: "15px" }}
              >
                Unlock coverage instantly
              </p>
            </button>

            {/* Card B: Payment methods → SET-04 */}
            <button
              onClick={() => navigate("/set-04")}
              className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 flex flex-col items-start text-left hover:bg-brand-neutral-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-secondary-50 flex items-center justify-center mb-3">
                <CreditCard size={18} className="text-brand-secondary-500" />
              </div>
              <p
                className="text-[13px] text-brand-neutral-900 mb-0.5"
                style={{ fontWeight: 500 }}
              >
                Payment methods
              </p>
              <p
                className="text-[11px] text-brand-neutral-500"
                style={{ fontWeight: 400, lineHeight: "15px" }}
              >
                Manage MoMo & wallet
              </p>
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────
            4) Recent transactions (empty state)
           ───────────────────────────────────── */}
        <div className="px-5 pb-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <p
              className="text-[12px] text-brand-neutral-500"
              style={{ fontWeight: 500, letterSpacing: "0.02em" }}
            >
              RECENT TRANSACTIONS
            </p>
            <button
              onClick={() => navigate("/wal-03")}
              className="text-[12px] text-brand-primary-500"
              style={{ fontWeight: 500 }}
            >
              See all
            </button>
          </div>

          {/* Empty state card */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5 flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-xl bg-brand-neutral-100 flex items-center justify-center mb-3">
              <ReceiptText size={20} className="text-brand-neutral-500" />
            </div>
            <p
              className="text-[14px] text-brand-neutral-900 mb-1"
              style={{ fontWeight: 500 }}
            >
              No transactions yet
            </p>
            <p
              className="text-[12px] text-brand-neutral-500 mb-4"
              style={{ fontWeight: 400, lineHeight: "18px" }}
            >
              Top up your wallet or buy a package to see activity here.
            </p>
            <button
              onClick={() => navigate("/wal-02")}
              className="h-9 px-5 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
              style={{ fontWeight: 500 }}
            >
              <ArrowDownLeft size={13} />
              Top up now
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────
            5) Helper note
           ───────────────────────────────────── */}
        <div className="px-5 pb-6">
          <div className="flex items-start gap-2 px-1">
            <Info
              size={14}
              className="text-brand-neutral-400 mt-0.5 shrink-0"
            />
            <p
              className="text-[11px] text-brand-neutral-400"
              style={{ fontWeight: 400, lineHeight: "16px" }}
            >
              Wallet is used for package purchases. Some out-of-pocket payments
              may be paid at the facility.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          Bottom Navigation (fixed)
         ═══════════════════════════════════════ */}
    </div>
  );
}