import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, ShieldAlert, AlertCircle } from "lucide-react";
import { useAuth } from "../../lib/auth-context";

export function AUTH08AResetPINPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get("phone") ?? "+256 7XX XXX XXX";
  const { beginPinResetByPhone } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleContinue() {
    setLoading(true);
    setError("");
    try {
      // Establishes a session for this phone number; the next screen sets
      // the new PIN. No SMS code is sent — see beginPinResetByPhone for why.
      await beginPinResetByPhone(decodeURIComponent(phone));
      navigate(`/auth-08c?phone=${encodeURIComponent(phone)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ═══════════════════════════════════════
          App bar — fixed
         ═══════════════════════════════════════ */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-brand-neutral-0 border-b border-brand-neutral-200">
        <div className="flex items-center h-[56px] px-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-brand-neutral-100 transition-colors -ml-1"
          >
            <ArrowLeft size={20} className="text-brand-neutral-900" />
          </button>
          <h2
            className="flex-1 text-[16px] text-brand-neutral-900 pr-9 text-left"
            style={{ fontWeight: 500, lineHeight: 1.4 }}
          >
            Reset PIN
          </h2>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          Scrollable content
         ═══════════════════════════════════════ */}
      <div className="flex-1 pt-[72px] pb-[160px] px-5 flex flex-col items-center justify-center text-center">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-brand-warning-50 flex items-center justify-center mb-5">
          <ShieldAlert size={26} className="text-brand-warning-500" />
        </div>

        {/* Heading */}
        <h1
          className="text-[22px] tracking-[-0.01em] text-brand-neutral-900 mb-2"
          style={{ fontWeight: 600, lineHeight: 1.25 }}
        >
          Reset PIN
        </h1>
        <p
          className="text-[14px] text-brand-neutral-500 mb-1"
          style={{ fontWeight: 400, lineHeight: 1.55 }}
        >
          Confirm your phone number to set a new PIN.
        </p>
        <p
          className="text-[14px] text-brand-neutral-500"
          style={{ fontWeight: 400, lineHeight: 1.55 }}
        >
          Resetting for{" "}
          <span className="text-brand-neutral-900" style={{ fontWeight: 500 }}>
            {decodeURIComponent(phone)}
          </span>
        </p>

        {error && (
          <div className="w-full mt-5 flex items-center gap-2.5 bg-brand-error-50 border border-brand-error-500/20 rounded-[10px] px-4 py-3">
            <AlertCircle size={16} className="text-brand-error-500 shrink-0" />
            <p
              className="text-[13px] text-brand-error-500 text-left"
              style={{ fontWeight: 450, lineHeight: 1.4 }}
            >
              {error}
            </p>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════
          Fixed bottom action bar
         ═══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4">
        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full h-[48px] rounded-xl text-[15px] flex items-center justify-center border-[1.5px] bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-brand-neutral-900 transition-colors disabled:opacity-60"
          style={{ fontWeight: 500 }}
        >
          {loading ? "Checking…" : "Continue"}
        </button>
      </div>
    </div>
  );
}
