import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, AlertTriangle } from "lucide-react";

/* ── Optional reason chips ── */
const reasons = [
  "Not my dependent",
  "Wrong facility",
  "I don't consent",
] as const;

/* ── Request names (for context line) ── */
const facilityNames: Record<string, string> = {
  "req-001": "Mukono Family Clinic",
  "req-002": "Sunrise Diagnostics",
  "req-003": "Divine Care Pharmacy",
};

export function APR06DeclineReasonPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("id") || "req-001";
  const facilityName = facilityNames[requestId] ?? "the facility";

  const [selected, setSelected] = useState<string | null>(null);

  const toggleReason = (reason: string) => {
    setSelected((prev) => (prev === reason ? null : reason));
  };

  const handleDecline = () => {
    // Pass reason (if any) so APR-07 can display it for audit
    const params = new URLSearchParams({ id: requestId });
    if (selected) params.set("reason", selected);
    navigate("/apr-07?" + params.toString());
  };

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ App Bar ══ */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/apr-02?id=" + requestId)}
            className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-brand-neutral-900" />
          </button>
          <h2
            className="text-[17px] text-brand-neutral-900"
            style={{ fontWeight: 600 }}
          >
            Decline request
          </h2>
        </div>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[80px]">
        <div className="px-5 pt-8 flex flex-col items-center">
          {/* ── Warning icon ── */}
          <div className="w-14 h-14 rounded-2xl bg-brand-error-50 flex items-center justify-center mb-5">
            <AlertTriangle size={22} className="text-brand-error-500" />
          </div>

          {/* ── Title ── */}
          <h3
            className="text-[17px] text-brand-neutral-900 mb-1 text-center"
            style={{ fontWeight: 600 }}
          >
            Decline request?
          </h3>

          {/* ── Explanatory note ── */}
          <p
            className="text-[13px] text-brand-neutral-500 text-center max-w-[280px] mb-8"
            style={{ fontWeight: 400 }}
          >
            The facility won't be able to use your package for this service.
          </p>

          {/* ── Facility context card ── */}
          <div className="w-full bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl px-4 py-3 mb-6">
            <div className="flex items-center justify-between">
              <span
                className="text-[12px] text-brand-neutral-500"
                style={{ fontWeight: 400 }}
              >
                Request from
              </span>
              <span
                className="text-[12px] text-brand-neutral-900"
                style={{ fontWeight: 500 }}
              >
                {facilityName}
              </span>
            </div>
          </div>

          {/* ── Optional reason chips ── */}
          <div className="w-full mb-8">
            <p
              className="text-[12px] text-brand-neutral-500 mb-3"
              style={{ fontWeight: 500 }}
            >
              Reason{" "}
              <span
                className="text-brand-neutral-400"
                style={{ fontWeight: 400 }}
              >
                (optional)
              </span>
            </p>

            <div className="flex flex-wrap gap-2">
              {reasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => toggleReason(reason)}
                  className={`px-3.5 py-2 rounded-full text-[12px] border transition-colors ${
                    selected === reason
                      ? "bg-brand-neutral-900 text-brand-neutral-0 border-brand-neutral-900"
                      : "bg-brand-neutral-0 text-brand-neutral-700 border-brand-neutral-200"
                  }`}
                  style={{ fontWeight: 450 }}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ Fixed bottom action bar ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4 flex gap-2.5">
        {/* Secondary — Go back */}
        <button
          onClick={() => navigate("/apr-02?id=" + requestId)}
          className="flex-1 h-11 bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center transition-colors"
          style={{ fontWeight: 500 }}
        >
          Go back
        </button>

        {/* Primary — Decline (destructive) */}
        <button
          onClick={handleDecline}
          className="flex-1 h-11 bg-brand-error-50 hover:bg-brand-error-500/20 text-brand-error-500 border-[1.5px] border-brand-error-500 rounded-xl text-[13px] flex items-center justify-center transition-colors"
          style={{ fontWeight: 500 }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}