import { useNavigate, useSearchParams } from "react-router";
import {
  CheckCircle2,
  Stethoscope,
  FlaskConical,
  Pill,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  QrCode,
  HeartPulse,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

/* ══════════════════════════════════════════════
   Request data (mirrors APR-02 source-of-truth)
   ══════════════════════════════════════════════ */

type ServiceType = "Consultation" | "Lab" | "Pharmacy";

interface RequestData {
  id: string;
  facility: string;
  serviceType: ServiceType;
  patient: string;
  covered: boolean;
  deductionSummary: string;
  visitId: string;
}

const requests: Record<string, RequestData> = {
  "req-001": {
    id: "req-001",
    facility: "Mukono Family Clinic",
    serviceType: "Consultation",
    patient: "Ben (Dependent)",
    covered: true,
    deductionSummary: "Deducted: 1 consultation visit",
    visitId: "V-000123",
  },
  "req-002": {
    id: "req-002",
    facility: "Sunrise Diagnostics",
    serviceType: "Lab",
    patient: "Catherine",
    covered: true,
    deductionSummary: "Deducted: 1 lab test",
    visitId: "V-000124",
  },
  "req-003": {
    id: "req-003",
    facility: "Divine Care Pharmacy",
    serviceType: "Pharmacy",
    patient: "Catherine",
    covered: false,
    deductionSummary: "No package used",
    visitId: "V-000125",
  },
};

/* ── Visual helpers ── */

const typeChipStyle: Record<ServiceType, string> = {
  Consultation: "bg-brand-secondary-50 text-brand-secondary-500",
  Lab: "bg-brand-warning-50 text-brand-warning-500",
  Pharmacy: "bg-brand-success-50 text-brand-success-500",
};

const facilityIcons: Record<ServiceType, typeof Stethoscope> = {
  Consultation: Stethoscope,
  Lab: FlaskConical,
  Pharmacy: Pill,
};

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function APR04ApprovedSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("id") || "req-001";
  const data = requests[requestId] ?? requests["req-001"];

  const FacilityIcon = facilityIcons[data.serviceType];

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ Scrollable content (no fixed header — success screens are self-contained) ══ */}
      <div className="flex-1 overflow-y-auto pb-[140px]">
        <div className="px-5 pt-14 flex flex-col items-center">
          {/* ────────────────────────────────────
              Success hero
          ──────────────────────────────────── */}
          <div className="w-16 h-16 rounded-full bg-brand-success-50 flex items-center justify-center mb-5">
            <CheckCircle2 size={32} className="text-brand-success-500" />
          </div>

          <h2
            className="text-[20px] text-brand-neutral-900 mb-1 text-center"
            style={{ fontWeight: 600 }}
          >
            Approved
          </h2>
          <p
            className="text-[13px] text-brand-neutral-500 text-center max-w-[260px] mb-7"
            style={{ fontWeight: 400 }}
          >
            The facility can now continue with the service.
          </p>

          {/* ────────────────────────────────────
              Details card
          ──────────────────────────────────── */}
          <div className="w-full bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 mb-3">
            {/* Row — Facility */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
                <FacilityIcon
                  size={16}
                  className="text-brand-neutral-700"
                />
              </div>
              <h3
                className="text-[14px] text-brand-neutral-900"
                style={{ fontWeight: 600 }}
              >
                {data.facility}
              </h3>
            </div>

            {/* Divider */}
            <div className="border-t border-brand-neutral-200 mb-3" />

            {/* Key-value rows */}
            <div className="space-y-2.5">
              {/* Service type */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  Service type
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${typeChipStyle[data.serviceType]}`}
                  style={{ fontWeight: 500 }}
                >
                  {data.serviceType}
                </span>
              </div>

              {/* Patient */}
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

              {/* Coverage outcome */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  Coverage
                </span>
                {data.covered ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-brand-success-50 text-brand-success-500" style={{ fontWeight: 500 }}>
                    <ShieldCheck size={10} />
                    Covered
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-brand-warning-50 text-brand-warning-500" style={{ fontWeight: 500 }}>
                    <AlertTriangle size={10} />
                    Out-of-pocket
                  </span>
                )}
              </div>

              {/* Deduction summary */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  Deduction
                </span>
                <span
                  className="text-[12px] text-brand-neutral-900"
                  style={{ fontWeight: 500 }}
                >
                  {data.deductionSummary}
                </span>
              </div>

              {/* Separator before IDs */}
              <div className="border-t border-brand-neutral-200 !mt-3 !mb-0.5" />

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
                    ABA-000183
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("ABA-000183");
                      toast.success("ABA ID copied");
                    }}
                    className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-brand-neutral-100 transition-colors"
                    aria-label="Copy ABA ID"
                  >
                    <Copy size={12} className="text-brand-neutral-400" />
                  </button>
                </div>
              </div>

              {/* Visit ID */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  Visit ID
                </span>
                <span
                  className="text-[12px] text-brand-neutral-900 font-mono"
                  style={{ fontWeight: 500 }}
                >
                  {data.visitId}
                </span>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────
              Fallback section
          ──────────────────────────────────── */}
          <div className="w-full bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 mb-8">
            <p
              className="text-[12px] text-brand-neutral-700 mb-2.5"
              style={{ fontWeight: 500 }}
            >
              If the facility needs confirmation
            </p>

            <button
              onClick={() => navigate("/apr-08?id=" + data.id)}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-brand-neutral-100 border border-brand-neutral-200 transition-colors active:bg-brand-neutral-200 mb-2"
            >
              <div className="flex items-center gap-2.5">
                <QrCode size={16} className="text-brand-neutral-700" />
                <span
                  className="text-[13px] text-brand-neutral-900"
                  style={{ fontWeight: 500 }}
                >
                  Show approval code
                </span>
              </div>
              <ChevronRight size={14} className="text-brand-neutral-400" />
            </button>

            <p
              className="text-[11px] text-brand-neutral-400 text-center"
              style={{ fontWeight: 400 }}
            >
              Use only if requested by staff.
            </p>
          </div>
        </div>
      </div>

      {/* ══ Fixed bottom CTAs ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4 space-y-2.5">
        {/* Tertiary — View in My Care */}
        <button
          onClick={() => navigate("/care-01")}
          className="w-full h-11 bg-brand-neutral-100 hover:bg-brand-neutral-200 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-2 transition-colors"
          style={{ fontWeight: 500 }}
        >
          <HeartPulse size={14} />
          View in My Care
        </button>

        <div className="flex gap-2.5">
          {/* Secondary — View my package */}
          <button
            onClick={() => navigate("/pkg-05")}
            className="flex-1 h-11 bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center transition-colors"
            style={{ fontWeight: 500 }}
          >
            View my package
          </button>

          {/* Primary — Back to Approvals */}
          <button
            onClick={() => navigate("/apr-01")}
            className="flex-1 h-11 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center transition-colors"
            style={{ fontWeight: 500 }}
          >
            Back to Approvals
          </button>
        </div>
      </div>
    </div>
  );
}