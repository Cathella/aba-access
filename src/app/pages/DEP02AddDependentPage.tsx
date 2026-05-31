import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

/* ══════════════════════════════════════════════
   Constants
   ══════════════════════════════════════════════ */

const RELATIONSHIP_OPTIONS = ["Child", "Spouse", "Parent", "Other"];
const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];

/* ══════════════════════════════════════════════
   Inline error component
   ══════════════════════════════════════════════ */

function FieldError({ message }: { message: string }) {
  return (
    <div className="mt-1.5 bg-brand-error-50 rounded-lg px-3 py-1.5">
      <p className="text-[11px] text-brand-error-500" style={{ fontWeight: 400 }}>
        {message}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function DEP02AddDependentPage() {
  const navigate = useNavigate();

  /* ── Form state ── */
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [allergies, setAllergies] = useState("");
  const [conditions, setConditions] = useState("");

  /* ── UI state ── */
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState("");

  const errors = {
    name: touched && !name.trim(),
    relationship: touched && !relationship,
    dob: touched && !dob,
  };
  const isValid = !!(name.trim() && relationship && dob);

  /* ── Save handler ── */
  const handleSave = async () => {
    setTouched(true);
    if (!isValid) return;
    setSaveError("");
    setSubmitting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) throw new Error("No active session");

      const { error } = await supabase.from("dependents").insert({
        user_id: sessionData.session.user.id,
        full_name: name.trim(),
        relationship,
        dob,
        gender: gender || null,
        allergies: allergies.trim() || null,
        conditions: conditions.trim() || null,
      });

      if (error) throw error;
      navigate("/dep-01");
    } catch {
      setSaveError("Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
        <h2 className="text-[17px] text-brand-neutral-900" style={{ fontWeight: 600 }}>
          Add dependent
        </h2>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[140px]">
        {/* ── Error banner ── */}
        {saveError && (
          <div className="px-5 pt-4">
            <div className="bg-brand-error-50 border border-brand-error-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <AlertTriangle size={16} className="text-brand-error-500 mt-0.5 shrink-0" />
              <p className="text-[13px] text-brand-error-500" style={{ fontWeight: 400 }}>
                {saveError}
              </p>
            </div>
          </div>
        )}

        {/* ── Form card ── */}
        <div className="px-5 pt-4">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5 space-y-5">
            {/* Full name */}
            <div>
              <label className="block text-[12px] text-brand-neutral-500 mb-1.5" style={{ fontWeight: 500 }}>
                Full name <span className="text-brand-error-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className={`w-full h-10 px-3 bg-brand-neutral-0 border rounded-md text-[13px] text-brand-neutral-900 placeholder:text-brand-neutral-300 focus:outline-none transition-colors ${
                  errors.name
                    ? "border-brand-error-500 focus:border-brand-error-500"
                    : "border-brand-neutral-200 focus:border-brand-primary-300"
                }`}
                style={{ borderRadius: 6 }}
              />
              {errors.name && <FieldError message="Full name is required." />}
            </div>

            {/* Relationship */}
            <div>
              <label className="block text-[12px] text-brand-neutral-500 mb-1.5" style={{ fontWeight: 500 }}>
                Relationship <span className="text-brand-error-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className={`w-full h-10 px-3 pr-8 bg-brand-neutral-0 border rounded-md text-[13px] text-brand-neutral-900 focus:outline-none appearance-none transition-colors ${
                    errors.relationship
                      ? "border-brand-error-500 focus:border-brand-error-500"
                      : "border-brand-neutral-200 focus:border-brand-primary-300"
                  } ${!relationship ? "text-brand-neutral-300" : ""}`}
                  style={{ borderRadius: 6 }}
                >
                  <option value="" disabled>Select relationship</option>
                  {RELATIONSHIP_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-neutral-500 pointer-events-none" />
              </div>
              {errors.relationship && <FieldError message="Please select a relationship." />}
            </div>

            {/* Date of birth */}
            <div>
              <label className="block text-[12px] text-brand-neutral-500 mb-1.5" style={{ fontWeight: 500 }}>
                Date of birth <span className="text-brand-error-500">*</span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={`w-full h-10 px-3 bg-brand-neutral-0 border rounded-md text-[13px] text-brand-neutral-900 focus:outline-none transition-colors ${
                  errors.dob
                    ? "border-brand-error-500 focus:border-brand-error-500"
                    : "border-brand-neutral-200 focus:border-brand-primary-300"
                }`}
                style={{ borderRadius: 6 }}
              />
              {errors.dob && <FieldError message="Date of birth is required." />}
            </div>

            {/* Gender (optional) */}
            <div>
              <label className="block text-[12px] text-brand-neutral-500 mb-1.5" style={{ fontWeight: 500 }}>
                Gender{" "}
                <span className="text-[11px] text-brand-neutral-300" style={{ fontWeight: 400 }}>(optional)</span>
              </label>
              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`w-full h-10 px-3 pr-8 bg-brand-neutral-0 border border-brand-neutral-200 rounded-md text-[13px] text-brand-neutral-900 focus:outline-none focus:border-brand-primary-300 appearance-none transition-colors ${
                    !gender ? "text-brand-neutral-300" : ""
                  }`}
                  style={{ borderRadius: 6 }}
                >
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-neutral-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* ── "Add more details" accordion ── */}
        <div className="px-5 pt-3">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setDetailsOpen(!detailsOpen)}
              className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-brand-neutral-100 transition-colors"
            >
              <span className="text-[13px] text-brand-neutral-900" style={{ fontWeight: 500 }}>
                Add more details
              </span>
              {detailsOpen
                ? <ChevronUp size={16} className="text-brand-neutral-500 shrink-0" />
                : <ChevronDown size={16} className="text-brand-neutral-500 shrink-0" />}
            </button>
            {detailsOpen && (
              <div className="px-5 pb-5 pt-1 space-y-4 border-t border-brand-neutral-200">
                <div className="pt-4">
                  <label className="block text-[12px] text-brand-neutral-500 mb-1.5" style={{ fontWeight: 500 }}>
                    Allergies{" "}
                    <span className="text-[11px] text-brand-neutral-300" style={{ fontWeight: 400 }}>(optional)</span>
                  </label>
                  <textarea
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g. Peanuts, shellfish"
                    rows={3}
                    className="w-full px-3 py-2.5 bg-brand-neutral-0 border border-brand-neutral-200 rounded-md text-[13px] text-brand-neutral-900 placeholder:text-brand-neutral-300 focus:outline-none focus:border-brand-primary-300 resize-none transition-colors"
                    style={{ borderRadius: 6 }}
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-brand-neutral-500 mb-1.5" style={{ fontWeight: 500 }}>
                    Chronic conditions{" "}
                    <span className="text-[11px] text-brand-neutral-300" style={{ fontWeight: 400 }}>(optional)</span>
                  </label>
                  <textarea
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    placeholder="e.g. Asthma, diabetes"
                    rows={3}
                    className="w-full px-3 py-2.5 bg-brand-neutral-0 border border-brand-neutral-200 rounded-md text-[13px] text-brand-neutral-900 placeholder:text-brand-neutral-300 focus:outline-none focus:border-brand-primary-300 resize-none transition-colors"
                    style={{ borderRadius: 6 }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ Fixed Bottom Action Bar ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-5 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 h-11 rounded-xl text-[14px] flex items-center justify-center bg-brand-neutral-200 hover:bg-brand-neutral-300 text-brand-neutral-900 transition-colors"
          style={{ fontWeight: 500 }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={submitting}
          className="flex-1 h-11 rounded-xl text-[14px] flex items-center justify-center border-[1.5px] bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-brand-neutral-900 transition-colors disabled:opacity-60"
          style={{ fontWeight: 500 }}
        >
          {submitting ? "Saving…" : "Save dependent"}
        </button>
      </div>
    </div>
  );
}
