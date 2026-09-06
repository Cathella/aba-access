import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, ShieldCheck, Building2, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

export function AUTH04ConsentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? "signup";
  const phone = searchParams.get("phone") ?? "";

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Please accept Terms and Privacy to continue.");
  const [submitting, setSubmitting] = useState(false);

  const bothChecked = termsAccepted && privacyAccepted;

  async function handleContinue() {
    if (!bothChecked) {
      setErrorMessage("Please accept Terms and Privacy to continue.");
      setShowError(true);
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("consents").insert({});
      if (error) throw error;
      navigate(`/auth-05?mode=${mode}&phone=${encodeURIComponent(phone)}`);
    } catch {
      setErrorMessage("Couldn't record your consent. Please try again.");
      setShowError(true);
    } finally {
      setSubmitting(false);
    }
  }

  function handleCheckChange(
    field: "terms" | "privacy",
    checked: boolean
  ) {
    if (field === "terms") setTermsAccepted(checked);
    else setPrivacyAccepted(checked);
    setShowError(false);
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
            Consent
          </h2>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          Scrollable content
         ═══════════════════════════════════════ */}
      <div className="flex-1 pt-[96px] pb-[160px] px-5">
        {/* Page heading */}
        <h1
          className="text-[22px] tracking-[-0.01em] text-brand-neutral-900 mb-1.5"
          style={{ fontWeight: 600, lineHeight: 1.25 }}
        >
          Before you continue
        </h1>
        <p
          className="text-[14px] text-brand-neutral-500 mb-6"
          style={{ fontWeight: 400, lineHeight: 1.5 }}
        >
          Please review how we handle your information.
        </p>

        {/* ── Error banner ── */}
        {showError && (
          <div className="flex items-center gap-2.5 bg-brand-error-50 border border-brand-error-500/20 rounded-[10px] px-4 py-3 mb-5">
            <AlertCircle size={16} className="text-brand-error-500 shrink-0" />
            <p
              className="text-[13px] text-brand-error-500"
              style={{ fontWeight: 450, lineHeight: 1.4 }}
            >
              {errorMessage}
            </p>
          </div>
        )}

        {/* ═══════════════════════════════════════
            Card 1 — Privacy summary
           ═══════════════════════════════════════ */}
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-primary-50 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck size={17} className="text-brand-primary-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[14px] text-brand-neutral-900 mb-1"
                style={{ fontWeight: 500, lineHeight: 1.4 }}
              >
                Your privacy
              </p>
              <p
                className="text-[13px] text-brand-neutral-500 mb-3"
                style={{ fontWeight: 400, lineHeight: 1.55 }}
              >
                We use your details to manage packages, approvals, and care
                tracking.
              </p>
              <button
                onClick={() => navigate("/set-05")}
                className="text-[13px] text-brand-secondary-500 hover:underline bg-transparent"
                style={{ fontWeight: 500 }}
              >
                Read privacy policy
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            Card 2 — Facility sharing summary
           ═══════════════════════════════════════ */}
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-secondary-50 flex items-center justify-center shrink-0 mt-0.5">
              <Building2 size={17} className="text-brand-secondary-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[14px] text-brand-neutral-900 mb-1"
                style={{ fontWeight: 500, lineHeight: 1.4 }}
              >
                Facility sharing
              </p>
              <p
                className="text-[13px] text-brand-neutral-500 mb-2"
                style={{ fontWeight: 400, lineHeight: 1.55 }}
              >
                Facilities only see what's needed to provide care (coverage
                status and patient selection).
              </p>
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full bg-brand-primary-50 text-brand-primary-500 text-[11px]"
                style={{ fontWeight: 500 }}
              >
                No marketing sharing
              </span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            Checkboxes
           ═══════════════════════════════════════ */}
        <div className="space-y-3">
          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <span className="mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) =>
                  handleCheckChange("terms", e.target.checked)
                }
                className="sr-only peer"
              />
              <span
                className={`flex items-center justify-center w-5 h-5 rounded-[4px] border-[1.5px] transition-colors ${
                  termsAccepted
                    ? "bg-brand-neutral-900 border-brand-neutral-900"
                    : "bg-brand-neutral-0 border-brand-neutral-300"
                }`}
              >
                {termsAccepted && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            </span>
            <span
              className="text-[14px] text-brand-neutral-700"
              style={{ fontWeight: 400, lineHeight: 1.5 }}
            >
              I agree to the{" "}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/set-06");
                }}
                className="text-[14px] text-brand-secondary-500 hover:underline bg-transparent inline"
                style={{ fontWeight: 500 }}
              >
                Terms of Service
              </button>
            </span>
          </label>

          {/* Privacy */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <span className="mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) =>
                  handleCheckChange("privacy", e.target.checked)
                }
                className="sr-only peer"
              />
              <span
                className={`flex items-center justify-center w-5 h-5 rounded-[4px] border-[1.5px] transition-colors ${
                  privacyAccepted
                    ? "bg-brand-neutral-900 border-brand-neutral-900"
                    : "bg-brand-neutral-0 border-brand-neutral-300"
                }`}
              >
                {privacyAccepted && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            </span>
            <span
              className="text-[14px] text-brand-neutral-700"
              style={{ fontWeight: 400, lineHeight: 1.5 }}
            >
              I agree to the{" "}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/set-05");
                }}
                className="text-[14px] text-brand-secondary-500 hover:underline bg-transparent inline"
                style={{ fontWeight: 500 }}
              >
                Privacy Policy
              </button>
            </span>
          </label>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          Fixed bottom action bar
         ═══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4">
        <button
          onClick={handleContinue}
          disabled={submitting}
          className={`w-full h-[48px] rounded-xl text-[15px] flex items-center justify-center border-[1.5px] transition-colors ${
            bothChecked && !submitting
              ? "bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-brand-neutral-900"
              : "bg-brand-primary-300/50 text-brand-neutral-900/50 border-brand-neutral-900/30"
          }`}
          style={{ fontWeight: 500 }}
        >
          {submitting ? "Continuing…" : "Continue"}
        </button>
      </div>
    </div>
  );
}