import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../lib/auth-context";
import {
  ArrowLeft,
  Stethoscope,
  FlaskConical,
  Pill,
  ChevronRight,
  Info,
  Receipt,
  Copy,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

/* ══════════════════════════════════════════════
   Data types
   ══════════════════════════════════════════════ */

type StationType = "Consultation" | "Lab" | "Pharmacy";

interface TimelineStation {
  type: StationType;
  status: "Completed" | "In progress";
  coverageLabel: string;
  appliedPackage: string;
  note: string;
  cta: { label: string; route: string } | null;
}

interface VisitData {
  id: string;
  visitCode: string;
  facility: string;
  facilityType: string;
  dateTime: string;
  patient: string;
  overallStatus: "Completed" | "In progress";
  timeline: TimelineStation[];
  payment: {
    covered: string;
    discountSavings?: string;
    outOfPocket: string;
    oopMethod?: "aba-wallet" | "facility";
    oopTxRef?: string;
  };
}

/* ══════════════════════════════════════════════
   Sample visit records
   ══════════════════════════════════════════════ */

const visits: Record<string, VisitData> = {
  "visit-001": {
    id: "visit-001",
    visitCode: "V-000123",
    facility: "Mukono Family Clinic",
    facilityType: "Clinic",
    dateTime: "19 Feb 2026, 09:15 AM",
    patient: "Ben (Dependent)",
    overallStatus: "Completed",
    timeline: [
      {
        type: "Consultation",
        status: "Completed",
        coverageLabel: "Covered",
        appliedPackage: "Consultation Only",
        note: "1 visit deducted",
        cta: null,
      },
      {
        type: "Lab",
        status: "Completed",
        coverageLabel: "Covered",
        appliedPackage: "Care Bundle",
        note: "1 test deducted",
        cta: { label: "View results", route: "/care-03" },
      },
      {
        type: "Pharmacy",
        status: "Completed",
        coverageLabel: "Discount applied",
        appliedPackage: "Care Bundle",
        note: "UGX 3,500 discount applied",
        cta: { label: "View prescription", route: "/care-03" },
      },
    ],
    payment: {
      covered: "UGX 0",
      discountSavings: "UGX 3,500",
      outOfPocket: "UGX 15,000",
      oopMethod: "aba-wallet",
      oopTxRef: "TX-00074",
    },
  },
  "visit-002": {
    id: "visit-002",
    visitCode: "V-000124",
    facility: "Sunrise Diagnostics",
    facilityType: "Lab",
    dateTime: "18 Feb 2026, 11:30 AM",
    patient: "Catherine",
    overallStatus: "Completed",
    timeline: [
      {
        type: "Lab",
        status: "Completed",
        coverageLabel: "Covered",
        appliedPackage: "Care Bundle",
        note: "1 test deducted",
        cta: { label: "View results", route: "/care-03" },
      },
    ],
    payment: {
      covered: "UGX 0",
      outOfPocket: "UGX 0",
    },
  },
  "visit-003": {
    id: "visit-003",
    visitCode: "V-000125",
    facility: "Divine Care Pharmacy",
    facilityType: "Pharmacy",
    dateTime: "12 Feb 2026, 02:45 PM",
    patient: "Catherine",
    overallStatus: "Completed",
    timeline: [
      {
        type: "Pharmacy",
        status: "Completed",
        coverageLabel: "Discount applied",
        appliedPackage: "Care Bundle",
        note: "UGX 3,500 discount applied",
        cta: { label: "View prescription", route: "/care-03" },
      },
    ],
    payment: {
      covered: "UGX 0",
      discountSavings: "UGX 3,500",
      outOfPocket: "UGX 15,000",
      oopMethod: "facility",
    },
  },
};

/* ══════════════════════════════════════════════
   Style helpers
   ══════════════════════════════════════════════ */

const stationIcons: Record<StationType, typeof Stethoscope> = {
  Consultation: Stethoscope,
  Lab: FlaskConical,
  Pharmacy: Pill,
};

const stationChipStyles: Record<StationType, string> = {
  Consultation: "bg-brand-secondary-50 text-brand-secondary-500",
  Lab: "bg-brand-warning-50 text-brand-warning-500",
  Pharmacy: "bg-brand-success-50 text-brand-success-500",
};

const coverageChipStyles: Record<string, string> = {
  Covered: "bg-brand-success-50 text-brand-success-500",
  "Discount applied": "bg-brand-primary-50 text-brand-primary-500",
};

const statusDotColor: Record<string, string> = {
  Completed: "bg-brand-success-500",
  "In progress": "bg-brand-warning-500",
};

/* Map patient display names → dependent IDs for DEP-04 routing */
const patientToDepId: Record<string, string> = {
  "Ben (Dependent)": "dep-a",
  "Anna (Dependent)": "dep-b",
};

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function CARE02VisitDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();
  const visitId = searchParams.get("id") || "visit-001";
  const data = visits[visitId] ?? visits["visit-001"];

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ App Bar (fixed) ══ */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/care-01")}
            className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-brand-neutral-900" />
          </button>
          <h2
            className="text-[17px] text-brand-neutral-900"
            style={{ fontWeight: 600 }}
          >
            Visit details
          </h2>
        </div>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[140px]">
        <div className="px-5 pt-4 space-y-3">
          {/* ──────────────────────────────────────
              Top summary card
          ────────────────────────────────────── */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            {/* Row 1 — Facility + Status */}
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <h3
                className="text-[15px] text-brand-neutral-900"
                style={{ fontWeight: 600 }}
              >
                {data.facility}
              </h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] shrink-0 ${
                  data.overallStatus === "Completed"
                    ? "bg-brand-success-50 text-brand-success-500"
                    : "bg-brand-warning-50 text-brand-warning-500"
                }`}
                style={{ fontWeight: 500 }}
              >
                {data.overallStatus}
              </span>
            </div>

            {/* Detail rows */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  Facility type
                </span>
                <span
                  className="text-[12px] text-brand-neutral-900"
                  style={{ fontWeight: 500 }}
                >
                  {data.facilityType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  Date &amp; time
                </span>
                <span
                  className="text-[12px] text-brand-neutral-700"
                  style={{ fontWeight: 400 }}
                >
                  {data.dateTime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  Patient
                </span>
                {patientToDepId[data.patient] ? (
                  <button
                    onClick={() =>
                      navigate("/dep-04?id=" + patientToDepId[data.patient])
                    }
                    className="inline-flex items-center gap-0.5 text-[12px] text-brand-primary-500"
                    style={{ fontWeight: 500 }}
                  >
                    {data.patient}
                    <ChevronRight size={13} />
                  </button>
                ) : (
                  <span
                    className="text-[12px] text-brand-neutral-900"
                    style={{ fontWeight: 500 }}
                  >
                    {data.patient}
                  </span>
                )}
              </div>

              {/* Dependent ID (only when patient is a dependent) */}
              {patientToDepId[data.patient] && (
                <div className="flex items-center justify-between">
                  <span
                    className="text-[12px] text-brand-neutral-500"
                    style={{ fontWeight: 400 }}
                  >
                    Dependent ID
                  </span>
                  <span
                    className="text-[11px] text-brand-neutral-700 font-mono"
                    style={{ fontWeight: 400 }}
                  >
                    DEP-00041
                  </span>
                </div>
              )}

              {/* Separator before IDs */}
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

              <div className="flex items-center justify-between">
                <span
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  Visit ID
                </span>
                <span
                  className="text-[11px] text-brand-neutral-400"
                  style={{ fontWeight: 400 }}
                >
                  {data.visitCode}
                </span>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────
              Timeline section
          ────────────────────────────────────── */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <h4
              className="text-[13px] text-brand-neutral-500 mb-4"
              style={{ fontWeight: 500 }}
            >
              Visit timeline
            </h4>

            <div className="relative">
              {data.timeline.map((station, idx) => {
                const isLast = idx === data.timeline.length - 1;
                const StationIcon = stationIcons[station.type];

                return (
                  <div key={station.type + "-" + idx} className="relative flex gap-3.5">
                    {/* ── Dot + Line column ── */}
                    <div className="flex flex-col items-center pt-0.5">
                      {/* Dot */}
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          statusDotColor[station.status] || "bg-brand-neutral-300"
                        }`}
                      />
                      {/* Line */}
                      {!isLast && (
                        <div className="w-px flex-1 bg-brand-neutral-200 mt-1" />
                      )}
                    </div>

                    {/* ── Station content ── */}
                    <div className={`flex-1 min-w-0 ${isLast ? "pb-0" : "pb-5"}`}>
                      {/* Station header row */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <StationIcon
                          size={14}
                          className="text-brand-neutral-700 shrink-0"
                        />
                        <span
                          className="text-[13px] text-brand-neutral-900"
                          style={{ fontWeight: 600 }}
                        >
                          {station.type}
                        </span>
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] ${stationChipStyles[station.type]}`}
                          style={{ fontWeight: 500 }}
                        >
                          {station.status}
                        </span>
                      </div>

                      {/* Coverage chip */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${
                            coverageChipStyles[station.coverageLabel] ||
                            "bg-brand-neutral-100 text-brand-neutral-500"
                          }`}
                          style={{ fontWeight: 500 }}
                        >
                          {station.coverageLabel}
                        </span>
                      </div>

                      {/* Applied package */}
                      <p
                        className="text-[11px] text-brand-neutral-500 mb-0.5"
                        style={{ fontWeight: 400 }}
                      >
                        Package:{" "}
                        <span style={{ fontWeight: 500 }}>
                          {station.appliedPackage}
                        </span>
                      </p>

                      {/* Note */}
                      <p
                        className="text-[11px] text-brand-neutral-500 mb-1.5"
                        style={{ fontWeight: 400 }}
                      >
                        {station.note}
                      </p>

                      {/* Optional CTA */}
                      {station.cta && (
                        <button
                          onClick={() =>
                            navigate(
                              station.cta!.route +
                                "?visitId=" +
                                data.id +
                                "&station=" +
                                station.type.toLowerCase()
                            )
                          }
                          className="inline-flex items-center gap-0.5 text-[12px] text-brand-primary-500"
                          style={{ fontWeight: 500 }}
                        >
                          {station.cta.label}
                          <ChevronRight size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ──────────────────────────────────────
              Payment summary card
          ────────────────────────────────────── */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <h4
              className="text-[13px] text-brand-neutral-500 mb-3"
              style={{ fontWeight: 500 }}
            >
              Payment summary
            </h4>

            <div className="space-y-2">
              {/* Covered by package */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  Covered by package
                </span>
                <span
                  className="text-[13px] text-brand-neutral-900"
                  style={{ fontWeight: 500 }}
                >
                  {data.payment.covered}
                </span>
              </div>

              {/* Discount savings (conditional) */}
              {data.payment.discountSavings && (
                <div className="flex items-center justify-between">
                  <span
                    className="text-[12px] text-brand-neutral-500"
                    style={{ fontWeight: 400 }}
                  >
                    Discount savings
                  </span>
                  <span
                    className="text-[13px] text-brand-success-500"
                    style={{ fontWeight: 500 }}
                  >
                    {data.payment.discountSavings}
                  </span>
                </div>
              )}

              {/* Out-of-pocket */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  Out-of-pocket
                </span>
                <span
                  className="text-[13px] text-brand-neutral-900"
                  style={{ fontWeight: 500 }}
                >
                  {data.payment.outOfPocket}
                </span>
              </div>

              {/* Payment method caption */}
              {data.payment.outOfPocket !== "UGX 0" && data.payment.oopMethod && (
                <p
                  className="text-[11px] text-brand-neutral-500 !mt-1"
                  style={{ fontWeight: 400 }}
                >
                  {data.payment.oopMethod === "aba-wallet"
                    ? `Paid via Aba Wallet \u2022 ${data.payment.oopTxRef}`
                    : "Paid at facility"}
                </p>
              )}
            </div>

            {/* View transaction link (wallet only) */}
            {data.payment.oopMethod === "aba-wallet" &&
              data.payment.oopTxRef &&
              data.payment.outOfPocket !== "UGX 0" && (
                <div className="mt-3 pt-3 border-t border-brand-neutral-200 flex items-center justify-end">
                  <button
                    onClick={() =>
                      navigate(`/wal-04/${data.payment.oopTxRef}`)
                    }
                    className="inline-flex items-center gap-1 text-[12px] text-brand-primary-500 hover:text-brand-primary-400 transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    <Wallet size={12} />
                    View transaction
                    <ChevronRight size={12} />
                  </button>
                </div>
              )}
          </div>

          {/* ──────────────────────────────────────
              Notes card
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
              Any out-of-pocket payments are settled at the facility.
            </p>
          </div>
        </div>
      </div>

      {/* ══ Fixed bottom CTA ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4">
        <button
          onClick={() => navigate("/care-04?visitId=" + data.id)}
          className="w-full h-11 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
          style={{ fontWeight: 500 }}
        >
          <Receipt size={14} />
          View receipt
        </button>

        {/* Secondary link — wallet history */}
        {data.payment.oopMethod === "aba-wallet" && (
          <button
            onClick={() => navigate("/wal-03")}
            className="w-full mt-2.5 flex items-center justify-center gap-1 text-[12px] text-brand-primary-500 hover:text-brand-primary-400 transition-colors min-h-[44px]"
            style={{ fontWeight: 500 }}
          >
            <Wallet size={13} />
            View wallet history
            <ChevronRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}