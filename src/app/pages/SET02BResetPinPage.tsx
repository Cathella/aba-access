import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Eye, EyeOff, Send } from "lucide-react";
import { toast } from "sonner";

/* ══════════════════════════════════════════════
   Error banner
   ══════════════════════════════════════════════ */

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="bg-brand-error-50 rounded-xl px-4 py-3">
      <p
        className="text-[13px] text-brand-error-500"
        style={{ fontWeight: 500 }}
      >
        {message}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PIN field with toggle visibility
   ══════════════════════════════════════════════ */

function PinField({
  label,
  value,
  onChange,
  placeholder,
  hasError,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  hasError?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label
        className="block text-[12px] text-brand-neutral-700 mb-1.5"
        style={{ fontWeight: 500 }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          inputMode="numeric"
          maxLength={6}
          value={value}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "");
            if (v.length <= 6) onChange(v);
          }}
          placeholder={placeholder}
          className={`w-full px-3 py-2.5 pr-10 bg-brand-neutral-0 border text-[13px] text-brand-neutral-900 placeholder:text-brand-neutral-300 focus:outline-none transition-colors ${
            hasError
              ? "border-brand-error-500 focus:border-brand-error-500"
              : "border-brand-neutral-200 focus:border-brand-primary-300"
          }`}
          style={{ borderRadius: 6 }}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-neutral-400"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function SET02BResetPinPage() {
  const navigate = useNavigate();

  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");

  function handleSendCode() {
    setCodeSent(true);
    toast.success("Code sent to your phone");
  }

  function handleSave() {
    setError("");

    if (!code) {
      setError("Please enter the verification code.");
      return;
    }

    if (!newPin || !confirmPin) {
      setError("Please fill in all PIN fields.");
      return;
    }

    if (newPin.length < 4) {
      setError("PIN must be at least 4 digits.");
      return;
    }

    if (newPin !== confirmPin) {
      setError("PINs do not match.");
      return;
    }

    toast.success("PIN reset");
    navigate("/set-02");
  }

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ App Bar (fixed) ══ */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-brand-neutral-100 px-5 pt-6 pb-3 flex items-center gap-3 border-b border-brand-neutral-200">
        <button
          onClick={() => navigate(-1)}
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

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[100px]">
        <div className="px-5 pt-5 space-y-4">
          {/* Explanatory note */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl px-4 py-3.5">
            <p
              className="text-[13px] text-brand-neutral-600"
              style={{ fontWeight: 400 }}
            >
              We'll send a code to your phone to reset your PIN.
            </p>
          </div>

          {/* Error banner */}
          {error && <ErrorBanner message={error} />}

          {/* Step 1: Send code */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 space-y-4">
            <p
              className="text-[12px] text-brand-neutral-500"
              style={{ fontWeight: 500, letterSpacing: "0.02em" }}
            >
              STEP 1 — VERIFY IDENTITY
            </p>

            <button
              onClick={handleSendCode}
              disabled={codeSent}
              className={`w-full h-10 rounded-xl text-[13px] flex items-center justify-center gap-2 border-[1.5px] transition-colors ${
                codeSent
                  ? "bg-brand-neutral-100 border-brand-neutral-200 text-brand-neutral-400 cursor-not-allowed"
                  : "bg-brand-neutral-0 border-brand-neutral-900 text-brand-neutral-900 hover:bg-brand-neutral-100"
              }`}
              style={{ fontWeight: 500 }}
            >
              <Send size={14} />
              {codeSent ? "Code sent" : "Send code"}
            </button>

            {codeSent && (
              <div>
                <label
                  className="block text-[12px] text-brand-neutral-700 mb-1.5"
                  style={{ fontWeight: 500 }}
                >
                  Enter code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    if (v.length <= 6) setCode(v);
                  }}
                  placeholder="6-digit code"
                  className="w-full px-3 py-2.5 bg-brand-neutral-0 border border-brand-neutral-200 text-[13px] text-brand-neutral-900 placeholder:text-brand-neutral-300 focus:outline-none focus:border-brand-primary-300 transition-colors"
                  style={{ borderRadius: 6 }}
                />
              </div>
            )}
          </div>

          {/* Step 2: New PIN */}
          {codeSent && (
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 space-y-4">
              <p
                className="text-[12px] text-brand-neutral-500"
                style={{ fontWeight: 500, letterSpacing: "0.02em" }}
              >
                STEP 2 — SET NEW PIN
              </p>

              <PinField
                label="New PIN"
                value={newPin}
                onChange={setNewPin}
                placeholder="Enter new PIN"
                hasError={!!error && error === "PINs do not match."}
              />

              <PinField
                label="Confirm PIN"
                value={confirmPin}
                onChange={setConfirmPin}
                placeholder="Re-enter new PIN"
                hasError={!!error && error === "PINs do not match."}
              />
            </div>
          )}

          {/* Proof-of-concept note */}
          <p
            className="text-[11px] text-brand-neutral-400 px-1"
            style={{ fontWeight: 400 }}
          >
            Proof-of-concept only — no real SMS is sent.
          </p>
        </div>
      </div>

      {/* ══ Fixed Bottom Action Bar ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-5">
        <button
          onClick={handleSave}
          disabled={!codeSent}
          className={`w-full h-11 rounded-xl text-[14px] flex items-center justify-center border-[1.5px] transition-colors ${
            codeSent
              ? "border-brand-neutral-900 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900"
              : "border-brand-neutral-200 bg-brand-neutral-100 text-brand-neutral-400 cursor-not-allowed"
          }`}
          style={{ fontWeight: 500 }}
        >
          Save new PIN
        </button>
      </div>
    </div>
  );
}
