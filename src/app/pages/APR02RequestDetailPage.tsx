import { useNavigate, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth-context";
import { supabase } from "../../lib/supabase";
import {
  ArrowLeft,
  Stethoscope,
  FlaskConical,
  Pill,
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

type ServiceType = "Consultation" | "Lab" | "Pharmacy";

type ApprovalRequest = {
  id: string;
  facility_id: string;
  facility_name: string;
  facility_type: string;
  service_type: ServiceType;
  patient_name: string;
  patient_id: string | null;
  reason: string;
  covered: boolean;
  status: string;
  created_at: string;
};

type PatientOption = {
  id: string;
  name: string;
  label: string;
  type: "member" | "dependent";
};

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

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-UG", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function APR02RequestDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();
  const requestId = searchParams.get("id") ?? "";

  const [request, setRequest] = useState<ApprovalRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [memberOption, setMemberOption] = useState<PatientOption | null>(null);
  const [dependents, setDependents] = useState<PatientOption[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientOption | null>(null);
  const [showSheet, setShowSheet] = useState(false);

  useEffect(() => {
    if (!requestId) { setLoading(false); return; }

    Promise.all([
      supabase
        .from("approval_requests")
        .select("id, facility_id, facility_name, facility_type, service_type, patient_name, patient_id, reason, covered, status, created_at")
        .eq("id", requestId)
        .single(),
      supabase
        .from("users")
        .select("full_name")
        .maybeSingle(),
      supabase
        .from("dependents")
        .select("id, full_name, relationship")
        .order("created_at"),
    ]).then(([{ data: req }, { data: user }, { data: deps }]) => {
      if (req) {
        setRequest(req);
        const member: PatientOption = {
          id: "member",
          name: user?.full_name ?? profile.fullName,
          label: `${user?.full_name ?? profile.fullName} (Member)`,
          type: "member",
        };
        setMemberOption(member);

        const depOptions: PatientOption[] = (deps ?? []).map((d) => ({
          id: d.id,
          name: d.full_name,
          label: `${d.full_name} (Dependent)`,
          type: "dependent",
        }));
        setDependents(depOptions);

        // Pre-select the patient the facility named, matching by name
        const all = [member, ...depOptions];
        const match = all.find((p) =>
          req.patient_name.toLowerCase().includes(p.name.toLowerCase())
        );
        setSelectedPatient(match ?? member);
      }
      setLoading(false);
    });
  }, [requestId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-neutral-100 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-brand-primary-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!request || !selectedPatient || !memberOption) {
    return (
      <div className="min-h-screen bg-brand-neutral-100 flex items-center justify-center px-5">
        <p className="text-[13px] text-brand-neutral-500">Request not found.</p>
      </div>
    );
  }

  const FacilityIcon = facilityIcons[request.service_type] ?? Stethoscope;
  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/apr-01")}
            className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-brand-neutral-900" />
          </button>
          <h2 className="text-[17px] text-brand-neutral-900" style={{ fontWeight: 600 }}>
            Approval request
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-[72px] pb-[148px]">
        <div className="px-5 pt-4 space-y-3">
          {/* Facility card */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
                <FacilityIcon size={18} className="text-brand-neutral-700" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] text-brand-neutral-900 mb-1" style={{ fontWeight: 600 }}>
                  {request.facility_name}
                </h3>
                <p className="text-[11px] text-brand-neutral-400" style={{ fontWeight: 400 }}>
                  Requested via ABA Partner
                </p>
              </div>
            </div>
          </div>

          {/* Identity card */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Fingerprint size={14} className="text-brand-neutral-500" />
              <h4 className="text-[13px] text-brand-neutral-500" style={{ fontWeight: 500 }}>Identity</h4>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>ABA Member ID</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-brand-neutral-900" style={{ fontWeight: 500 }}>
                    {profile.memberId || "—"}
                  </span>
                  <button
                    onClick={() => { navigator.clipboard.writeText(profile.memberId || ""); toast.success("ABA ID copied"); }}
                    className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-brand-neutral-100 transition-colors"
                  >
                    <Copy size={12} className="text-brand-neutral-400" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Patient</span>
                <span className="text-[12px] text-brand-neutral-900" style={{ fontWeight: 500 }}>
                  {selectedPatient.label}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-brand-neutral-500 mt-3 pt-3 border-t border-brand-neutral-200" style={{ fontWeight: 400 }}>
              Facilities may use your ABA ID to confirm your account.
            </p>
          </div>

          {/* Patient confirmation */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-secondary-50 flex items-center justify-center shrink-0">
                  <UserCircle size={18} className="text-brand-secondary-500" />
                </div>
                <div>
                  <p className="text-[11px] text-brand-neutral-500 mb-0.5" style={{ fontWeight: 400 }}>Patient</p>
                  <p className="text-[13px] text-brand-neutral-900" style={{ fontWeight: 500 }}>
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

          {/* Request summary */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <h4 className="text-[13px] text-brand-neutral-500 mb-3" style={{ fontWeight: 500 }}>Request summary</h4>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Service type</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${typeChipStyle[request.service_type]}`} style={{ fontWeight: 500 }}>
                  {request.service_type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Patient</span>
                <span className="text-[12px] text-brand-neutral-900" style={{ fontWeight: 500 }}>{selectedPatient.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Reason</span>
                <span className="text-[12px] text-brand-neutral-700 text-right max-w-[180px]" style={{ fontWeight: 400 }}>{request.reason}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Requested at</span>
                <span className="text-[12px] text-brand-neutral-700" style={{ fontWeight: 400 }}>{formatTime(request.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Coverage assessment */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <h4 className="text-[13px] text-brand-neutral-500 mb-3" style={{ fontWeight: 500 }}>Coverage assessment</h4>
            {request.covered ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={16} className="text-brand-success-500" />
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] bg-brand-success-50 text-brand-success-500" style={{ fontWeight: 500 }}>
                    Covered
                  </span>
                </div>
                <p className="text-[12px] text-brand-neutral-700" style={{ fontWeight: 400 }}>
                  Your package will be used for this {request.service_type.toLowerCase()}.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-brand-warning-500" />
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] bg-brand-warning-50 text-brand-warning-500" style={{ fontWeight: 500 }}>
                    Out-of-pocket
                  </span>
                </div>
                <p className="text-[12px] text-brand-neutral-700" style={{ fontWeight: 400 }}>
                  No package coverage applies. You may pay at the facility.
                </p>
              </div>
            )}
          </div>

          {/* Consent note */}
          <div className="bg-brand-neutral-100 border border-brand-neutral-200 rounded-2xl px-4 py-3 flex items-start gap-2.5">
            <Info size={14} className="text-brand-neutral-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-brand-neutral-500" style={{ fontWeight: 400 }}>
              Approving confirms you consent to this service for the selected patient.
            </p>
          </div>
        </div>
      </div>

      {/* Patient switcher sheet */}
      {showSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-brand-neutral-900/40" onClick={() => setShowSheet(false)} />
          <div className="relative bg-brand-neutral-0 rounded-t-2xl px-5 pt-5 pb-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[17px] text-brand-neutral-900" style={{ fontWeight: 600 }}>Change patient</h3>
              <button onClick={() => setShowSheet(false)} className="w-8 h-8 rounded-full bg-brand-neutral-100 flex items-center justify-center">
                <X size={16} className="text-brand-neutral-500" />
              </button>
            </div>

            <p className="text-[11px] text-brand-neutral-500 mb-2" style={{ fontWeight: 500 }}>Member</p>
            <button
              onClick={() => { setSelectedPatient(memberOption); setShowSheet(false); }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl mb-3 border transition-colors ${selectedPatient.id === "member" ? "bg-brand-primary-50 border-brand-primary-300" : "bg-brand-neutral-0 border-brand-neutral-200 hover:bg-brand-neutral-100"}`}
            >
              <div className="w-9 h-9 rounded-full bg-brand-secondary-50 flex items-center justify-center shrink-0">
                <UserCircle size={18} className="text-brand-secondary-500" />
              </div>
              <span className="flex-1 text-left text-[13px] text-brand-neutral-900" style={{ fontWeight: 500 }}>{memberOption.label}</span>
              {selectedPatient.id === "member" && <Check size={16} className="text-brand-primary-500 shrink-0" />}
            </button>

            {dependents.length > 0 && (
              <>
                <p className="text-[11px] text-brand-neutral-500 mb-2" style={{ fontWeight: 500 }}>Dependents</p>
                <div className="space-y-2 mb-4">
                  {dependents.map((dep) => (
                    <button
                      key={dep.id}
                      onClick={() => { setSelectedPatient(dep); setShowSheet(false); }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${selectedPatient.id === dep.id ? "bg-brand-primary-50 border-brand-primary-300" : "bg-brand-neutral-0 border-brand-neutral-200 hover:bg-brand-neutral-100"}`}
                    >
                      <div className="w-9 h-9 rounded-full bg-brand-secondary-50 flex items-center justify-center shrink-0">
                        <UserCircle size={18} className="text-brand-secondary-500" />
                      </div>
                      <span className="flex-1 text-left text-[13px] text-brand-neutral-900" style={{ fontWeight: 500 }}>{dep.label}</span>
                      {selectedPatient.id === dep.id && <Check size={16} className="text-brand-primary-500 shrink-0" />}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="flex items-start gap-2 mt-1">
              <Info size={13} className="text-brand-neutral-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-brand-neutral-500" style={{ fontWeight: 400 }}>
                Only change if the facility selected the wrong patient.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4">
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/apr-06?id=${request.id}&facility=${encodeURIComponent(request.facility_name)}`)}
            className="flex-1 h-11 bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center transition-colors"
            style={{ fontWeight: 500 }}
          >
            Decline
          </button>
          <button
            onClick={() => navigate(`/apr-03?id=${request.id}&patient=${encodeURIComponent(selectedPatient.label)}`)}
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
