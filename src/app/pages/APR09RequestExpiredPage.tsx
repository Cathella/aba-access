import { useNavigate, useSearchParams } from "react-router";
import { Clock, Info } from "lucide-react";

export function APR09RequestExpiredPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("id") || "";

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pb-[80px] flex items-center justify-center">
        <div className="px-5 flex flex-col items-center">
          {/* ── Icon ── */}
          <div className="w-16 h-16 rounded-full bg-brand-neutral-200 flex items-center justify-center mb-5">
            <Clock size={30} className="text-brand-neutral-500" />
          </div>

          {/* ── Title ── */}
          <h2
            className="text-[20px] text-brand-neutral-900 mb-1 text-center"
            style={{ fontWeight: 600 }}
          >
            Request expired
          </h2>

          {/* ── Body ── */}
          <p
            className="text-[13px] text-brand-neutral-500 text-center max-w-[260px] mb-7"
            style={{ fontWeight: 400 }}
          >
            This request is no longer active. Ask the facility to resend.
          </p>

          {/* ── Info note ── */}
          <div className="w-full bg-brand-neutral-100 border border-brand-neutral-200 rounded-2xl px-4 py-3 flex items-start gap-2.5 mb-8">
            <Info
              size={14}
              className="text-brand-neutral-400 shrink-0 mt-0.5"
            />
            <p
              className="text-[11px] text-brand-neutral-500"
              style={{ fontWeight: 400 }}
            >
              Approval requests expire after a set period. The facility can
              create a new request if the service is still needed.
            </p>
          </div>

        </div>
      </div>

      {/* ══ Fixed bottom action bar ══ */}
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