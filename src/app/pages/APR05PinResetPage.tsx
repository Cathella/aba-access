import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../lib/auth-context";
import { supabase } from "../../lib/supabase";
import {
  ArrowLeft,
  KeyRound,
  Phone,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type Step = "intro" | "newPin";

export function APR05PinResetPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("id") ?? "";
  const { profile } = useAuth();

  const [step, setStep] = useState<Step>("intro");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [saving, setSaving] = useState(false);

  const maskedPhone = profile.phone
    ? profile.phone.slice(0, -4).replace(/\d/g, "•") + profile.phone.slice(-4)
    : "+256 ••••••••";

  const handleSavePin = async () => {
    setPinError("");
    const digits = newPin.replace(/\D/g, "");
    const confirmDigits = confirmPin.replace(/\D/g, "");

    if (digits.length < 4) { setPinError("PIN must be 4 digits."); return; }
    if (digits !== confirmDigits) { setPinError("PINs do not match."); return; }

    setSaving(true);
    const { error } = await supabase
      .from("users")
      .update({ pin_hash: btoa(digits) })
      .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "");

    if (error) {
      setPinError("Failed to save PIN. Please try again.");
      setSaving(false);
      return;
    }

    navigate(`/apr-03?id=${requestId}&pinReset=1`);
  };

  const inputClass =
    "w-full h-11 px-3 rounded-[6px] border border-brand-neutral-200 bg-brand-neutral-0 text-[13px] text-brand-neutral-900 placeholder:text-brand-neutral-400 outline-none focus:border-brand-neutral-900 transition-colors";

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/apr-03?id=${requestId}`)}
            className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-brand-neutral-900" />
          </button>
          <h2 className="text-[17px] text-brand-neutral-900" style={{ fontWeight: 600 }}>Reset PIN</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-[72px] pb-[80px]">
        <div className="px-5 pt-8 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-neutral-200 flex items-center justify-center mb-5">
            <KeyRound size={22} className="text-brand-neutral-500" />
          </div>

          {/* Step 1 — Intro */}
          {step === "intro" && (
            <div className="w-full flex flex-col items-center">
              <h3 className="text-[17px] text-brand-neutral-900 mb-1 text-center" style={{ fontWeight: 600 }}>
                Reset your PIN
              </h3>
              <p className="text-[13px] text-brand-neutral-500 text-center max-w-[260px] mb-6" style={{ fontWeight: 400 }}>
                Create a new 4-digit PIN for your account.
              </p>

              <div className="w-full max-w-[320px] bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-brand-neutral-700" />
                  </div>
                  <div>
                    <p className="text-[12px] text-brand-neutral-500 mb-0.5" style={{ fontWeight: 400 }}>Registered phone</p>
                    <p className="text-[14px] text-brand-neutral-900" style={{ fontWeight: 600 }}>{maskedPhone}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep("newPin")}
                className="w-full max-w-[320px] h-11 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center transition-colors"
                style={{ fontWeight: 500 }}
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2 — New PIN */}
          {step === "newPin" && (
            <div className="w-full flex flex-col items-center">
              <div className="flex items-center gap-1.5 mb-4">
                <CheckCircle2 size={14} className="text-brand-success-500" />
                <span className="text-[12px] text-brand-success-500" style={{ fontWeight: 500 }}>Identity confirmed</span>
              </div>

              <h3 className="text-[17px] text-brand-neutral-900 mb-1 text-center" style={{ fontWeight: 600 }}>
                Create a new PIN
              </h3>
              <p className="text-[13px] text-brand-neutral-500 text-center max-w-[260px] mb-6" style={{ fontWeight: 400 }}>
                Choose a 4-digit PIN you'll remember.
              </p>

              <div className="w-full max-w-[320px] mb-3">
                <label className="block text-[12px] text-brand-neutral-500 mb-1.5" style={{ fontWeight: 500 }}>New PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => { setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4)); if (pinError) setPinError(""); }}
                  placeholder="••••"
                  className={`${inputClass} tracking-[0.2em] ${pinError ? "border-brand-error-500" : ""}`}
                  autoFocus
                />
              </div>

              <div className="w-full max-w-[320px] mb-3">
                <label className="block text-[12px] text-brand-neutral-500 mb-1.5" style={{ fontWeight: 500 }}>Confirm PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => { setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4)); if (pinError) setPinError(""); }}
                  placeholder="••••"
                  className={`${inputClass} tracking-[0.2em] ${pinError ? "border-brand-error-500" : ""}`}
                />
              </div>

              {pinError && (
                <div className="w-full max-w-[320px] mb-4 flex items-center gap-2 px-3 py-2.5 rounded-[6px] bg-brand-error-50">
                  <AlertCircle size={14} className="text-brand-error-500 shrink-0" />
                  <p className="text-[12px] text-brand-error-500" style={{ fontWeight: 400 }}>{pinError}</p>
                </div>
              )}

              <button
                onClick={handleSavePin}
                disabled={saving}
                className={`w-full max-w-[320px] h-11 rounded-xl text-[13px] flex items-center justify-center border-[1.5px] transition-colors mt-3 ${saving ? "bg-brand-neutral-200 text-brand-neutral-500 border-brand-neutral-200 cursor-wait" : "bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-brand-neutral-900"}`}
                style={{ fontWeight: 500 }}
              >
                {saving ? "Saving…" : "Save new PIN"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
