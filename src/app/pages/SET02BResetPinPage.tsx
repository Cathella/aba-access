import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../lib/auth-context";

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
  const { resetPinAuthenticated } = useAuth();

  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setError("");

    if (!newPin || !confirmPin) {
      setError("Please fill in both PIN fields.");
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

    setSaving(true);
    try {
      await resetPinAuthenticated(newPin);
      toast.success("PIN reset");
      navigate("/set-02");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset PIN.");
    } finally {
      setSaving(false);
    }
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
              You're signed in, so you can set a new PIN without entering your current one.
            </p>
          </div>

          {/* Error banner */}
          {error && <ErrorBanner message={error} />}

          {/* New PIN */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 space-y-4">
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
        </div>
      </div>

      {/* ══ Fixed Bottom Action Bar ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-11 rounded-xl text-[14px] flex items-center justify-center border-[1.5px] border-brand-neutral-900 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 transition-colors disabled:opacity-60"
          style={{ fontWeight: 500 }}
        >
          {saving ? "Saving…" : "Save new PIN"}
        </button>
      </div>
    </div>
  );
}
