import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, FileText, Clock, Pill, Info } from "lucide-react";

export function CARE03DocumentsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const visitId = searchParams.get("visitId") ?? "";
  const station = searchParams.get("station") ?? "lab";

  const isLab = station === "lab";

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
          <h2 className="text-[17px] text-brand-neutral-900" style={{ fontWeight: 600 }}>Documents</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-[72px] pb-6">
        <div className="px-5 pt-4 space-y-3">
          {/* Lab results section */}
          {isLab && (
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[13px] text-brand-neutral-900" style={{ fontWeight: 600 }}>Lab results</h4>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-brand-warning-50 text-brand-warning-500" style={{ fontWeight: 500 }}>
                  Pending
                </span>
              </div>
              <div className="flex items-center gap-2.5 bg-brand-neutral-100 rounded-xl p-3">
                <Clock size={14} className="text-brand-warning-500 shrink-0" />
                <p className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>
                  Results will appear once uploaded by the facility.
                </p>
              </div>
            </div>
          )}

          {/* Prescription section */}
          {!isLab && (
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
              <h4 className="text-[13px] text-brand-neutral-900 mb-3" style={{ fontWeight: 600 }}>Prescription</h4>
              <div className="flex items-center gap-2.5 bg-brand-neutral-100 rounded-xl p-3">
                <Pill size={14} className="text-brand-neutral-400 shrink-0" />
                <p className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>
                  Prescription details will appear once uploaded by the facility.
                </p>
              </div>
            </div>
          )}

          {/* What to expect */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={14} className="text-brand-neutral-500" />
              <h4 className="text-[13px] text-brand-neutral-900" style={{ fontWeight: 600 }}>What to expect</h4>
            </div>
            <p className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400, lineHeight: "18px" }}>
              {isLab
                ? "Your lab results are typically uploaded by the facility within 24–48 hours. You will be able to view and download them here once available."
                : "Your prescription details are uploaded by the facility after your visit. They will appear here once available."}
            </p>
          </div>

          {/* Info note */}
          <div className="bg-brand-neutral-100 border border-brand-neutral-200 rounded-2xl px-4 py-3 flex items-start gap-2.5 mb-4">
            <Info size={14} className="text-brand-neutral-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-brand-neutral-500" style={{ fontWeight: 400 }}>
              {isLab
                ? "Contact your facility if results are not available within 48 hours."
                : "Contact your facility if you need a copy of your prescription urgently."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
