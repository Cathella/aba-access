import { useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Lock, AlertCircle } from "lucide-react";

const PIN_LENGTH = 4;

export function AUTH05CreatePINPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? "signup";
  const phone = searchParams.get("phone") ?? "";

  const [step, setStep] = useState<1 | 2>(1);
  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [confirm, setConfirm] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [showError, setShowError] = useState(false);

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmRefs = useRef<(HTMLInputElement | null)[]>([]);

  const activeDigits = step === 1 ? pin : confirm;
  const activeSetDigits = step === 1 ? setPin : setConfirm;
  const activeRefs = step === 1 ? pinRefs : confirmRefs;

  /* ── Digit handler ── */
  function handleChange(index: number, value: string) {
    const d = value.replace(/\D/g, "").slice(-1);
    const next = [...activeDigits];
    next[index] = d;
    activeSetDigits(next);
    setShowError(false);

    if (d && index < PIN_LENGTH - 1) {
      activeRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !activeDigits[index] && index > 0) {
      activeRefs.current[index - 1]?.focus();
      const next = [...activeDigits];
      next[index - 1] = "";
      activeSetDigits(next);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, PIN_LENGTH);
    if (!pasted) return;
    const next = Array(PIN_LENGTH).fill("");
    for (let i = 0; i < PIN_LENGTH; i++) {
      next[i] = pasted[i] ?? "";
    }
    activeSetDigits(next);
    setShowError(false);
    activeRefs.current[Math.min(pasted.length, PIN_LENGTH - 1)]?.focus();
  }

  /* ── Validation ── */
  const isFilled = activeDigits.join("").length === PIN_LENGTH;

  function handleContinue() {
    if (!isFilled) return;

    if (step === 1) {
      setStep(2);
      setConfirm(Array(PIN_LENGTH).fill(""));
      setTimeout(() => confirmRefs.current[0]?.focus(), 60);
    } else {
      // Step 2 — confirm
      if (pin.join("") !== confirm.join("")) {
        setShowError(true);
        setConfirm(Array(PIN_LENGTH).fill(""));
        setTimeout(() => confirmRefs.current[0]?.focus(), 60);
        return;
      }
      // Save PIN to sessionStorage for next step
      sessionStorage.setItem('newPin', pin.join(""));
      navigate(`/auth-06b?mode=${mode}&phone=${encodeURIComponent(phone)}`);
    }
  }

  function handleBack() {
    if (step === 2) {
      setStep(1);
      setConfirm(Array(PIN_LENGTH).fill(""));
      setShowError(false);
    } else {
      navigate(-1);
    }
  }

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col items-center justify-center">
      {/* ── Back link ── */}
      <div className="absolute top-0 left-0 px-5 pt-[56px] pb-5">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-transparent"
        >
          <ArrowLeft size={16} className="text-brand-neutral-900" />
          <span
            className="text-[14px] text-brand-neutral-900"
            style={{ fontWeight: 500 }}
          >
            Back
          </span>
        </button>
      </div>

      {/* ── Card ── */}
      <div className="mx-5 w-full flex justify-center">
        <div className="w-full max-w-[390px] bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl px-6 py-8 flex flex-col items-center">
          {/* Lock icon */}
          <div className="w-16 h-16 rounded-full bg-brand-secondary-50 flex items-center justify-center mb-5">
            <Lock size={28} className="text-brand-neutral-900" />
          </div>

          {/* Heading */}
          <h1
            className="text-[22px] tracking-[-0.01em] text-brand-neutral-900 mb-2 text-center"
            style={{ fontWeight: 600, lineHeight: 1.25 }}
          >
            {step === 1 ? "Create Your PIN" : "Confirm Your PIN"}
          </h1>

          {/* Subtitle */}
          <p
            className="text-brand-neutral-500 text-center mb-5 text-[14px]"
            style={{ fontWeight: 400, lineHeight: 1.5 }}
          >
            {step === 1
              ? "Use this PIN for quick sign-in"
              : "Enter your PIN again to confirm"}
          </p>

          {/* ── Progress bar ── */}
          <div className="w-full flex gap-2 mb-6">
            <div className="flex-1 h-[3px] rounded-full bg-brand-primary-500" />
            <div
              className={`flex-1 h-[3px] rounded-full ${
                step === 2
                  ? "bg-brand-primary-500"
                  : "bg-brand-neutral-200"
              }`}
            />
          </div>

          {/* ── Error banner ── */}
          {showError && (
            <div className="w-full flex items-center gap-2.5 bg-brand-error-50 border border-brand-error-500/20 rounded-[10px] px-4 py-3 mb-4">
              <AlertCircle size={16} className="text-brand-error-500 shrink-0" />
              <p
                className="text-[13px] text-brand-error-500"
                style={{ fontWeight: 450, lineHeight: 1.4 }}
              >
                PINs don't match. Try again.
              </p>
            </div>
          )}

          {/* ── PIN digit boxes ── */}
          <div className="w-full flex items-center justify-center gap-3 mb-6">
            {activeDigits.map((digit, i) => (
              <div
                key={`${step}-${i}`}
                className={`relative w-[60px] h-[60px] rounded-xl border-[1.5px] transition-colors bg-brand-neutral-0 ${
                  showError
                    ? "border-brand-error-500"
                    : digit
                      ? "border-brand-primary-500"
                      : "border-brand-neutral-200"
                } focus-within:border-brand-neutral-900 flex items-center justify-center`}
              >
                {/* Dot mask */}
                {digit && (
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-neutral-900 pointer-events-none" />
                )}
                <input
                  ref={(el) => {
                    activeRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  style={{ caretColor: "transparent" }}
                  autoFocus={i === 0}
                />
              </div>
            ))}
          </div>

          {/* ── Info tip ── */}
          <div className="w-full bg-brand-secondary-50 rounded-[10px] px-4 py-3 mb-6">
            <p
              className="text-[13px] text-brand-neutral-700 text-center"
              style={{ fontWeight: 400, lineHeight: 1.5 }}
            >
              {step === 1
                ? "Choose a PIN you can easily remember but others can't guess. Avoid simple patterns like 1234."
                : "Make sure it matches the PIN you just created."}
            </p>
          </div>

          {/* ── Continue / Save PIN button ── */}
          <button
            onClick={handleContinue}
            disabled={!isFilled}
            className={`w-full min-h-[48px] rounded-xl flex items-center justify-center border-[1.5px] transition-colors text-[15px] ${
              isFilled
                ? "bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-brand-neutral-900"
                : "bg-brand-primary-300/40 text-brand-neutral-900/40 border-transparent cursor-not-allowed"
            }`}
            style={{ fontWeight: 500 }}
          >
            {step === 1 ? "Continue" : "Save PIN"}
          </button>
        </div>
      </div>
    </div>
  );
}