import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { BottomNav } from "../components/BottomNav";
import {
  ArrowLeft,
  KeyRound,
  Phone,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

/* ── Steps ── */
type Step = "intro" | "verify" | "newPin";

export function APR05PinResetPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("id") || "req-001";

  const [step, setStep] = useState<Step>("intro");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [codeError, setCodeError] = useState("");
  const [pinError, setPinError] = useState("");
  const [saving, setSaving] = useState(false);

  /* ── Handlers ── */

  const handleSendCode = () => {
    setCodeSent(true);
    // Simulate OTP send, move to verify step
    setTimeout(() => setStep("verify"), 600);
  };

  const handleVerifyCode = () => {
    setCodeError("");
    if (code.length < 4) {
      setCodeError("Enter the 4-digit code sent to your phone.");
      return;
    }
    // Demo: any 4-digit code works except "0000"
    if (code === "0000") {
      setCodeError("Invalid code. Please try again.");
      return;
    }
    setStep("newPin");
  };

  const handleSavePin = () => {
    setPinError("");
    const digitsOnly = newPin.replace(/\D/g, "");
    const confirmDigits = confirmPin.replace(/\D/g, "");

    if (digitsOnly.length < 4) {
      setPinError("PIN must be 4 digits.");
      return;
    }
    if (digitsOnly !== confirmDigits) {
      setPinError("PINs do not match.");
      return;
    }

    setSaving(true);
    // Simulate save delay, then navigate back with success flag
    setTimeout(() => {
      navigate("/apr-03?id=" + requestId + "&pinReset=1");
    }, 500);
  };

  /* ── Shared input style ── */
  const inputClass =
    "w-full h-11 px-3 rounded-[6px] border border-brand-neutral-200 bg-brand-neutral-0 text-[13px] text-brand-neutral-900 placeholder:text-brand-neutral-400 outline-none focus:border-brand-neutral-900 transition-colors";

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ App Bar ══ */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/apr-03?id=" + requestId)}
            className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-brand-neutral-900" />
          </button>
          <h2
            className="text-[17px] text-brand-neutral-900"
            style={{ fontWeight: 600 }}
          >
            Reset PIN
          </h2>
        </div>
      </div>

      {/* ══ Scrollable Content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[80px]">
        <div className="px-5 pt-8 flex flex-col items-center">
          {/* ────────────────────────────────────
              Icon
          ──────────────────────────────────── */}
          <div className="w-14 h-14 rounded-2xl bg-brand-neutral-200 flex items-center justify-center mb-5">
            <KeyRound size={22} className="text-brand-neutral-500" />
          </div>

          {/* ══════════════════════════════════
              STEP 1 — INTRO / SEND CODE
          ══════════════════════════════════ */}
          {step === "intro" && (
            <div className="w-full flex flex-col items-center">
              <h3
                className="text-[17px] text-brand-neutral-900 mb-1 text-center"
                style={{ fontWeight: 600 }}
              >
                Reset your PIN
              </h3>
              <p
                className="text-[13px] text-brand-neutral-500 text-center max-w-[260px] mb-6"
                style={{ fontWeight: 400 }}
              >
                To reset your PIN, we'll send a code to your phone.
              </p>

              {/* Phone preview card */}
              <div className="w-full max-w-[320px] bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-brand-neutral-700" />
                  </div>
                  <div>
                    <p
                      className="text-[12px] text-brand-neutral-500 mb-0.5"
                      style={{ fontWeight: 400 }}
                    >
                      Code will be sent to
                    </p>
                    <p
                      className="text-[14px] text-brand-neutral-900"
                      style={{ fontWeight: 600 }}
                    >
                      +256 •••• ••12
                    </p>
                  </div>
                </div>
              </div>

              {/* Proof-of-concept tag */}
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full bg-brand-warning-50 text-brand-warning-500 text-[11px] mb-6"
                style={{ fontWeight: 500 }}
              >
                Proof-of-concept only
              </span>

              {/* Send code CTA */}
              <button
                onClick={handleSendCode}
                disabled={codeSent}
                className={`w-full max-w-[320px] h-11 rounded-xl text-[13px] flex items-center justify-center border-[1.5px] transition-colors ${
                  codeSent
                    ? "bg-brand-neutral-200 text-brand-neutral-500 border-brand-neutral-200 cursor-wait"
                    : "bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-brand-neutral-900"
                }`}
                style={{ fontWeight: 500 }}
              >
                {codeSent ? "Sending…" : "Send code"}
              </button>
            </div>
          )}

          {/* ══════════════════════════════════
              STEP 2 — VERIFY CODE
          ══════════════════════════════════ */}
          {step === "verify" && (
            <div className="w-full flex flex-col items-center">
              <h3
                className="text-[17px] text-brand-neutral-900 mb-1 text-center"
                style={{ fontWeight: 600 }}
              >
                Enter verification code
              </h3>
              <p
                className="text-[13px] text-brand-neutral-500 text-center max-w-[260px] mb-6"
                style={{ fontWeight: 400 }}
              >
                A 4-digit code was sent to +256 •••• ••12
              </p>

              {/* Code field */}
              <div className="w-full max-w-[320px] mb-3">
                <label
                  className="block text-[12px] text-brand-neutral-500 mb-1.5"
                  style={{ fontWeight: 500 }}
                >
                  Enter code
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={4}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 4));
                    if (codeError) setCodeError("");
                  }}
                  placeholder="• • • •"
                  className={`${inputClass} text-center tracking-[0.2em] ${
                    codeError ? "border-brand-error-500" : ""
                  }`}
                  autoFocus
                />
              </div>

              {/* Error banner */}
              {codeError && (
                <div className="w-full max-w-[320px] mb-4 flex items-center gap-2 px-3 py-2.5 rounded-[6px] bg-brand-error-50">
                  <AlertCircle
                    size={14}
                    className="text-brand-error-500 shrink-0"
                  />
                  <p
                    className="text-[12px] text-brand-error-500"
                    style={{ fontWeight: 400 }}
                  >
                    {codeError}
                  </p>
                </div>
              )}

              {/* Resend hint */}
              <button
                className="text-[12px] text-brand-primary-500 mb-8"
                style={{ fontWeight: 500 }}
                onClick={() => {
                  // Demo: just clear the field
                  setCode("");
                  setCodeError("");
                }}
              >
                Resend code
              </button>

              {/* Verify CTA */}
              <button
                onClick={handleVerifyCode}
                className="w-full max-w-[320px] h-11 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center transition-colors"
                style={{ fontWeight: 500 }}
              >
                Verify code
              </button>
            </div>
          )}

          {/* ══════════════════════════════════
              STEP 3 — NEW PIN + CONFIRM
          ══════════════════════════════════ */}
          {step === "newPin" && (
            <div className="w-full flex flex-col items-center">
              {/* Verified badge */}
              <div className="flex items-center gap-1.5 mb-4">
                <CheckCircle2 size={14} className="text-brand-success-500" />
                <span
                  className="text-[12px] text-brand-success-500"
                  style={{ fontWeight: 500 }}
                >
                  Phone verified
                </span>
              </div>

              <h3
                className="text-[17px] text-brand-neutral-900 mb-1 text-center"
                style={{ fontWeight: 600 }}
              >
                Create a new PIN
              </h3>
              <p
                className="text-[13px] text-brand-neutral-500 text-center max-w-[260px] mb-6"
                style={{ fontWeight: 400 }}
              >
                Choose a 4-digit PIN you'll remember.
              </p>

              {/* New PIN field */}
              <div className="w-full max-w-[320px] mb-3">
                <label
                  className="block text-[12px] text-brand-neutral-500 mb-1.5"
                  style={{ fontWeight: 500 }}
                >
                  New PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => {
                    setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4));
                    if (pinError) setPinError("");
                  }}
                  placeholder="••••"
                  className={`${inputClass} tracking-[0.2em] ${
                    pinError ? "border-brand-error-500" : ""
                  }`}
                  autoFocus
                />
              </div>

              {/* Confirm PIN field */}
              <div className="w-full max-w-[320px] mb-3">
                <label
                  className="block text-[12px] text-brand-neutral-500 mb-1.5"
                  style={{ fontWeight: 500 }}
                >
                  Confirm PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => {
                    setConfirmPin(
                      e.target.value.replace(/\D/g, "").slice(0, 4)
                    );
                    if (pinError) setPinError("");
                  }}
                  placeholder="••••"
                  className={`${inputClass} tracking-[0.2em] ${
                    pinError ? "border-brand-error-500" : ""
                  }`}
                />
              </div>

              {/* Error banner */}
              {pinError && (
                <div className="w-full max-w-[320px] mb-4 flex items-center gap-2 px-3 py-2.5 rounded-[6px] bg-brand-error-50">
                  <AlertCircle
                    size={14}
                    className="text-brand-error-500 shrink-0"
                  />
                  <p
                    className="text-[12px] text-brand-error-500"
                    style={{ fontWeight: 400 }}
                  >
                    {pinError}
                  </p>
                </div>
              )}

              {/* Save new PIN CTA */}
              <button
                onClick={handleSavePin}
                disabled={saving}
                className={`w-full max-w-[320px] h-11 rounded-xl text-[13px] flex items-center justify-center border-[1.5px] transition-colors mt-3 ${
                  saving
                    ? "bg-brand-neutral-200 text-brand-neutral-500 border-brand-neutral-200 cursor-wait"
                    : "bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-brand-neutral-900"
                }`}
                style={{ fontWeight: 500 }}
              >
                {saving ? "Saving…" : "Save new PIN"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Navigation ── */}
      <BottomNav activeTab="approvals" />
    </div>
  );
}
