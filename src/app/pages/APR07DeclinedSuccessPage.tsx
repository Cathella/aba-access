import { useNavigate, useSearchParams } from "react-router";
import { Ban, Info } from "lucide-react";

export function APR07DeclinedSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const facilityName = searchParams.get("facility") ?? "the facility";
  const reason = searchParams.get("reason");

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      <div className="flex-1 overflow-y-auto pb-[80px] flex items-center justify-center">
        <div className="px-5 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-brand-neutral-200 flex items-center justify-center mb-5">
            <Ban size={30} className="text-brand-neutral-500" />
          </div>

          <h2 className="text-[20px] text-brand-neutral-900 mb-1 text-center" style={{ fontWeight: 600 }}>Declined</h2>
          <p className="text-[13px] text-brand-neutral-500 text-center max-w-[260px] mb-7" style={{ fontWeight: 400 }}>
            You declined the request. If needed, contact the facility.
          </p>

          <div className="w-full bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 mb-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Facility</span>
              <span className="text-[12px] text-brand-neutral-900" style={{ fontWeight: 500 }}>{facilityName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Status</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-brand-neutral-200 text-brand-neutral-700" style={{ fontWeight: 500 }}>
                Declined
              </span>
            </div>
            {reason && (
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Reason</span>
                <span className="text-[12px] text-brand-neutral-900 text-right max-w-[180px]" style={{ fontWeight: 500 }}>{reason}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Declined at</span>
              <span className="text-[12px] text-brand-neutral-700" style={{ fontWeight: 400 }}>
                {new Date().toLocaleString("en-UG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>

          <div className="w-full bg-brand-neutral-100 border border-brand-neutral-200 rounded-2xl px-4 py-3 flex items-start gap-2.5 mb-8">
            <Info size={14} className="text-brand-neutral-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-brand-neutral-500" style={{ fontWeight: 400 }}>
              This decision has been logged. The facility has been notified that no package coverage will be applied.
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4">
        <button
          onClick={() => navigate("/apr-01")}
          className="w-full h-11 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center transition-colors"
          style={{ fontWeight: 500 }}
        >
          Back to Approvals
        </button>
      </div>
    </div>
  );
}
