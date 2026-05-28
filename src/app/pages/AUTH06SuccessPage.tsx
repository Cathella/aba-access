import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, Copy, Check } from "lucide-react";
import { getProfile } from "../profileStore";

export function AUTH06SuccessPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const memberId = getProfile().memberId || "ABA------";

  function handleCopy() {
    navigator.clipboard.writeText(memberId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ═══════════════════════════════════════
          Scrollable content — centered
         ═══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-[120px]">
        {/* ── Success icon ── */}
        <div className="w-16 h-16 rounded-full bg-brand-success-50 flex items-center justify-center mb-5">
          <CheckCircle size={32} className="text-brand-success-500" />
        </div>

        {/* ── Heading ── */}
        <h1
          className="text-[24px] tracking-[-0.01em] text-brand-neutral-900 text-center mb-2"
          style={{ fontWeight: 600, lineHeight: 1.25 }}
        >
          Account ready
        </h1>
        <p
          className="text-[14px] text-brand-neutral-500 text-center max-w-[300px] mb-8"
          style={{ fontWeight: 400, lineHeight: 1.55 }}
        >
          Your ABA Member ID is created. You can now buy packages and approve
          care requests.
        </p>

        {/* ═══════════════════════════════════════
            ABA ID Card
           ═══════════════════════════════════════ */}
        <div className="w-full bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5">
          <p
            className="text-[11px] tracking-[0.06em] uppercase text-brand-neutral-500 mb-2"
            style={{ fontWeight: 500 }}
          >
            ABA Member ID
          </p>

          <div className="flex items-center justify-between gap-3">
            <span
              className="text-[22px] tracking-[0.04em] text-brand-neutral-900"
              style={{ fontWeight: 600, letterSpacing: "0.04em" }}
            >
              {memberId}
            </span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border-[1.5px] transition-colors text-[12px] ${
                copied
                  ? "bg-brand-success-50 border-brand-success-500 text-brand-success-500"
                  : "bg-brand-neutral-0 border-brand-neutral-200 text-brand-neutral-700 hover:border-brand-neutral-900"
              }`}
              style={{ fontWeight: 500 }}
            >
              {copied ? (
                <>
                  <Check size={13} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={13} />
                  Copy
                </>
              )}
            </button>
          </div>

          <p
            className="text-[12px] text-brand-neutral-500 mt-3"
            style={{ fontWeight: 400, lineHeight: 1.5 }}
          >
            Use this ID at facilities if asked.
          </p>
        </div>

        {/* ── Footnote ── */}
        <div className="mt-5 bg-brand-neutral-100 border border-brand-neutral-200 rounded-xl px-4 py-3 w-full">
          <p
            className="text-[12px] text-brand-neutral-500 text-center"
            style={{ fontWeight: 400, lineHeight: 1.55 }}
          >
            You can find your ABA ID anytime in Home and Profile.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          Fixed bottom action bar
         ═══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4">
        <div className="flex gap-3">
        {/* Secondary CTA */}
        <button
          onClick={() => navigate("/dep-01")}
          className="flex-1 h-[48px] rounded-xl text-[15px] flex items-center justify-center border-[1.5px] bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 border-brand-neutral-900 transition-colors"
          style={{ fontWeight: 500 }}
        >
          Add dependents
        </button>

        {/* Primary CTA */}
        <button
          onClick={() => navigate("/home-01")}
          className="flex-1 h-[48px] rounded-xl text-[15px] flex items-center justify-center border-[1.5px] bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-brand-neutral-900 transition-colors"
          style={{ fontWeight: 500 }}
        >
          Go to Home
        </button>
        </div>
      </div>
    </div>
  );
}