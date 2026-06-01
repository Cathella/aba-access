import { useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import { useAuth } from "../../lib/auth-context";
import {
  ArrowLeft,
  ShieldCheck,
  Wallet,
  Info,
  Copy,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

/* ══════════════════════════════════════════════
   Data types
   ══════════════════════════════════════════════ */

interface CoveredLineItem {
  label: string;
  detail: string;
  amount: string;
}

interface OopLineItem {
  label: string;
  amount: string;
  status: "Paid" | "Pending";
  paymentMethod: "aba-wallet" | "facility";
  txRef?: string;
}

interface ReceiptData {
  visitId: string;
  facility: string;
  date: string;
  patient: string;
  /** true when the package was purchased via wallet */
  packageViaTx?: string;
  coveredItems: CoveredLineItem[];
  oopItems: OopLineItem[];
}

/* ══════════════════════════════════════════════
   Sample receipt records
   ══════════════════════════════════════════════ */

const receipts: Record<string, ReceiptData> = {
  "visit-001": {
    visitId: "visit-001",
    facility: "Mukono Family Clinic",
    date: "19 Feb 2026",
    patient: "Ben (Dependent)",
    packageViaTx: "TX-00091",
    coveredItems: [
      {
        label: "Consultation",
        detail: "Covered by package",
        amount: "UGX 0",
      },
      {
        label: "Lab",
        detail: "Covered by package",
        amount: "UGX 0",
      },
      {
        label: "Pharmacy",
        detail: "Discount applied",
        amount: "UGX 3,500 saved",
      },
    ],
    oopItems: [
      {
        label: "Additional test (Out-of-pocket)",
        amount: "UGX 15,000",
        status: "Paid",
        paymentMethod: "aba-wallet",
        txRef: "TX-00074",
      },
    ],
  },
  "visit-002": {
    visitId: "visit-002",
    facility: "Sunrise Diagnostics",
    date: "18 Feb 2026",
    patient: "Catherine",
    packageViaTx: "TX-00091",
    coveredItems: [
      {
        label: "Lab",
        detail: "Covered by package",
        amount: "UGX 0",
      },
    ],
    oopItems: [],
  },
  "visit-003": {
    visitId: "visit-003",
    facility: "Divine Care Pharmacy",
    date: "12 Feb 2026",
    patient: "Catherine",
    packageViaTx: "TX-00091",
    coveredItems: [
      {
        label: "Pharmacy",
        detail: "Discount applied",
        amount: "UGX 3,500 saved",
      },
    ],
    oopItems: [
      {
        label: "Additional test (Out-of-pocket)",
        amount: "UGX 15,000",
        status: "Pending",
        paymentMethod: "facility",
      },
    ],
  },
};

/* ══════════════════════════════════════════════
   Status chip styles
   ══════════════════════════════════════════════ */

const statusChipStyles: Record<OopLineItem["status"], string> = {
  Paid: "bg-brand-success-50 text-brand-success-500",
  Pending: "bg-brand-warning-50 text-brand-warning-500",
};

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function CARE04ReceiptsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();
  const visitId = searchParams.get("visitId") || "visit-001";
  const data = receipts[visitId] ?? receipts["visit-001"];
  const [showSavings, setShowSavings] = useState(true);

  const hasOop = data.oopItems.length > 0;

  /* Separate savings items (amount contains "saved") from zero-cost items */
  const savingsItems = data.coveredItems.filter((i) =>
    i.amount.toLowerCase().includes("saved")
  );
  const hasSavings = savingsItems.length > 0;

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ App Bar (fixed) ══ */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/care-02?id=" + visitId)}
            className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-brand-neutral-900" />
          </button>
          <h2
            className="text-[17px] text-brand-neutral-900"
            style={{ fontWeight: 600 }}
          >
            Receipts
          </h2>
        </div>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[80px]">
        <div className="px-5 pt-4 space-y-3">
          {/* ──────────────────────────────────────
              Receipt summary card
          ────────────────────────────────────── */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <h3
              className="text-[15px] text-brand-neutral-900 mb-2.5"
              style={{ fontWeight: 600 }}
            >
              {data.facility}
            </h3>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  Date
                </span>
                <span
                  className="text-[12px] text-brand-neutral-700"
                  style={{ fontWeight: 400 }}
                >
                  {data.date}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  Patient
                </span>
                <span
                  className="text-[12px] text-brand-neutral-900"
                  style={{ fontWeight: 500 }}
                >
                  {data.patient}
                </span>
              </div>

              {/* Separator before ABA Member ID */}
              <div className="border-t border-brand-neutral-200 !mt-2.5 !mb-1" />

              {/* ABA Member ID */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  ABA Member ID
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[12px] text-brand-neutral-900 font-mono"
                    style={{ fontWeight: 500 }}
                  >
                    {profile.memberId || "—"}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(profile.memberId || "");
                      toast.success("ABA ID copied");
                    }}
                    className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-brand-neutral-100 transition-colors"
                    aria-label="Copy ABA ID"
                  >
                    <Copy size={12} className="text-brand-neutral-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Wallet-linked note */}
            <div className="mt-3 pt-3 border-t border-brand-neutral-200 flex items-start gap-2">
              <Wallet
                size={12}
                className="text-brand-neutral-400 shrink-0 mt-0.5"
              />
              <p
                className="text-[11px] text-brand-neutral-400"
                style={{ fontWeight: 400, lineHeight: "16px" }}
              >
                Wallet-linked receipts show TX references for easy tracking.
              </p>
            </div>
          </div>

          {/* ──────────────────────────────────────
              Show savings toggle
          ────────────────────────────────────── */}
          <div className="flex items-center justify-between bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl px-4 py-3">
            <span
              className="text-[13px] text-brand-neutral-900"
              style={{ fontWeight: 500 }}
            >
              Show savings
            </span>
            <button
              onClick={() => setShowSavings((s) => !s)}
              className={`relative w-10 h-[22px] rounded-full transition-colors ${
                showSavings
                  ? "bg-brand-primary-500"
                  : "bg-brand-neutral-200"
              }`}
            >
              <span
                className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-brand-neutral-0 transition-transform shadow-sm ${
                  showSavings ? "translate-x-[18px]" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* ──────────────────────────────────────
              Package covered section
          ────────────────────────────────────── */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            {/* Section header */}
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={14} className="text-brand-success-500" />
              <h4
                className="text-[13px] text-brand-neutral-900"
                style={{ fontWeight: 600 }}
              >
                Package covered
              </h4>
            </div>

            {/* Line items */}
            <div className="space-y-0">
              {data.coveredItems.map((item, idx) => {
                const isLast = idx === data.coveredItems.length - 1;
                const isSaving = item.amount.toLowerCase().includes("saved");
                return (
                  <div
                    key={item.label}
                    className={`py-3 ${
                      !isLast ? "border-b border-brand-neutral-200" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[13px] text-brand-neutral-900"
                          style={{ fontWeight: 500 }}
                        >
                          {item.label}
                        </p>
                        <p
                          className="text-[11px] text-brand-neutral-500 mt-0.5"
                          style={{ fontWeight: 400 }}
                        >
                          {item.detail === "Discount applied"
                            ? "Covered by package"
                            : item.detail}
                        </p>
                      </div>
                      <div className="flex flex-col items-end shrink-0 ml-3">
                        {isSaving && !showSavings ? (
                          <span
                            className="text-[11px] text-brand-neutral-400"
                            style={{ fontWeight: 400 }}
                          >
                            Hidden
                          </span>
                        ) : (
                          <span
                            className={`text-[13px] ${
                              isSaving && showSavings
                                ? "text-brand-success-500"
                                : "text-brand-neutral-900"
                            }`}
                            style={{ fontWeight: 500 }}
                          >
                            {item.amount}
                          </span>
                        )}

                        {/* Savings badge */}
                        {isSaving && showSavings && (
                          <span
                            className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-brand-success-50 text-brand-success-500 text-[10px] mt-1"
                            style={{ fontWeight: 500 }}
                          >
                            Saved UGX 3,500
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Package purchase → View transaction link */}
            {data.packageViaTx && (
              <div className="mt-3 pt-3 border-t border-brand-neutral-200 flex items-center justify-between">
                <span
                  className="text-[11px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  Paid via Aba Wallet
                </span>
                <button
                  onClick={() =>
                    navigate(`/wal-04/${data.packageViaTx}`)
                  }
                  className="inline-flex items-center gap-1 text-[12px] text-brand-primary-500 hover:text-brand-primary-400 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  View transaction
                  <ChevronRight size={12} />
                </button>
              </div>
            )}
          </div>

          {/* ──────────────────────────────────────
              Out-of-pocket section (conditional)
          ────────────────────────────────────── */}
          {hasOop && (
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
              {/* Section header */}
              <div className="flex items-center gap-2 mb-3">
                <Wallet size={14} className="text-brand-warning-500" />
                <h4
                  className="text-[13px] text-brand-neutral-900"
                  style={{ fontWeight: 600 }}
                >
                  Out-of-pocket
                </h4>
              </div>

              {/* Line items */}
              <div className="space-y-0">
                {data.oopItems.map((item, idx) => {
                  const isLast = idx === data.oopItems.length - 1;
                  const isWallet = item.paymentMethod === "aba-wallet";
                  return (
                    <div
                      key={item.label}
                      className={`py-3 ${
                        !isLast ? "border-b border-brand-neutral-200" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-[13px] text-brand-neutral-900"
                            style={{ fontWeight: 500 }}
                          >
                            {item.label}
                          </p>
                          {/* Payment method caption */}
                          <p
                            className="text-[11px] text-brand-neutral-500 mt-0.5"
                            style={{ fontWeight: 400 }}
                          >
                            {isWallet ? "Paid via Aba Wallet" : "Paid at facility"}
                          </p>
                          {/* Status chip */}
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] mt-1.5 ${
                              statusChipStyles[item.status]
                            }`}
                            style={{ fontWeight: 500 }}
                          >
                            {item.status}
                          </span>
                        </div>
                        <div className="flex flex-col items-end shrink-0 ml-3">
                          <span
                            className="text-[13px] text-brand-neutral-900"
                            style={{ fontWeight: 500 }}
                          >
                            {item.amount}
                          </span>
                          {/* View transaction link (wallet payments only) */}
                          {isWallet && item.txRef && (
                            <button
                              onClick={() => navigate(`/wal-04/${item.txRef}`)}
                              className="inline-flex items-center gap-0.5 text-[11px] text-brand-primary-500 hover:text-brand-primary-400 transition-colors mt-1.5"
                              style={{ fontWeight: 500 }}
                            >
                              View transaction
                              <ChevronRight size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────
              Info note
          ────────────────────────────────────── */}
          <div className="bg-brand-neutral-100 border border-brand-neutral-200 rounded-2xl px-4 py-3 flex items-start gap-2.5 mb-4">
            <Info
              size={14}
              className="text-brand-neutral-400 shrink-0 mt-0.5"
            />
            <p
              className="text-[11px] text-brand-neutral-500"
              style={{ fontWeight: 400 }}
            >
              Out-of-pocket payments may be made at the facility. Wallet support
              is coming soon.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}