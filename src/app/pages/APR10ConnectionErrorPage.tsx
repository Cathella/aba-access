import { useNavigate, useSearchParams } from "react-router";
import { WifiOff } from "lucide-react";

export function APR10ConnectionErrorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("id") || "req-001";

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pb-[80px] flex items-center justify-center">
        <div className="px-5 flex flex-col items-center">
          {/* ── Icon ── */}
          <div className="w-16 h-16 rounded-full bg-brand-error-50 flex items-center justify-center mb-5">
            <WifiOff size={28} className="text-brand-error-500" />
          </div>

          {/* ── Title ── */}
          <h2
            className="text-[20px] text-brand-neutral-900 mb-1 text-center"
            style={{ fontWeight: 600 }}
          >
            Couldn't complete approval
          </h2>

          {/* ── Body ── */}
          <p
            className="text-[13px] text-brand-neutral-500 text-center max-w-[260px] mb-8"
            style={{ fontWeight: 400 }}
          >
            Check your connection and try again.
          </p>

        </div>
      </div>

      {/* ══ Fixed bottom action bar ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4 flex items-center gap-3">
        {/* Secondary — Back to Approvals (left) */}
        <button
          onClick={() => navigate("/apr-01")}
          className="flex-1 h-11 bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center transition-colors"
          style={{ fontWeight: 500 }}
        >
          Back to Approvals
        </button>

        {/* Primary — Try again (right) */}
        <button
          onClick={() => navigate("/apr-03?id=" + requestId)}
          className="flex-1 h-11 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center transition-colors"
          style={{ fontWeight: 500 }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}