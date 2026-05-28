import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import { useAuth } from "../../lib/auth-context";

export function AUTH02EnterPhonePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? "signup";
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signUp, signInWithPin } = useAuth();

  const isSignup = mode === "signup";
  const isValid = phone.replace(/\s/g, "").length >= 9;

  function handlePhoneChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 9);
    let formatted = digits;
    if (digits.length > 3 && digits.length <= 6) {
      formatted = `${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else if (digits.length > 6) {
      formatted = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
    setPhone(formatted);
  }

    async function handleContinue() {
    if (!isValid) return;
    setLoading(true);
    setError("");
    try {
      const fullPhone = "+256 " + phone;
      if (isSignup) {
        await signUp(fullPhone);
        // Store phone for later steps (consent, PIN, profile)
        sessionStorage.setItem('signupPhone', fullPhone);
        // Go to consent screen
        navigate(`/auth-04?mode=signup&phone=${encodeURIComponent(fullPhone)}`);
      } else {
        navigate(`/auth-07?mode=login&phone=${encodeURIComponent(fullPhone)}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col items-center justify-center">
      {/* ── Back link ── */}
      <div className="absolute top-0 left-0 px-5 pt-[56px] pb-5">
        <button
          onClick={() => navigate(-1)}
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
          {/* Phone icon */}
          <div className="w-16 h-16 rounded-full bg-brand-secondary-50 flex items-center justify-center mb-5">
            <Phone size={28} className="text-brand-neutral-900" />
          </div>

          {/* Heading */}
          <h1
            className="text-[22px] tracking-[-0.01em] text-brand-neutral-900 mb-2 text-center"
            style={{ fontWeight: 600, lineHeight: 1.25 }}
          >
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>

          {/* Subtitle */}
          <p
            className="text-brand-neutral-500 text-center mb-6 text-[14px]"
            style={{ fontWeight: 400, lineHeight: 1.5 }}
          >
            {isSignup
              ? "Enter your phone number to get started."
              : "Enter your phone number to log in."}
          </p>

          {/* ── Phone Number label ── */}
          <label
            className="self-start text-[13px] text-brand-neutral-700 mb-2"
            style={{ fontWeight: 500 }}
          >
            Phone number
          </label>

          {/* ── Phone input ── */}
          <div className="w-full flex items-center bg-brand-neutral-0 border border-brand-neutral-200 rounded-xl overflow-hidden focus-within:border-brand-neutral-900 transition-colors mb-2">
            <div className="flex items-center pl-4 pr-2 shrink-0">
              <Phone size={18} className="text-brand-neutral-500" />
            </div>
            <input
              type="tel"
              value={phone ? `+256 ${phone}` : ""}
              onChange={(e) => {
                const raw = e.target.value.replace(/^\+256\s*/, "");
                handlePhoneChange(raw);
              }}
              placeholder="+256 700 000 000"
              className="flex-1 h-[48px] pr-4 bg-brand-neutral-0 text-[15px] text-brand-neutral-900 placeholder:text-brand-neutral-300 outline-none border-0"
              style={{ fontWeight: 400 }}
              autoFocus
            />
          </div>

          {/* Helper text */}
          <p
            className="self-start text-[12px] text-brand-neutral-500 mb-6"
            style={{ fontWeight: 400, lineHeight: 1.5 }}
          >
            We'll send a one-time code to verify your number.
          </p>

          {/* ── Error message ── */}
          {error && (
            <p className="self-start text-[12px] text-brand-error-500 mb-4">
              {error}
            </p>
          )}

          {/* ── Continue button ── */}
          <button
            onClick={handleContinue}
            disabled={!isValid || loading}
            className={`w-full min-h-[48px] rounded-xl flex items-center justify-center gap-2 border-[1.5px] transition-colors text-[15px] ${
              isValid && !loading
                ? "bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-brand-neutral-900"
                : "bg-brand-primary-300/40 text-brand-neutral-900/40 border-transparent cursor-not-allowed"
            }`}
            style={{ fontWeight: 500 }}
          >
            {loading ? "Sending..." : "Continue"}
            {!loading && <ArrowRight size={16} />}
          </button>

          {/* ── Need help? link ── */}
          <button
            onClick={() => navigate("/set-07")}
            className="mt-4 text-[13px] text-brand-secondary-500 hover:underline bg-transparent"
            style={{ fontWeight: 450 }}
          >
            Need help?
          </button>
        </div>
      </div>
    </div>
  );
}
