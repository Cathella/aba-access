import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle } from "lucide-react";

export function AUTH08DDonePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get("phone") ?? "";

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ═══════════════════════════════════════
          Scrollable content — centered
         ═══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-[140px] text-center">
        {/* ── Success icon ── */}
        <div className="w-14 h-14 rounded-full bg-brand-success-50 flex items-center justify-center mb-5">
          <CheckCircle size={26} className="text-brand-success-500" />
        </div>

        {/* ── Heading ── */}
        <h1
          className="text-[22px] tracking-[-0.01em] text-brand-neutral-900 mb-2"
          style={{ fontWeight: 600, lineHeight: 1.25 }}
        >
          PIN updated
        </h1>
        <p
          className="text-[14px] text-brand-neutral-500"
          style={{ fontWeight: 400, lineHeight: 1.55 }}
        >
          Your PIN has been changed. Use your new PIN to log in.
        </p>
      </div>

      {/* ═══════════════════════════════════════
          Fixed bottom action bar
         ═══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4">
        <button
          onClick={() =>
            navigate(
              phone
                ? `/auth-07?phone=${encodeURIComponent(phone)}`
                : "/auth-07"
            )
          }
          className="w-full h-[48px] rounded-xl text-[15px] flex items-center justify-center border-[1.5px] bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-brand-neutral-900 transition-colors"
          style={{ fontWeight: 500 }}
        >
          Back to login
        </button>
      </div>
    </div>
  );
}