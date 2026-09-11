import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

const PIN_LENGTH = 4;

function generateApprovalCode(): string {
  return "APR-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function APR03EnterPinPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("id") ?? "";
  const patientLabel = searchParams.get("patient") ?? "";
  const pinWasReset = searchParams.get("pinReset") === "1";

  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showResetBanner, setShowResetBanner] = useState(pinWasReset);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, PIN_LENGTH);
    setPin(digits);
    if (error) setError(false);
  };

  const handleSubmit = async () => {
    if (pin.length < PIN_LENGTH) { setError(true); return; }

    setSubmitting(true);

    // Verified entirely server-side — the hash never reaches the browser
    const { data: isValid, error: verifyError } = await supabase.rpc("verify_pin", { pin });
    if (verifyError || !isValid) {
      setError(true);
      setPin("");
      setSubmitting(false);
      inputRef.current?.focus();
      return;
    }

    const code = generateApprovalCode();
    const { error: updateError } = await supabase
      .from("approval_requests")
      .update({ status: "Approved", approval_code: code, responded_at: new Date().toISOString() })
      .eq("id", requestId);

    if (updateError) {
      setError(true);
      setSubmitting(false);
      return;
    }

    navigate(`/apr-04?id=${requestId}`);
  };

  const focusInput = () => inputRef.current?.focus();

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/apr-02?id=${requestId}`)}
            className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-brand-neutral-900" />
          </button>
          <h2 className="text-[17px] text-brand-neutral-900" style={{ fontWeight: 600 }}>Enter PIN</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-[72px] pb-[80px] flex items-center justify-center">
        <div className="px-5 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-neutral-200 flex items-center justify-center mb-5">
            <Lock size={22} className="text-brand-neutral-500" />
          </div>

          <h3 className="text-[17px] text-brand-neutral-900 mb-1 text-center" style={{ fontWeight: 600 }}>
            Confirm approval
          </h3>
          <p className="text-[13px] text-brand-neutral-500 mb-8 text-center max-w-[260px]" style={{ fontWeight: 400 }}>
            Enter your AbaAccess PIN to approve this request.
          </p>

          {patientLabel && (
            <p className="text-[12px] text-brand-neutral-500 mb-5 text-center" style={{ fontWeight: 400 }}>
              Patient: <span style={{ fontWeight: 500 }}>{patientLabel}</span>
            </p>
          )}

          <div className="w-full max-w-[240px] mb-4">
            <input
              ref={inputRef}
              type="tel"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={PIN_LENGTH}
              value={pin}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              className="sr-only"
              aria-label="PIN input"
              autoFocus
            />
            <button
              type="button"
              onClick={focusInput}
              className={`w-full flex items-center justify-center gap-4 h-14 rounded-[6px] border bg-brand-neutral-0 transition-colors ${error ? "border-brand-error-500" : "border-brand-neutral-200"}`}
            >
              {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${i < pin.length ? "bg-brand-neutral-900 scale-110" : "bg-brand-neutral-200"}`}
                />
              ))}
            </button>
          </div>

          {error && (
            <div className="w-full max-w-[240px] mb-4 flex items-center gap-2 px-3 py-2.5 rounded-[6px] bg-brand-error-50">
              <AlertCircle size={14} className="text-brand-error-500 shrink-0" />
              <p className="text-[12px] text-brand-error-500" style={{ fontWeight: 400 }}>Incorrect PIN. Try again.</p>
            </div>
          )}

          {showResetBanner && (
            <div className="w-full max-w-[240px] mb-4 flex items-center gap-2 px-3 py-2.5 rounded-[6px] bg-brand-success-50">
              <CheckCircle2 size={14} className="text-brand-success-500 shrink-0" />
              <p className="text-[12px] text-brand-success-500" style={{ fontWeight: 400 }}>PIN updated. Please confirm approval.</p>
            </div>
          )}

          <button
            onClick={() => navigate(`/apr-05?id=${requestId}`)}
            className="text-[12px] text-brand-primary-500 mb-10"
            style={{ fontWeight: 500 }}
          >
            Forgot PIN?
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`w-full h-11 rounded-xl text-[13px] flex items-center justify-center border-[1.5px] transition-colors ${submitting ? "bg-brand-neutral-200 text-brand-neutral-500 border-brand-neutral-200 cursor-wait" : "bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-brand-neutral-900"}`}
          style={{ fontWeight: 500 }}
        >
          {submitting ? "Verifying…" : "Confirm approval"}
        </button>
      </div>
    </div>
  );
}
