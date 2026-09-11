import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, UserCircle, Copy, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { getProfile } from "../profileStore";
import { useAuth } from "../../lib/auth-context";

/* ══════════════════════════════════════════════
   Constants
   ══════════════════════════════════════════════ */

const DISTRICTS = ["Kampala", "Wakiso", "Mukono", "Mbarara", "Gulu"];

/* ══════════════════════════════════════════════
   Inline error component
   ══════════════════════════════════════════════ */

function FieldError({ message }: { message: string }) {
  return (
    <div className="mt-1.5 bg-brand-error-50 rounded-lg px-3 py-1.5">
      <p
        className="text-[11px] text-brand-error-500"
        style={{ fontWeight: 400 }}
      >
        {message}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Shared input style
   ══════════════════════════════════════════════ */

const inputBase =
  "w-full px-3 py-2.5 bg-brand-neutral-0 border border-brand-neutral-200 text-[13px] text-brand-neutral-900 placeholder:text-brand-neutral-300 focus:outline-none focus:border-brand-primary-300 transition-colors";

const inputStyle = { borderRadius: 6 };

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function SET01ProfileSettingsPage() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();
  const localProfile = getProfile();

  /* ── Form state ── */
  const [fullName, setFullName] = useState(profile.fullName || localProfile.fullName || "");
  const phone = profile.phone || localProfile.phone || "";
  const [email, setEmail] = useState(profile.email || localProfile.email || "");
  const [district, setDistrict] = useState(profile.district || localProfile.district || "");
  const [areaTown, setAreaTown] = useState(profile.areaTown || localProfile.areaTown || "");
  const [dob, setDob] = useState(profile.dob || localProfile.dob || "");

  const [emergencyName, setEmergencyName] = useState(profile.emergencyName || localProfile.emergencyName || "");
  const [emergencyPhone, setEmergencyPhone] = useState(profile.emergencyPhone || localProfile.emergencyPhone || "");

  /* ── Validation ── */
  const [nameError, setNameError] = useState("");
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  function validateName(value: string) {
    if (!value.trim()) {
      setNameError("Full name is required");
      return false;
    }
    setNameError("");
    return true;
  }

  function handleNameChange(value: string) {
    setFullName(value);
    if (touched) validateName(value);
  }

  function handleNameBlur() {
    setTouched(true);
    validateName(fullName);
  }

  /* ── Save ── */
  async function handleSave() {
    setTouched(true);
    if (!validateName(fullName)) return;
    setSaving(true);
    try {
      await updateProfile({
        fullName: fullName.trim(),
        district,
        areaTown: areaTown.trim(),
        dob,
        gender: profile.gender || localProfile.gender || undefined,
        email: email.trim(),
        emergencyName: emergencyName.trim(),
        emergencyPhone: emergencyPhone.trim(),
      });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
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
          Profile
        </h2>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[100px]">
        {/* ── Avatar section ── */}
        <div className="flex flex-col items-center pt-6 pb-2">
          <div className="w-16 h-16 rounded-full bg-brand-secondary-50 flex items-center justify-center mb-2">
            <UserCircle size={36} className="text-brand-secondary-500" />
          </div>
          <p
            className="text-[15px] text-brand-neutral-900"
            style={{ fontWeight: 600 }}
          >
            {fullName || "Your name"}
          </p>
          <p
            className="text-[12px] text-brand-neutral-500 mt-0.5"
            style={{ fontWeight: 400 }}
          >
            {phone}
          </p>
        </div>

        {/* ── A) Profile details card ── */}
        <div className="px-5 pt-3">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            PROFILE DETAILS
          </p>
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 space-y-4">
            {/* ABA Member ID (read-only) */}
            <div>
              <label
                className="block text-[12px] text-brand-neutral-700 mb-1.5"
                style={{ fontWeight: 500 }}
              >
                ABA Member ID
              </label>
              <div
                className="flex items-center gap-2 w-full px-3 py-2.5 bg-brand-neutral-100 border border-brand-neutral-200 text-[13px] text-brand-neutral-900"
                style={{ borderRadius: 6 }}
              >
                <span
                  className="flex-1 text-brand-neutral-500"
                  style={{ fontWeight: 500, letterSpacing: "0.02em" }}
                >
                  {profile.memberId || "—"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(profile.memberId || "");
                    toast.success("ABA ID copied");
                  }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-brand-neutral-200 transition-colors shrink-0"
                  aria-label="Copy ABA ID"
                >
                  <Copy size={14} className="text-brand-neutral-400" />
                </button>
              </div>
              <p
                className="text-[11px] text-brand-neutral-400 mt-1 px-0.5"
                style={{ fontWeight: 400 }}
              >
                This ID helps facilities find your account quickly.
              </p>
            </div>

            {/* Full name */}
            <div>
              <label
                className="block text-[12px] text-brand-neutral-700 mb-1.5"
                style={{ fontWeight: 500 }}
              >
                Full name <span className="text-brand-error-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={handleNameBlur}
                placeholder="Enter your full name"
                className={`${inputBase} ${
                  nameError
                    ? "border-brand-error-500 focus:border-brand-error-500"
                    : ""
                }`}
                style={inputStyle}
              />
              {nameError && <FieldError message={nameError} />}
            </div>

            {/* Phone (read-only) */}
            <div>
              <label
                className="block text-[12px] text-brand-neutral-700 mb-1.5"
                style={{ fontWeight: 500 }}
              >
                Phone number
              </label>
              <input
                type="tel"
                value={phone}
                readOnly
                className={`${inputBase} bg-brand-neutral-100 text-brand-neutral-500 cursor-not-allowed`}
                style={inputStyle}
              />
              <p
                className="text-[11px] text-brand-neutral-400 mt-1 px-0.5"
                style={{ fontWeight: 400 }}
              >
                Used for login
              </p>
            </div>

            {/* District */}
            <div>
              <label
                className="block text-[12px] text-brand-neutral-700 mb-1.5"
                style={{ fontWeight: 500 }}
              >
                District
              </label>
              <div className="relative">
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className={`${inputBase} appearance-none pr-9 ${
                    !district ? "text-brand-neutral-300" : ""
                  }`}
                  style={inputStyle}
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
                className="block text-[12px] text-brand-neutral-700 mb-1.5"
                style={{ fontWeight: 500 }}
              >
                Area / Town
              </label>
              <input
                type="text"
                value={areaTown}
                onChange={(e) => setAreaTown(e.target.value)}
                placeholder="e.g., Kisaasi, Ntinda, Mukono"
                className={inputBase}
                style={inputStyle}
              />
            </div>

            {/* Date of birth */}
            <div>
              <label
                className="block text-[12px] text-brand-neutral-700 mb-1.5"
                style={{ fontWeight: 500 }}
              >
                Date of birth{" "}
                <span
                  className="text-brand-neutral-400"
                  style={{ fontWeight: 400 }}
                >
                  (optional)
                </span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={`${inputBase} ${!dob ? "text-brand-neutral-300" : ""}`}
                style={inputStyle}
              />
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-[12px] text-brand-neutral-700 mb-1.5"
                style={{ fontWeight: 500 }}
              >
                Email{" "}
                <span
                  className="text-brand-neutral-400"
                  style={{ fontWeight: 400 }}
                >
                  (optional)
                </span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputBase}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* ── B) Emergency contact card ── */}
        <div className="px-5 pt-4">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            EMERGENCY CONTACT
          </p>
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 space-y-4">
            {/* Emergency name */}
            <div>
              <label
                className="block text-[12px] text-brand-neutral-700 mb-1.5"
                style={{ fontWeight: 500 }}
              >
                Contact name{" "}
                <span
                  className="text-brand-neutral-400"
                  style={{ fontWeight: 400 }}
                >
                  (optional)
                </span>
              </label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder="e.g. John Doe"
                className={inputBase}
                style={inputStyle}
              />
            </div>

            {/* Emergency phone */}
            <div>
              <label
                className="block text-[12px] text-brand-neutral-700 mb-1.5"
                style={{ fontWeight: 500 }}
              >
                Contact phone{" "}
                <span
                  className="text-brand-neutral-400"
                  style={{ fontWeight: 400 }}
                >
                  (optional)
                </span>
              </label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="+256 7XX XXX XXX"
                className={inputBase}
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ══ Fixed Bottom Action Bar ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-5 flex gap-3">
        {/* Secondary – Cancel */}
        <button
          onClick={() => navigate(-1)}
          className="flex-1 h-11 rounded-xl text-[14px] flex items-center justify-center border-[1.5px] border-brand-neutral-900 bg-brand-neutral-200 hover:bg-brand-neutral-300 text-brand-neutral-900 transition-colors"
          style={{ fontWeight: 500 }}
        >
          Cancel
        </button>

        {/* Primary – Save changes */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 h-11 rounded-xl text-[14px] flex items-center justify-center border-[1.5px] border-brand-neutral-900 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 transition-colors disabled:opacity-60"
          style={{ fontWeight: 500 }}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
