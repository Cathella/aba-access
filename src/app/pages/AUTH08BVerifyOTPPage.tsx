import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Smartphone, AlertCircle } from "lucide-react";

const CODE_LENGTH = 6;
const TIMER_SECONDS = 45;
const MOCK_VALID_CODE = "123456";

/** Mask phone: "+256 700 123 456" → "+256 700 ***" */
function maskPhone(raw: string): string {
  const decoded = decodeURIComponent(raw).trim();
  const parts = decoded.split(" ");
  if (parts.length <= 2) return decoded;
  return parts.slice(0, 2).join(" ") + " ***";
}

export function AUTH08BVerifyOTPPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get("phone") ?? "+256 7XX XXX XXX";

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ── Countdown timer ── */
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const formatTimer = useCallback((s: number) => `${s}s`, []);

  /* ── OTP input handlers ── */
  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError(false);
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const next = [...digits];
      next[index - 1] = "";
      setDigits(next);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    if (!pasted) return;
    const next = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < CODE_LENGTH; i++) {
      next[i] = pasted[i] ?? "";
    }
    setDigits(next);
    setError(false);
    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  }

  function handleResend() {
    if (!canResend) return;
    setTimer(TIMER_SECONDS);
    setCanResend(false);
    setDigits(Array(CODE_LENGTH).fill(""));
    setError(false);
    inputRefs.current[0]?.focus();
  }

  /* ── Verify ── */
  const code = digits.join("");
  const isFilled = code.length === CODE_LENGTH;

  function handleVerify() {
    if (!isFilled) return;
    if (code === MOCK_VALID_CODE) {
      navigate(`/auth-08c?phone=${encodeURIComponent(phone)}`);
    } else {
      setError(true);
    }
  }

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ── Fixed header ── */}
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

      {/* ── Centered content ── */}
      <div className="flex-1 flex items-center justify-center pt-[56px] px-5">
        <div className="w-full max-w-[390px] bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl px-6 py-8 flex flex-col items-center">
          {/* Phone icon */}
          <div className="w-16 h-16 rounded-full bg-brand-secondary-50 flex items-center justify-center mb-5">
            <Smartphone size={28} className="text-brand-secondary-500" />
          </div>

          {/* Heading */}
          <h1
            className="text-[22px] tracking-[-0.01em] text-brand-neutral-900 mb-2 text-center"
            style={{ fontWeight: 600, lineHeight: 1.25 }}
          >
            Verify Your Phone
          </h1>

          {/* Subtitle */}
          <p
            className="text-brand-neutral-500 text-center mb-6 text-[14px]"
            style={{ fontWeight: 400, lineHeight: 1.5 }}
          >
            Enter the 6-digit code sent to {maskPhone(phone)}
          </p>

          {/* ── Error banner ── */}
          {error && (
            <div className="w-full flex items-center gap-2.5 bg-brand-error-50 border border-brand-error-500/20 rounded-[10px] px-4 py-3 mb-4">
              <AlertCircle size={16} className="text-brand-error-500 shrink-0" />
              <p
                className="text-[13px] text-brand-error-500"
                style={{ fontWeight: 450, lineHeight: 1.4 }}
              >
                Incorrect code. Try again.
              </p>
            </div>
          )}

          {/* ── OTP digit boxes ── */}
          <div className="w-full flex items-center justify-between gap-2">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className={`w-full aspect-square max-w-[52px] text-center text-[20px] rounded-xl border-[1.5px] outline-none transition-colors bg-brand-neutral-0 ${
                  error
                    ? "border-brand-error-500 text-brand-error-500"
                    : digit
                      ? "border-brand-neutral-900 text-brand-neutral-900"
                      : "border-brand-neutral-200 text-brand-neutral-900"
                } focus:border-brand-neutral-900 px-[0px] py-[12px]`}
                style={{ fontWeight: 600, lineHeight: 1 }}
                autoFocus={i === 0}
              />
            ))}
          </div>

          {/* ── Timer / Resend ── */}
          <div className="flex items-center justify-center mt-5 mb-6">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-brand-secondary-500 hover:underline bg-transparent text-[14px]"
                style={{ fontWeight: 500 }}
              >
                Resend code
              </button>
            ) : (
              <p
                className="text-[13px] text-brand-neutral-500"
                style={{ fontWeight: 400 }}
              >
                Resend code in{" "}
                <span className="text-brand-primary-500" style={{ fontWeight: 500 }}>
                  {formatTimer(timer)}
                </span>
              </p>
            )}
          </div>

          {/* ── Verify button ── */}
          <button
            onClick={handleVerify}
            disabled={!isFilled}
            className={`w-full min-h-[48px] rounded-xl flex items-center justify-center border-[1.5px] transition-colors text-[14px] ${
              isFilled
                ? "bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-brand-neutral-900"
                : "bg-brand-primary-300/40 text-brand-neutral-900/40 border-transparent cursor-not-allowed"
            }`}
            style={{ fontWeight: 500 }}
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
