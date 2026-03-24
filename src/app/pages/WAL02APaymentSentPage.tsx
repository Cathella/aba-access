import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, MessageCircleQuestion } from "lucide-react";
import { toast } from "sonner";
import { BottomNav } from "../components/BottomNav";

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function WAL02APaymentSentPage() {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ═══════════════════════════════════════
          Centered content
         ═══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-[160px]">
        {/* ── Success icon ── */}
        <div className="w-14 h-14 rounded-full bg-brand-success-50 flex items-center justify-center mb-5">
          <CheckCircle size={28} className="text-brand-success-500" />
        </div>

        {/* ── Title ── */}
        <h1
          className="text-[22px] tracking-[-0.01em] text-brand-neutral-900 text-center mb-2"
          style={{ fontWeight: 600, lineHeight: 1.25 }}
        >
          Payment request sent
        </h1>

        {/* ── Body ── */}
        <p
          className="text-[14px] text-brand-neutral-500 text-center mb-1.5"
          style={{ fontWeight: 400, lineHeight: 1.55 }}
        >
          Approve the Mobile Money prompt on your phone to complete the top up.
        </p>

        {/* ── Small note ── */}
        <p
          className="text-[12px] text-brand-neutral-400 text-center mb-6"
          style={{ fontWeight: 400 }}
        >
          This may take a few moments.
        </p>

        {/* ── Help link ── */}
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="inline-flex items-center gap-1.5 text-[12px] text-brand-primary-500 hover:text-brand-primary-400 transition-colors"
          style={{ fontWeight: 500 }}
        >
          <MessageCircleQuestion size={14} />
          Didn&apos;t receive a prompt?
        </button>

        {/* ── Help note (toggled) ── */}
        {showHelp && (
          <div className="mt-3 bg-brand-neutral-0 border border-brand-neutral-200 rounded-xl px-4 py-3 w-full">
            <p
              className="text-[12px] text-brand-neutral-500"
              style={{ fontWeight: 400, lineHeight: 1.55 }}
            >
              Try again or switch to a different network. Ensure your phone has
              airtime and the Mobile Money service is active.
            </p>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════
          Fixed bottom action bar
         ═══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4">
        <div className="flex gap-2.5">
          {/* Secondary: View transactions → WAL-03 */}
          <button
            onClick={() => navigate("/wal-03")}
            className="flex-1 h-12 rounded-xl text-[14px] flex items-center justify-center border-[1.5px] bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 border-brand-neutral-900 transition-colors"
            style={{ fontWeight: 500 }}
          >
            View transactions
          </button>

          {/* Primary: Back to wallet → WAL-01 */}
          <button
            onClick={() => navigate("/wal-01")}
            className="flex-1 h-12 rounded-xl text-[14px] flex items-center justify-center border-[1.5px] bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-brand-neutral-900 transition-colors"
            style={{ fontWeight: 500 }}
          >
            Back to wallet
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          Bottom Navigation (fixed)
         ═══════════════════════════════════════ */}
    </div>
  );
}