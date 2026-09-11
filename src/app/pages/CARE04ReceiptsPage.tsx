import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../lib/auth-context";
import { supabase } from "../../lib/supabase";
import { ArrowLeft, ShieldCheck, AlertTriangle, Info, Copy } from "lucide-react";
import { toast } from "sonner";

type ServiceType = "Consultation" | "Lab" | "Pharmacy";

type ApprovalRequest = {
  id: string;
  facility_name: string;
  service_type: ServiceType;
  patient_name: string;
  covered: boolean;
  approval_code: string;
  responded_at: string;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-UG", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export function CARE04ReceiptsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();
  const visitId = searchParams.get("visitId") ?? "";

  const [visit, setVisit] = useState<ApprovalRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visitId) { setLoading(false); return; }
    supabase
      .from("approval_requests")
      .select("id, facility_name, service_type, patient_name, covered, approval_code, responded_at")
      .eq("id", visitId)
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
        <p className="text-[13px] text-brand-neutral-500">Receipt not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/care-02?id=" + visitId)}
            className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-brand-neutral-900" />
          </button>
          <h2 className="text-[17px] text-brand-neutral-900" style={{ fontWeight: 600 }}>Receipt</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-[72px] pb-6">
        <div className="px-5 pt-4 space-y-3">
          {/* Receipt summary */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <h3 className="text-[15px] text-brand-neutral-900 mb-2.5" style={{ fontWeight: 600 }}>
              {visit.facility_name}
            </h3>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Date</span>
                <span className="text-[12px] text-brand-neutral-700" style={{ fontWeight: 400 }}>{formatDate(visit.responded_at)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Patient</span>
                <span className="text-[12px] text-brand-neutral-900" style={{ fontWeight: 500 }}>{visit.patient_name}</span>
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
                <span className="text-[11px] text-brand-neutral-700 font-mono" style={{ fontWeight: 400 }}>{visit.approval_code}</span>
              </div>
            </div>
          </div>

          {/* Coverage breakdown */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              {visit.covered ? (
                <ShieldCheck size={14} className="text-brand-success-500" />
              ) : (
                <AlertTriangle size={14} className="text-brand-warning-500" />
              )}
              <h4 className="text-[13px] text-brand-neutral-900" style={{ fontWeight: 600 }}>
                {visit.covered ? "Package covered" : "Out-of-pocket"}
              </h4>
            </div>

            <div className="py-3 border-b border-brand-neutral-200">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-brand-neutral-900" style={{ fontWeight: 500 }}>{visit.service_type}</p>
                  <p className="text-[11px] text-brand-neutral-500 mt-0.5" style={{ fontWeight: 400 }}>
                    {visit.covered ? "Covered by package" : "Paid at facility"}
                  </p>
                </div>
                <span className="text-[13px] text-brand-neutral-900 shrink-0 ml-3" style={{ fontWeight: 500 }}>
                  {visit.covered ? "Included" : "Settled"}
                </span>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <span className="text-[13px] text-brand-neutral-900" style={{ fontWeight: 600 }}>Total out-of-pocket</span>
              <span className="text-[13px] text-brand-neutral-900" style={{ fontWeight: 600 }}>
                {visit.covered ? "UGX 0" : "Paid at facility"}
              </span>
            </div>
          </div>

          {/* Info note */}
          <div className="bg-brand-neutral-100 border border-brand-neutral-200 rounded-2xl px-4 py-3 flex items-start gap-2.5 mb-4">
            <Info size={14} className="text-brand-neutral-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-brand-neutral-500" style={{ fontWeight: 400 }}>
              Out-of-pocket payments are settled directly at the facility. Detailed billing will be available in a future update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
