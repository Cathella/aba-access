import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Check,
  Download,
  Share2,
  ChevronRight,
  Package,
  MapPin,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BottomNav } from "../components/BottomNav";

/* ══════════════════════════════════════════════
   Types & data
   ══════════════════════════════════════════════ */

type TxType = "package" | "topup" | "oop";
type TxStatus = "completed" | "pending" | "failed";

interface TxDetail {
  id: string;
  type: TxType;
  title: string;
  amount: string;
  amountSign: "credit" | "debit";
  status: TxStatus;
  date: string;
  time: string;
  /* Context fields */
  packageName?: string;
  packageValidity?: string;
  method?: string;
  phone?: string;
  facility?: string;
  patient?: string;
  visitId?: string;
}

const ABA_ID = "ABA-000183";

const txMap: Record<string, TxDetail> = {
  "TX-00091": {
    id: "TX-00091",
    type: "package",
    title: "Package purchase",
    amount: "- UGX 50,000",
    amountSign: "debit",
    status: "completed",
    date: "20 Feb 2026",
    time: "2:34 PM",
    packageName: "Care Bundle 50K",
    packageValidity: "30 days",
  },
  "TX-00092": {
    id: "TX-00092",
    type: "topup",
    title: "Top up",
    amount: "+ UGX 20,000",
    amountSign: "credit",
    status: "pending",
    date: "20 Feb 2026",
    time: "1:10 PM",
    method: "Airtel Money",
    phone: "+256 7XX XXX XXX",
  },
  "TX-00088": {
    id: "TX-00088",
    type: "topup",
    title: "Top up",
    amount: "+ UGX 100,000",
    amountSign: "credit",
    status: "completed",
    date: "19 Feb 2026",
    time: "10:22 AM",
    method: "MTN Mobile Money",
    phone: "+256 7XX XXX XXX",
  },
  "TX-00074": {
    id: "TX-00074",
    type: "oop",
    title: "Out-of-pocket",
    amount: "- UGX 15,000",
    amountSign: "debit",
    status: "completed",
    date: "12 Feb 2026",
    time: "3:45 PM",
    facility: "Sunrise Diagnostics",
    patient: "Ben (Dependent)",
    visitId: "V-000123",
  },
};

/* ══════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════ */

function statusClasses(s: TxStatus) {
  switch (s) {
    case "completed":
      return "bg-brand-success-50 text-brand-success-500";
    case "pending":
      return "bg-brand-neutral-100 text-brand-neutral-500";
    case "failed":
      return "bg-brand-error-50 text-brand-error-500";
  }
}

function statusLabel(s: TxStatus) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function typeLabel(t: TxType) {
  switch (t) {
    case "package":
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
  const [copied, setCopied] = useState(false);

  const tx = txMap[txId ?? ""];

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
    navigator.clipboard.writeText(ABA_ID).then(
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
                  tx.amountSign === "credit"
                    ? "bg-brand-success-50"
                    : "bg-brand-neutral-100"
                }`}
              >
                {tx.amountSign === "credit" ? (
                  <ArrowDownLeft size={20} className="text-brand-success-500" />
                ) : (
                  <ArrowUpRight size={20} className="text-brand-neutral-700" />
                )}
              </div>
              <h3
                className={`text-[26px] tracking-[-0.02em] mb-1 ${
                  tx.amountSign === "credit"
                    ? "text-brand-success-500"
                    : "text-brand-neutral-900"
                }`}
                style={{ fontWeight: 600, lineHeight: 1.15 }}
              >
                {tx.amount}
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
              <DetailRow label="Date" value={`${tx.date}, ${tx.time}`} />
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
                    {ABA_ID}
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
          {tx.type === "package" && (
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
              <p
                className="text-[12px] text-brand-neutral-500 mb-3"
                style={{ fontWeight: 500, letterSpacing: "0.02em" }}
              >
                PACKAGE DETAILS
              </p>
              <div className="space-y-2.5 mb-4">
                <DetailRow label="Package" value={tx.packageName ?? ""} />
                <DetailRow label="Validity" value={tx.packageValidity ?? ""} />
              </div>
              <div className="border-t border-brand-neutral-200 pt-3">
                <button
                  onClick={() => navigate("/pkg-05")}
                  className="w-full text-[13px] text-brand-primary-500 hover:text-brand-primary-400 flex items-center justify-center gap-1.5 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  View package
                </button>
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
                <DetailRow label="Facility" value={tx.facility ?? ""} />
                <DetailRow label="Patient" value={tx.patient ?? ""} />
                <DetailRow label="Visit ID" value={tx.visitId ?? ""} />
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

          {tx.type === "topup" && (
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
              <p
                className="text-[12px] text-brand-neutral-500 mb-3"
                style={{ fontWeight: 500, letterSpacing: "0.02em" }}
              >
                TOP UP DETAILS
              </p>
              <div className="space-y-2.5 mb-3">
                <DetailRow label="Method" value={tx.method ?? ""} />
                <DetailRow label="From" value={tx.phone ?? ""} />
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