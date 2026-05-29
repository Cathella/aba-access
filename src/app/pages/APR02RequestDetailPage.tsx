import { useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import { useAuth } from "../../lib/auth-context";
import {
  ArrowLeft,
  Stethoscope,
  FlaskConical,
  Pill,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Info,
  UserCircle,
  X,
  Check,
  Copy,
  Fingerprint,
} from "lucide-react";
import { toast } from "sonner";

/* ══════════════════════════════════════════════
   Request data keyed by id (matches APR-01 list)
   ══════════════════════════════════════════════ */

type ServiceType = "Consultation" | "Lab" | "Pharmacy";

interface RequestData {
  id: string;
  facility: string;
  facilityType: ServiceType;
  distance: string;
  serviceType: ServiceType;
  patient: string;
  reason: string;
  requestedAt: string;
  /** null → out-of-pocket (Case B) */
  coverage: {
    covered: boolean;
    deductLabel: string;
    remaining: string;
  } | null;
}

/* ══════════════════════════════════════════════
   Patient helpers
   ══════════════════════════════════════════════ */

interface PatientOption {
  id: string;
  name: string;
  label: string; // e.g. "Ben (Dependent)" or "Catherine (Member)"
  type: "member" | "dependent";
}

const MEMBER: PatientOption = {
  id: "member",
  name: "Catherine",
  label: "Catherine (Member)",
  type: "member",
};

const DEFAULT_DEPENDENTS: PatientOption[] = [
  { id: "dep-a", name: "Ben", label: "Ben (Dependent)", type: "dependent" },
  { id: "dep-b", name: "Anna", label: "Anna (Dependent)", type: "dependent" },
];

/**
 * Coverage rules (prototype):
 * • Consultation & Lab  → covered for member AND dependents
 * • Pharmacy (req-003)  → no package = out-of-pocket for everyone
 *
 * Switching patient on a Lab request (req-002) changes deduct label
 * to reflect the dependent's name, keeping it realistic.
 */
function resolveCoverage(
  serviceType: ServiceType,
  originalCoverage: RequestData["coverage"],
  _patient: PatientOption
): { covered: boolean; deductLabel: string; remaining: string } | null {
  // If original request had no coverage (out-of-pocket), stays that way
  if (!originalCoverage) return null;
  // Otherwise covered for any patient
  return { ...originalCoverage };
}

const requests: Record<string, RequestData> = {
  "req-001": {
    id: "req-001",
    facility: "Mukono Family Clinic",
    facilityType: "Consultation",
    distance: "2.4 km away",
    serviceType: "Consultation",
    patient: "Ben (Dependent)",
    reason: "Visit started at reception",
    requestedAt: "19 Feb 2026, 09:12 AM",
    coverage: {
      covered: true,
      deductLabel: "Will deduct: 1 consultation visit",
      remaining: "Remaining after approval: 5 / 6",
    },
  },
  "req-002": {
    id: "req-002",
    facility: "Sunrise Diagnostics",
    facilityType: "Lab",
    distance: "5.1 km away",
    serviceType: "Lab",
    patient: "Catherine",
    reason: "Transferred to Lab",
    requestedAt: "19 Feb 2026, 09:02 AM",
    coverage: {
      covered: true,
      deductLabel: "Will deduct: 1 lab test",
      remaining: "Remaining after approval: 2 / 3",
    },
  },
  "req-003": {
    id: "req-003",
    facility: "Divine Care Pharmacy",
    facilityType: "Pharmacy",
    distance: "0.8 km away",
    serviceType: "Pharmacy",
    patient: "Catherine",
    reason: "Prescription submitted at counter",
    requestedAt: "19 Feb 2026, 08:24 AM",
    coverage: null, // Case B — out-of-pocket
  },
};

/* ── Icon + chip helpers ── */

const facilityIcons: Record<ServiceType, typeof Stethoscope> = {
  Consultation: Stethoscope,
  Lab: FlaskConical,
  Pharmacy: Pill,
};

const typeChipStyle: Record<ServiceType, string> = {
  Consultation: "bg-brand-secondary-50 text-brand-secondary-500",
  Lab: "bg-brand-warning-50 text-brand-warning-500",
  Pharmacy: "bg-brand-success-50 text-brand-success-500",
};

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function APR02RequestDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();
  const requestId = searchParams.get("id") || "req-001";
  const data = requests[requestId] ?? requests["req-001"];

  const FacilityIcon = facilityIcons[data.facilityType];

  /* ── Patient state ── */
  const initialPatient: PatientOption =
    data.patient.includes("Ben")
      ? DEFAULT_DEPENDENTS[0]
      : data.patient.includes("Anna")
        ? DEFAULT_DEPENDENTS[1]
        : MEMBER;

  const [selectedPatient, setSelectedPatient] =
    useState<PatientOption>(initialPatient);
  const [showSheet, setShowSheet] = useState(false);

  /* Read dependents list from sessionStorage (synced by DEP-01) */
  const [dependents] =
    useState<PatientOption[]>(DEFAULT_DEPENDENTS);

  /* ── Derived coverage ── */
  const activeCoverage = resolveCoverage(
    data.serviceType,
    data.coverage,
    selectedPatient
  );
  const isCovered = activeCoverage?.covered === true;

  /* ── Sheet helpers ── */
  const patientOptions: PatientOption[] = [MEMBER, ...dependents];

  const selectPatient = (p: PatientOption) => {
    setSelectedPatient(p);
    setShowSheet(false);
  };

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ App Bar (fixed) ══ */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/apr-01")}
            className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-brand-neutral-900" />
          </button>
          <h2
            className="text-[17px] text-brand-neutral-900"
            style={{ fontWeight: 600 }}
          >
            Approval request
          </h2>
        </div>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[148px]">
        <div className="px-5 pt-4 space-y-3">
          {/* ────────────────────────────────────────
              Card 1 — Facility
          ──────────────────────────────────────── */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
                <FacilityIcon size={18} className="text-brand-neutral-700" />
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className="text-[15px] text-brand-neutral-900 mb-0.5"
                  style={{ fontWeight: 600 }}
                >
                  {data.facility}
                </h3>

                <div className="flex items-center gap-1 mb-2">
                  <MapPin size={11} className="text-brand-neutral-400" />
                  <span
                    className="text-[11px] text-brand-neutral-500"
                    style={{ fontWeight: 400 }}
                  >
                    {data.distance}
                  </span>
                </div>

                <p
                  className="text-[11px] text-brand-neutral-400"
                  style={{ fontWeight: 400 }}
                >
                  Requested via ABA Partner
                </p>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────
              Card 1a — Identity mapping
          ──────────────────────────────────────── */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Fingerprint size={14} className="text-brand-neutral-500" />
              <h4
                className="text-[13px] text-brand-neutral-500"
                style={{ fontWeight: 500 }}
              >
                Identity
              </h4>
            </div>

            <div className="space-y-2.5">
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
                    className="text-[12px] text-brand-neutral-900"
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

              {/* Patient row (always shown) */}
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
                  {selectedPatient.label}
                </span>
              </div>

              {/* Dependent ID (shown only for dependents) */}
              {selectedPatient.type === "dependent" && (
                <div className="flex items-center justify-between">
                  <span
                    className="text-[12px] text-brand-neutral-500"
                    style={{ fontWeight: 400 }}
                  >
                    Dependent ID
                  </span>
                  <span
                    className="text-[12px] text-brand-neutral-700"
                    style={{ fontWeight: 400 }}
                  >
                    DEP-00041
                  </span>
                </div>
              )}
            </div>

            {/* Helper note */}
            <p
              className="text-[11px] text-brand-neutral-500 mt-3 pt-3 border-t border-brand-neutral-200"
              style={{ fontWeight: 400 }}
            >
              Facilities may use your ABA ID to confirm your account.
            </p>
          </div>

          {/* ────────────────────────────────────────
              Card 1b — Patient confirmation
          ──────────────────────────────────────── */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-secondary-50 flex items-center justify-center shrink-0">
                  <UserCircle size={18} className="text-brand-secondary-500" />
                </div>
                <div>
                  <p
                    className="text-[11px] text-brand-neutral-500 mb-0.5"
                    style={{ fontWeight: 400 }}
                  >
                    Patient
                  </p>
                  <p
                    className="text-[13px] text-brand-neutral-900"
                    style={{ fontWeight: 500 }}
                  >
                    {selectedPatient.label}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSheet(true)}
                className="text-[12px] text-brand-primary-500 hover:text-brand-primary-600 transition-colors"
                style={{ fontWeight: 500 }}
              >
                Change
              </button>
            </div>
          </div>

          {/* ────────────────────────────────────────
              Card 2 — Request summary
          ──────────────────────────────────────── */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <h4
              className="text-[13px] text-brand-neutral-500 mb-3"
              style={{ fontWeight: 500 }}
            >
              Request summary
            </h4>

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
                  {selectedPatient.label}
                </span>
              </div>

              {/* Reason */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  Reason
                </span>
                <span
                  className="text-[12px] text-brand-neutral-700 text-right max-w-[180px]"
                  style={{ fontWeight: 400 }}
                >
                  {data.reason}
                </span>
              </div>

              {/* Requested at */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  Requested at
                </span>
                <span
                  className="text-[12px] text-brand-neutral-700"
                  style={{ fontWeight: 400 }}
                >
                  {data.requestedAt}
                </span>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────
              Card 3 — Coverage assessment
          ──────────────────────────────────────── */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <h4
              className="text-[13px] text-brand-neutral-500 mb-3"
              style={{ fontWeight: 500 }}
            >
              Coverage assessment
            </h4>

            {isCovered ? (
              /* ── Case A: Covered ── */
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck size={16} className="text-brand-success-500" />
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] bg-brand-success-50 text-brand-success-500"
                    style={{ fontWeight: 500 }}
                  >
                    Covered
                  </span>
                </div>

                <div className="space-y-1.5">
                  <p
                    className="text-[12px] text-brand-neutral-700"
                    style={{ fontWeight: 400 }}
                  >
                    {activeCoverage!.deductLabel}
                  </p>
                  <p
                    className="text-[12px] text-brand-neutral-500"
                    style={{ fontWeight: 400 }}
                  >
                    {activeCoverage!.remaining}
                  </p>
                </div>
              </div>
            ) : (
              /* ── Case B: Out-of-pocket ── */
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle
                    size={16}
                    className="text-brand-warning-500"
                  />
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] bg-brand-warning-50 text-brand-warning-500"
                    style={{ fontWeight: 500 }}
                  >
                    Out-of-pocket
                  </span>
                </div>

                <div className="space-y-1.5">
                  <p
                    className="text-[12px] text-brand-neutral-700"
                    style={{ fontWeight: 400 }}
                  >
                    You don't have a package for this service.
                  </p>
                  <p
                    className="text-[12px] text-brand-neutral-500"
                    style={{ fontWeight: 400 }}
                  >
                    You may pay at the facility.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ────────────────────────────────────────
              Card 4 — Consent note
          ──────────────────────────────────────── */}
          <div className="bg-brand-neutral-100 border border-brand-neutral-200 rounded-2xl px-4 py-3 flex items-start gap-2.5">
            <Info
              size={14}
              className="text-brand-neutral-400 shrink-0 mt-0.5"
            />
            <p
              className="text-[11px] text-brand-neutral-500"
              style={{ fontWeight: 400 }}
            >
              Approving confirms you consent to this service for the selected
              patient.
            </p>
          </div>
        </div>
      </div>

      {/* ══ Bottom sheet — Change patient ══ */}
      {showSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Scrim */}
          <div
            className="absolute inset-0 bg-brand-neutral-900/40"
            onClick={() => setShowSheet(false)}
          />

          {/* Sheet */}
          <div className="relative bg-brand-neutral-0 rounded-t-2xl px-5 pt-5 pb-6 max-h-[70vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-[17px] text-brand-neutral-900"
                style={{ fontWeight: 600 }}
              >
                Change patient
              </h3>
              <button
                onClick={() => setShowSheet(false)}
                className="w-8 h-8 rounded-full bg-brand-neutral-100 flex items-center justify-center"
              >
                <X size={16} className="text-brand-neutral-500" />
              </button>
            </div>

            {/* Member section */}
            <p
              className="text-[11px] text-brand-neutral-500 mb-2"
              style={{ fontWeight: 500 }}
            >
              Member
            </p>
            <button
              onClick={() => selectPatient(MEMBER)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl mb-3 border transition-colors ${
                selectedPatient.id === MEMBER.id
                  ? "bg-brand-primary-50 border-brand-primary-300"
                  : "bg-brand-neutral-0 border-brand-neutral-200 hover:bg-brand-neutral-100"
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-brand-secondary-50 flex items-center justify-center shrink-0">
                <UserCircle size={18} className="text-brand-secondary-500" />
              </div>
              <span
                className="flex-1 text-left text-[13px] text-brand-neutral-900"
                style={{ fontWeight: 500 }}
              >
                {MEMBER.label}
              </span>
              {selectedPatient.id === MEMBER.id && (
                <Check size={16} className="text-brand-primary-500 shrink-0" />
              )}
            </button>

            {/* Dependents section */}
            {dependents.length > 0 && (
              <>
                <p
                  className="text-[11px] text-brand-neutral-500 mb-2"
                  style={{ fontWeight: 500 }}
                >
                  Dependents
                </p>
                <div className="space-y-2 mb-4">
                  {dependents.map((dep) => (
                    <button
                      key={dep.id}
                      onClick={() => selectPatient(dep)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                        selectedPatient.id === dep.id
                          ? "bg-brand-primary-50 border-brand-primary-300"
                          : "bg-brand-neutral-0 border-brand-neutral-200 hover:bg-brand-neutral-100"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-brand-secondary-50 flex items-center justify-center shrink-0">
                        <UserCircle
                          size={18}
                          className="text-brand-secondary-500"
                        />
                      </div>
                      <span
                        className="flex-1 text-left text-[13px] text-brand-neutral-900"
                        style={{ fontWeight: 500 }}
                      >
                        {dep.label}
                      </span>
                      {selectedPatient.id === dep.id && (
                        <Check
                          size={16}
                          className="text-brand-primary-500 shrink-0"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Caption note */}
            <div className="flex items-start gap-2 mt-1">
              <Info
                size={13}
                className="text-brand-neutral-400 shrink-0 mt-0.5"
              />
              <p
                className="text-[11px] text-brand-neutral-500"
                style={{ fontWeight: 400 }}
              >
                Only change if the facility selected the wrong patient.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══ Sticky bottom action bar ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4">
        <div className="flex gap-3">
          {/* Secondary — Decline */}
          <button
            onClick={() => navigate("/apr-06?id=" + data.id)}
            className="flex-1 h-11 bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center transition-colors"
            style={{ fontWeight: 500 }}
          >
            Decline
          </button>

          {/* Primary — Approve with PIN */}
          <button
            onClick={() => navigate("/apr-03?id=" + data.id)}
            className="flex-1 h-11 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center transition-colors"
            style={{ fontWeight: 500 }}
          >
            Approve with PIN
          </button>
        </div>
      </div>
    </div>
  );
}