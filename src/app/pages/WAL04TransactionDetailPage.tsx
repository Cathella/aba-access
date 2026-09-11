import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../lib/auth-context";
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Check,
  Download,
  Share2,
  ChevronRight,
  MapPin,
  Smartphone,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BottomNav } from "../components/BottomNav";
import { supabase } from "../../lib/supabase";
import {
  formatTxDate,
  formatTxTime,
  formatUgx,
  type WalletTransaction,
  type WalletTxStatus,
  type WalletTxType,
} from "../../lib/wallet";

/* ══════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════ */

function statusClasses(s: WalletTxStatus) {
  switch (s) {
    case "completed":
      return "bg-brand-success-50 text-brand-success-500";
    case "pending":
      return "bg-brand-neutral-100 text-brand-neutral-500";
    case "failed":
      return "bg-brand-error-50 text-brand-error-500";
  }
}

function statusLabel(s: WalletTxStatus) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function typeLabel(t: WalletTxType) {
  switch (t) {
    case "package_purchase":
      return "Package purchase";
    case "topup":
      return "Top up";
    case "oop":
      return "Out-of-pocket";
  }
}

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function WAL04TransactionDetailPage() {
  const navigate = useNavigate();
  const { txId } = useParams<{ txId: string }>();
  const { profile } = useAuth();
  const [copied, setCopied] = useState(false);
  const [tx, setTx] = useState<WalletTransaction | null | undefined>(undefined);

  useEffect(() => {
    if (!txId) {
      setTx(null);
      return;
    }
    supabase
      .from("wallet_transactions")
      .select("id, type, title, subtitle, amount_ugx, direction, status, created_at")
      .eq("id", txId)
      .maybeSingle()
      .then(({ data }) => setTx(data ?? null));
  }, [txId]);

  /* Loading */
  if (tx === undefined) {
    return (
      <div className="min-h-screen bg-brand-neutral-100 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-brand-primary-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  /* Fallback if ID not found */
  if (!tx) {
    return (
      <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
        <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 flex items-center gap-3 border-b border-brand-neutral-200">
          <button
            onClick={() => navigate("/wal-03")}
            className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-brand-neutral-900" />
          </button>
          <h2
            className="text-[17px] text-brand-neutral-900"
            style={{ fontWeight: 600 }}
          >
            Transaction
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center px-5 pb-24">
          <p className="text-[14px] text-brand-neutral-500" style={{ fontWeight: 400 }}>
            Transaction not found.
          </p>
        </div>
        <BottomNav activeTab="home" />
      </div>
    );
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(profile.memberId || "—").then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => toast.error("Copy failed")
    );
  };

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ═══════════════════════════════════════
          App bar (fixed)
         ═══════════════════════════════════════ */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 flex items-center gap-3 border-b border-brand-neutral-200">
        <button
          onClick={() => navigate("/wal-03")}
          className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
        >
          <ArrowLeft size={16} className="text-brand-neutral-900" />
        </button>
        <h2
          className="text-[17px] text-brand-neutral-900"
          style={{ fontWeight: 600 }}
        >
          Transaction
        </h2>
      </div>

      {/* ═══════════════════════════════════════
          Scrollable content
         ═══════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto pt-[80px] pb-24">
        {/* ─────────────────────────────────────
            Receipt card
           ───────────────────────────────────── */}
        <div className="px-5 pt-4 pb-3">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5">
            {/* Amount hero */}
            <div className="flex flex-col items-center text-center mb-4">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
                  tx.direction === "credit"
                    ? "bg-brand-success-50"
                    : "bg-brand-neutral-100"
                }`}
              >
                {tx.direction === "credit" ? (
                  <ArrowDownLeft size={20} className="text-brand-success-500" />
                ) : (
                  <ArrowUpRight size={20} className="text-brand-neutral-700" />
                )}
              </div>
              <h3
                className={`text-[26px] tracking-[-0.02em] mb-1 ${
                  tx.direction === "credit"
                    ? "text-brand-success-500"
                    : "text-brand-neutral-900"
                }`}
                style={{ fontWeight: 600, lineHeight: 1.15 }}
              >
                {tx.direction === "credit" ? "+ " : "- "}
                {formatUgx(tx.amount_ugx)}
              </h3>
              <p
                className="text-[13px] text-brand-neutral-500 mb-2"
                style={{ fontWeight: 400 }}
              >
                {typeLabel(tx.type)}
              </p>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] ${statusClasses(
                  tx.status
                )}`}
                style={{ fontWeight: 500 }}
              >
                {statusLabel(tx.status)}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-brand-neutral-200 my-4" />

            {/* Detail rows */}
            <div className="space-y-3">
              <DetailRow label="Date" value={`${formatTxDate(tx.created_at)}, ${formatTxTime(tx.created_at)}`} />
              <DetailRow label="Reference" value={tx.id} />
              <div className="flex items-center justify-between">
                <p
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  ABA Member ID
                </p>
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-1.5"
                >
                  <span
                    className="text-[13px] text-brand-neutral-900"
                    style={{ fontWeight: 500 }}
                  >
                    {profile.memberId || "—"}
                  </span>
                  {copied ? (
                    <Check size={13} className="text-brand-success-500" />
                  ) : (
                    <Copy size={13} className="text-brand-neutral-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────
            Context card (dynamic)
           ───────────────────────────────────── */}
        <div className="px-5 pb-3">
          {tx.type === "package_purchase" && (
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
              <p
                className="text-[12px] text-brand-neutral-500 mb-3"
                style={{ fontWeight: 500, letterSpacing: "0.02em" }}
              >
                PACKAGE DETAILS
              </p>
              <div className="space-y-2.5 mb-4">
                <DetailRow label="Package" value={tx.subtitle} />
              </div>
              <div className="border-t border-brand-neutral-200 pt-3">
                <button
                  onClick={() => navigate("/pkg-07")}
                  className="w-full text-[13px] text-brand-primary-500 hover:text-brand-primary-400 flex items-center justify-center gap-1.5 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  View package
                </button>
              </div>
            </div>
          )}

          {tx.type === "topup" && (
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
              <p
                className="text-[12px] text-brand-neutral-500 mb-3"
                style={{ fontWeight: 500, letterSpacing: "0.02em" }}
              >
                TOP UP DETAILS
              </p>
              <div className="space-y-2.5 mb-3">
                <DetailRow label="Method" value={tx.subtitle} />
                <DetailRow label="From" value={profile.phone || "—"} />
              </div>
              <div className="flex items-start gap-2 px-0.5 pt-1">
                <Smartphone
                  size={13}
                  className="text-brand-neutral-400 mt-0.5 shrink-0"
                />
                <p
                  className="text-[11px] text-brand-neutral-400"
                  style={{ fontWeight: 400, lineHeight: "16px" }}
                >
                  Top ups may take a few moments to reflect in your balance.
                </p>
              </div>
            </div>
          )}

          {tx.type === "oop" && (
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
              <p
                className="text-[12px] text-brand-neutral-500 mb-3"
                style={{ fontWeight: 500, letterSpacing: "0.02em" }}
              >
                VISIT DETAILS
              </p>
              <div className="space-y-2.5 mb-4">
                <DetailRow label="Facility" value={tx.subtitle} />
              </div>
              <button
                onClick={() => navigate("/care-02")}
                className="w-full h-10 bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                style={{ fontWeight: 500 }}
              >
                <MapPin size={14} />
                View visit
                <ChevronRight size={13} className="text-brand-neutral-400" />
              </button>
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────
            Actions row
           ───────────────────────────────────── */}
        {/* Moved to fixed bottom bar */}
      </div>

      {/* ═══════════════════════════════════════
          Fixed bottom actions
         ═══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pb-4 pt-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast("Share receipt — coming soon.")}
            className="flex-1 h-10 bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
            style={{ fontWeight: 500 }}
          >
            <Share2 size={14} />
            Share receipt
          </button>
          <button
            onClick={() => toast("Download receipt — coming soon.")}
            className="flex-1 h-10 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
            style={{ fontWeight: 500 }}
          >
            <Download size={14} />
            Download receipt
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Sub-component: detail row
   ══════════════════════════════════════════════ */

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <p
        className="text-[12px] text-brand-neutral-500"
        style={{ fontWeight: 400 }}
      >
        {label}
      </p>
      <p
        className="text-[13px] text-brand-neutral-900"
        style={{ fontWeight: 500 }}
      >
        {value}
      </p>
    </div>
  );
}