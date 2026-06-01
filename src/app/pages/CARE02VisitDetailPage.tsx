import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../lib/auth-context";
import { supabase } from "../../lib/supabase";
import {
  ArrowLeft,
  Stethoscope,
  FlaskConical,
  Pill,
  ChevronRight,
  Info,
  Receipt,
  ShieldCheck,
  AlertTriangle,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

type ServiceType = "Consultation" | "Lab" | "Pharmacy";

type ApprovalRequest = {
  id: string;
  facility_name: string;
  facility_type: string;
  service_type: ServiceType;
  patient_name: string;
  patient_id: string | null;
  covered: boolean;
  approval_code: string;
  responded_at: string;
};

const stationIcons: Record<ServiceType, typeof Stethoscope> = {
  Consultation: Stethoscope,
  Lab: FlaskConical,
  Pharmacy: Pill,
};

const stationChipStyles: Record<ServiceType, string> = {
  Consultation: "bg-brand-secondary-50 text-brand-secondary-500",
  Lab: "bg-brand-warning-50 text-brand-warning-500",
  Pharmacy: "bg-brand-success-50 text-brand-success-500",
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-UG", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function CARE02VisitDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();
  const visitId = searchParams.get("id") ?? "";

  const [visit, setVisit] = useState<ApprovalRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visitId) { setLoading(false); return; }
    supabase
      .from("approval_requests")
      .select("id, facility_name, facility_type, service_type, patient_name, patient_id, covered, approval_code, responded_at")
      .eq("id", visitId)
      .eq("status", "Approved")
      .single()
      .then(({ data }) => { setVisit(data ?? null); setLoading(false); });
  }, [visitId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-neutral-100 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-brand-primary-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="min-h-screen bg-brand-neutral-100 flex items-center justify-center px-5">
        <p className="text-[13px] text-brand-neutral-500">Visit not found.</p>
      </div>
    );
  }

  const StationIcon = stationIcons[visit.service_type] ?? Stethoscope;
  const isDependent = visit.patient_id !== null;

  const hasDocumentCta = visit.service_type === "Lab" || visit.service_type === "Pharmacy";
  const ctaLabel = visit.service_type === "Lab" ? "View results" : "View prescription";
  const ctaStation = visit.service_type === "Lab" ? "lab" : "pharmacy";

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/care-01")}
            className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-brand-neutral-900" />
          </button>
          <h2 className="text-[17px] text-brand-neutral-900" style={{ fontWeight: 600 }}>Visit details</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-[72px] pb-[140px]">
        <div className="px-5 pt-4 space-y-3">
          {/* Summary card */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <h3 className="text-[15px] text-brand-neutral-900" style={{ fontWeight: 600 }}>{visit.facility_name}</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] shrink-0 bg-brand-success-50 text-brand-success-500" style={{ fontWeight: 500 }}>
                Completed
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Facility type</span>
                <span className="text-[12px] text-brand-neutral-900" style={{ fontWeight: 500 }}>{visit.facility_type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Date &amp; time</span>
                <span className="text-[12px] text-brand-neutral-700" style={{ fontWeight: 400 }}>{formatDateTime(visit.responded_at)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Patient</span>
                {isDependent ? (
                  <button
                    onClick={() => navigate("/dep-04?id=" + visit.patient_id)}
                    className="inline-flex items-center gap-0.5 text-[12px] text-brand-primary-500"
                    style={{ fontWeight: 500 }}
                  >
                    {visit.patient_name} <ChevronRight size={13} />
                  </button>
                ) : (
                  <span className="text-[12px] text-brand-neutral-900" style={{ fontWeight: 500 }}>{visit.patient_name}</span>
                )}
              </div>

              <div className="border-t border-brand-neutral-200 !mt-2.5 !mb-1" />

              <div className="flex items-center justify-between">
                <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>ABA Member ID</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-brand-neutral-900 font-mono" style={{ fontWeight: 500 }}>
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
                <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Approval code</span>
                <span className="text-[11px] text-brand-neutral-400 font-mono" style={{ fontWeight: 400 }}>
                  {visit.approval_code}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <h4 className="text-[13px] text-brand-neutral-500 mb-4" style={{ fontWeight: 500 }}>Visit timeline</h4>
            <div className="flex gap-3.5">
              <div className="flex flex-col items-center pt-0.5">
                <div className="w-2.5 h-2.5 rounded-full shrink-0 bg-brand-success-500" />
              </div>
              <div className="flex-1 min-w-0 pb-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <StationIcon size={14} className="text-brand-neutral-700 shrink-0" />
                  <span className="text-[13px] text-brand-neutral-900" style={{ fontWeight: 600 }}>{visit.service_type}</span>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] ${stationChipStyles[visit.service_type]}`} style={{ fontWeight: 500 }}>
                    Completed
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  {visit.covered ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-brand-success-50 text-brand-success-500" style={{ fontWeight: 500 }}>
                      <ShieldCheck size={9} /> Covered
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-brand-warning-50 text-brand-warning-500" style={{ fontWeight: 500 }}>
                      <AlertTriangle size={9} /> Out-of-pocket
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-brand-neutral-500 mb-1.5" style={{ fontWeight: 400 }}>
                  {visit.covered ? "Package used for this service" : "Settled at facility"}
                </p>

                {hasDocumentCta && (
                  <button
                    onClick={() => navigate(`/care-03?visitId=${visit.id}&station=${ctaStation}`)}
                    className="inline-flex items-center gap-0.5 text-[12px] text-brand-primary-500"
                    style={{ fontWeight: 500 }}
                  >
                    {ctaLabel} <ChevronRight size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Payment summary */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <h4 className="text-[13px] text-brand-neutral-500 mb-3" style={{ fontWeight: 500 }}>Payment summary</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Covered by package</span>
                <span className="text-[13px] text-brand-neutral-900" style={{ fontWeight: 500 }}>
                  {visit.covered ? "UGX 0" : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Out-of-pocket</span>
                <span className="text-[13px] text-brand-neutral-900" style={{ fontWeight: 500 }}>
                  {visit.covered ? "UGX 0" : "Paid at facility"}
                </span>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="bg-brand-neutral-100 border border-brand-neutral-200 rounded-2xl px-4 py-3 flex items-start gap-3 mb-4">
            <Info size={14} className="text-brand-neutral-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-brand-neutral-500" style={{ fontWeight: 400 }}>
              Any out-of-pocket payments are settled at the facility.
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4">
        <button
          onClick={() => navigate("/care-04?visitId=" + visit.id)}
          className="w-full h-11 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
          style={{ fontWeight: 500 }}
        >
          <Receipt size={14} />
          View receipt
        </button>
      </div>
    </div>
  );
}
