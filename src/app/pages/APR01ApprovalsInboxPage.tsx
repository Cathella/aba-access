import { useState } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import {
  SlidersHorizontal,
  Inbox,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";

/* ── Sample approval request data ── */
interface ApprovalRequest {
  id: string;
  facility: string;
  type: "Consultation" | "Lab" | "Pharmacy";
  patient: string;
  time: string;
  amount: string;
  status: "Requested" | "Expired";
}

const sampleRequests: ApprovalRequest[] = [
  {
    id: "req-001",
    facility: "Mukono Family Clinic",
    type: "Consultation",
    patient: "Ben (Dependent)",
    time: "Just now",
    amount: "Package will be used (1 visit)",
    status: "Requested",
  },
  {
    id: "req-002",
    facility: "Sunrise Diagnostics",
    type: "Lab",
    patient: "Catherine",
    time: "10 mins ago",
    amount: "Package will be used (1 test)",
    status: "Requested",
  },
  {
    id: "req-003",
    facility: "Divine Care Pharmacy",
    type: "Pharmacy",
    patient: "Catherine",
    time: "1 hr ago",
    amount: "Discount will apply (cap check)",
    status: "Requested",
  },
  {
    id: "req-004",
    facility: "Kampala Medical Centre",
    type: "Consultation",
    patient: "Ben (Dependent)",
    time: "2 days ago",
    amount: "Package would have been used (1 visit)",
    status: "Expired",
  },
];

/* ── Type chip colour mapping ── */
const typeChipStyles: Record<ApprovalRequest["type"], string> = {
  Consultation: "bg-brand-secondary-50 text-brand-secondary-500",
  Lab: "bg-brand-warning-50 text-brand-warning-500",
  Pharmacy: "bg-brand-success-50 text-brand-success-500",
};

/* ── Status chip styling ── */
const statusChipStyles: Record<ApprovalRequest["status"], string> = {
  Requested: "bg-brand-neutral-100 text-brand-neutral-700",
  Expired: "bg-brand-neutral-200 text-brand-neutral-500",
};

export function APR01ApprovalsInboxPage() {
  const navigate = useNavigate();
  const [showSample, setShowSample] = useState(false);

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ── App Bar (fixed top) ── */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <div className="flex items-center justify-between">
          <h2
            className="text-[22px] tracking-[-0.01em] text-brand-neutral-900"
            style={{ fontWeight: 600 }}
          >
            Approvals
          </h2>
          <button className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center">
            <SlidersHorizontal size={15} className="text-brand-neutral-500" />
          </button>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[80px]">
        {/* ════════════════════════════════════════════
            Section A — Empty state (default)
        ════════════════════════════════════════════ */}
        {!showSample && (
          <div className="px-5 pt-10 pb-6 flex flex-col items-center">
            {/* Icon placeholder */}
            <div className="w-16 h-16 rounded-2xl bg-brand-neutral-200 flex items-center justify-center mb-4">
              <Inbox size={28} className="text-brand-neutral-400" />
            </div>

            <h3
              className="text-[17px] text-brand-neutral-900 mb-1.5 text-center"
              style={{ fontWeight: 600 }}
            >
              No approval requests
            </h3>
            <p
              className="text-[13px] text-brand-neutral-500 text-center max-w-[260px] mb-5"
              style={{ fontWeight: 400 }}
            >
              When a facility requests coverage, it will appear here.
            </p>

            {/* Secondary CTA → PKG-01 */}
            <button
              onClick={() => navigate("/pkg-01")}
              className="h-10 px-5 bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1 transition-colors"
              style={{ fontWeight: 500 }}
            >
              View packages
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════════
            Section B — Sample list (toggled on)
        ════════════════════════════════════════════ */}
        {showSample && (
          <div className="px-5 pt-4 pb-4 space-y-3">
            {sampleRequests.map((req) => {
              const isExpired = req.status === "Expired";
              return (
                <button
                  key={req.id}
                  onClick={() =>
                    navigate(
                      isExpired
                        ? "/apr-09?id=" + req.id
                        : "/apr-02?id=" + req.id
                    )
                  }
                  className={`w-full text-left bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 transition-colors active:bg-brand-neutral-100 ${
                    isExpired ? "opacity-70" : ""
                  }`}
                >
                  {/* Row 1 — Facility + Status chip */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3
                      className={`text-[14px] ${
                        isExpired
                          ? "text-brand-neutral-500"
                          : "text-brand-neutral-900"
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {req.facility}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] shrink-0 ${statusChipStyles[req.status]}`}
                      style={{ fontWeight: 500 }}
                    >
                      {req.status}
                    </span>
                  </div>

                  {/* Row 2 — Type chip + Patient */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${typeChipStyles[req.type]}`}
                      style={{ fontWeight: 500 }}
                    >
                      {req.type}
                    </span>
                    <span
                      className="text-[12px] text-brand-neutral-500"
                      style={{ fontWeight: 400 }}
                    >
                      {req.patient}
                    </span>
                  </div>

                  {/* Row 3 — Time */}
                  <p
                    className="text-[11px] text-brand-neutral-400 mb-1"
                    style={{ fontWeight: 400 }}
                  >
                    {req.time}
                  </p>

                  {/* Row 4 — Amount / usage line */}
                  <p
                    className="text-[12px] text-brand-neutral-500 mb-3"
                    style={{ fontWeight: 400 }}
                  >
                    {req.amount}
                  </p>

                  {/* CTA — Review / Expired label */}
                  <div
                    className={`flex items-center justify-end gap-1 text-[13px] ${
                      isExpired ? "text-brand-neutral-400" : "text-brand-primary-500"
                    }`}
                  >
                    <span style={{ fontWeight: 500 }}>
                      {isExpired ? "View" : "Review"}
                    </span>
                    <ChevronRight size={14} />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Toggle: show / hide sample data ── */}
        <div className="px-5 pt-2 pb-4">
          <button
            onClick={() => setShowSample((s) => !s)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-neutral-0 border border-brand-neutral-200 text-[12px] text-brand-neutral-500 transition-colors hover:bg-brand-neutral-100"
            style={{ fontWeight: 500 }}
          >
            {showSample ? (
              <>
                <EyeOff size={14} />
                Hide sample requests
              </>
            ) : (
              <>
                <Eye size={14} />
                Show sample requests
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Bottom Navigation ── */}
      <BottomNav activeTab="approvals" />
    </div>
  );
}