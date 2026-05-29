import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ChevronDown, AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../lib/auth-context";
import { saveProfile } from "../profileStore";

/* ══════════════════════════════════════════════
   Constants
   ══════════════════════════════════════════════ */

const DISTRICTS = ["Kampala", "Wakiso", "Mukono", "Mbarara", "Gulu"];
const GENDERS = ["Male", "Female", "Other"];

/* ══════════════════════════════════════════════
   Shared styles
   ══════════════════════════════════════════════ */

const inputBase =
  "w-full px-3 py-2.5 bg-brand-neutral-0 border border-brand-neutral-200 text-[13px] text-brand-neutral-900 placeholder:text-brand-neutral-300 focus:outline-none focus:border-brand-primary-300 transition-colors rounded-xl min-h-[44px]";

const labelStyle =
  "block text-[12px] text-brand-neutral-700 mb-1.5";

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function AUTH06BCompleteProfilePage() {
  const navigate = useNavigate();
  const { completeProfile } = useAuth();

  /* ── Form state ── */
  const [fullName, setFullName] = useState("");
  const [district, setDistrict] = useState("");
  const [areaTown, setAreaTown] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  /* ── Validation ── */
  const [showError, setShowError] = useState(false);

  const requiredMissing = !fullName.trim() || !district || !areaTown.trim();

  async function handleSave() {
    if (requiredMissing) {
      setShowError(true);
      return;
    }
    setLoading(true);
    try {
      const pin = localStorage.getItem('newPin') || sessionStorage.getItem('newPin') || '';
      await completeProfile({
        fullName: fullName.trim(),
        district,
        areaTown: areaTown.trim(),
        pin,
      });
      saveProfile({
        fullName: fullName.trim(),
        district,
        areaTown: areaTown.trim(),
        dob,
        gender,
        profileComplete: true,
      });
      localStorage.removeItem('newPin');
      sessionStorage.removeItem('newPin');
      toast.success("Profile saved");
      navigate("/auth-06");
    } catch (error) {
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  }

  async function handleSkip() {
    const pin = localStorage.getItem('newPin') || sessionStorage.getItem('newPin') || '';
    localStorage.removeItem('newPin');
    sessionStorage.removeItem('newPin');
    if (pin) {
      // Create a minimal DB row so the account is usable for login
      // Profile details can be completed later from Settings → Profile
      try {
        await completeProfile({ fullName: '', district: '', areaTown: '', pin });
      } catch {
        // best-effort — if this fails, the user's login will fail and they'll re-register
      }
    }
    navigate("/home-01");
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
          Complete your profile
        </h2>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[160px]">
        {/* ── Intro text ── */}
        <div className="px-5 pt-5 pb-4">
          <p
            className="text-[14px] text-brand-neutral-500"
            style={{ fontWeight: 400, lineHeight: 1.55 }}
          >
            This helps facilities identify you and provide better care.
          </p>
        </div>

        {/* ── Error banner ── */}
        {showError && requiredMissing && (
          <div className="px-5 pb-3">
            <div className="bg-brand-error-50 border border-brand-error-500/20 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <AlertTriangle
                size={16}
                className="text-brand-error-500 shrink-0 mt-0.5"
              />
              <p
                className="text-[13px] text-brand-error-500"
                style={{ fontWeight: 500, lineHeight: 1.45 }}
              >
                Please fill in all required fields.
              </p>
            </div>
          </div>
        )}

        {/* ── Card A: Required fields ── */}
        <div className="px-5 pb-3">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            REQUIRED
          </p>
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 space-y-4">
            {/* Full name */}
            <div>
              <label
                className={labelStyle}
                style={{ fontWeight: 500 }}
              >
                Full name <span className="text-brand-error-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (showError) setShowError(false);
                }}
                placeholder="e.g., Catherine Nakitto"
                className={`${inputBase} ${
                  showError && !fullName.trim()
                    ? "border-brand-error-500 focus:border-brand-error-500"
                    : ""
                }`}
              />
            </div>

            {/* District */}
            <div>
              <label
                className={labelStyle}
                style={{ fontWeight: 500 }}
              >
                District <span className="text-brand-error-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    if (showError) setShowError(false);
                  }}
                  className={`${inputBase} appearance-none pr-9 ${
                    !district ? "text-brand-neutral-300" : ""
                  } ${
                    showError && !district
                      ? "border-brand-error-500 focus:border-brand-error-500"
                      : ""
                  }`}
                >
                  <option value="" disabled>
                    Select district
                  </option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-neutral-500 pointer-events-none"
                />
              </div>
            </div>

            {/* Area / Town */}
            <div>
              <label
                className={labelStyle}
                style={{ fontWeight: 500 }}
              >
                Area / Town <span className="text-brand-error-500">*</span>
              </label>
              <input
                type="text"
                value={areaTown}
                onChange={(e) => {
                  setAreaTown(e.target.value);
                  if (showError) setShowError(false);
                }}
                placeholder="e.g., Kisaasi, Ntinda, Mukono"
                className={`${inputBase} ${
                  showError && !areaTown.trim()
                    ? "border-brand-error-500 focus:border-brand-error-500"
                    : ""
                }`}
              />
            </div>
          </div>
        </div>

        {/* ── Card B: Optional fields ── */}
        <div className="px-5 pb-3">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            OPTIONAL{" "}
            <span
              className="text-brand-neutral-400"
              style={{ fontWeight: 400 }}
            >
              (recommended)
            </span>
          </p>
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 space-y-4">
            {/* Date of birth */}
            <div>
              <label
                className={labelStyle}
                style={{ fontWeight: 500 }}
              >
                Date of birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={`${inputBase} ${!dob ? "text-brand-neutral-300" : ""}`}
              />
            </div>

            {/* Gender */}
            <div>
              <label
                className={labelStyle}
                style={{ fontWeight: 500 }}
              >
                Gender
              </label>
              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`${inputBase} appearance-none pr-9 ${
                    !gender ? "text-brand-neutral-300" : ""
                  }`}
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-neutral-500 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Warning note */}
        <div className="px-5 pb-3 pt-2">
          <div className="bg-brand-warning-50 rounded-xl px-3 py-2 flex items-start gap-2">
            <Info
              size={14}
              className="text-brand-warning-500 shrink-0 mt-0.5"
            />
            <p
              className="text-[11px] text-brand-neutral-700"
              style={{ fontWeight: 400, lineHeight: 1.45 }}
            >
              You can update this later in Profile.
            </p>
          </div>
        </div>
      </div>

      {/* ══ Fixed bottom action bar ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4">
        {/* Primary CTA */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full h-[48px] rounded-xl text-[15px] flex items-center justify-center border-[1.5px] bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-brand-neutral-900 transition-colors mb-3 disabled:opacity-60"
          style={{ fontWeight: 500 }}
        >
          {loading ? "Saving..." : "Save & continue"}
        </button>

        {/* Skip link */}
        <button
          onClick={handleSkip}
          className="w-full flex items-center justify-center text-[13px] text-brand-primary-500 py-1"
          style={{ fontWeight: 500 }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
