import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../lib/auth-context";
import { supabase } from "../../lib/supabase";
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

type ServiceType = "Consultation" | "Lab" | "Pharmacy";

type ApprovalRequest = {
  id: string;
  facility_name: string;
  service_type: ServiceType;
  patient_name: string;
  covered: boolean;
  approval_code: string;
};

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

export function APR04ApprovedSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();
  const requestId = searchParams.get("id") ?? "";

  const [request, setRequest] = useState<ApprovalRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requestId) { setLoading(false); return; }
    supabase
      .from("approval_requests")
      .select("id, facility_name, service_type, patient_name, covered, approval_code")
      .eq("id", requestId)
      .single()
      .then(({ data }) => { setRequest(data ?? null); setLoading(false); });
  }, [requestId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-neutral-100 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-brand-primary-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-brand-neutral-100 flex items-center justify-center px-5">
        <p className="text-[13px] text-brand-neutral-500">Request not found.</p>
      </div>
    );
  }

  const FacilityIcon = facilityIcons[request.service_type] ?? Stethoscope;

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      <div className="flex-1 overflow-y-auto pb-[140px]">
        <div className="px-5 pt-14 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-brand-success-50 flex items-center justify-center mb-5">
            <CheckCircle2 size={32} className="text-brand-success-500" />
          </div>
          <h2 className="text-[20px] text-brand-neutral-900 mb-1 text-center" style={{ fontWeight: 600 }}>Approved</h2>
          <p className="text-[13px] text-brand-neutral-500 text-center max-w-[260px] mb-7" style={{ fontWeight: 400 }}>
            The facility can now continue with the service.
          </p>

          {/* Details card */}
          <div className="w-full bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 mb-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
                <FacilityIcon size={16} className="text-brand-neutral-700" />
              </div>
              <h3 className="text-[14px] text-brand-neutral-900" style={{ fontWeight: 600 }}>{request.facility_name}</h3>
            </div>

            <div className="border-t border-brand-neutral-200 mb-3" />

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Service type</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${typeChipStyle[request.service_type]}`} style={{ fontWeight: 500 }}>
                  {request.service_type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Patient</span>
                <span className="text-[12px] text-brand-neutral-900" style={{ fontWeight: 500 }}>{request.patient_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Coverage</span>
                {request.covered ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-brand-success-50 text-brand-success-500" style={{ fontWeight: 500 }}>
                    <ShieldCheck size={10} /> Covered
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-brand-warning-50 text-brand-warning-500" style={{ fontWeight: 500 }}>
                    <AlertTriangle size={10} /> Out-of-pocket
                  </span>
                )}
              </div>

              <div className="border-t border-brand-neutral-200 !mt-3 !mb-0.5" />

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
                <span className="text-[12px] text-brand-neutral-900 font-mono" style={{ fontWeight: 500 }}>
                  {request.approval_code}
                </span>
              </div>
            </div>
          </div>

          {/* Fallback section */}
          <div className="w-full bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 mb-8">
            <p className="text-[12px] text-brand-neutral-700 mb-2.5" style={{ fontWeight: 500 }}>
              If the facility needs confirmation
            </p>
            <button
              onClick={() => navigate(`/apr-08?id=${request.id}`)}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-brand-neutral-100 border border-brand-neutral-200 transition-colors active:bg-brand-neutral-200 mb-2"
            >
              <div className="flex items-center gap-2.5">
                <QrCode size={16} className="text-brand-neutral-700" />
                <span className="text-[13px] text-brand-neutral-900" style={{ fontWeight: 500 }}>Show approval code</span>
              </div>
              <ChevronRight size={14} className="text-brand-neutral-400" />
            </button>
            <p className="text-[11px] text-brand-neutral-400 text-center" style={{ fontWeight: 400 }}>
              Use only if requested by staff.
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4 space-y-2.5">
        <button
          onClick={() => navigate("/care-01")}
          className="w-full h-11 bg-brand-neutral-100 hover:bg-brand-neutral-200 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-2 transition-colors"
          style={{ fontWeight: 500 }}
        >
          <HeartPulse size={14} />
          View in My Care
        </button>
        <div className="flex gap-2.5">
          <button
            onClick={() => navigate("/pkg-05")}
            className="flex-1 h-11 bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center transition-colors"
            style={{ fontWeight: 500 }}
          >
            View my package
          </button>
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
