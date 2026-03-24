import { useNavigate } from "react-router";
import {
  ArrowLeft,
  UserCircle,
  Shield,
  CalendarDays,
  Heart,
  Pencil,
  ChevronRight,
  ClipboardList,
  AlertCircle,
} from "lucide-react";

/* ══════════════════════════════════════════════
   Sample data (Ben)
   ══════════════════════════════════════════════ */

const DEPENDENT = {
  name: "Ben",
  relationship: "Child",
  dob: "15 Mar 2020",
  age: 6,
  gender: "Male",
  status: "Active" as const,
  allergies: "Peanuts",
  conditions: "",
};

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function DEP04DependentProfilePage() {
  const navigate = useNavigate();

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
          {DEPENDENT.name}
        </h2>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[100px]">
        {/* ── Profile card ── */}
        <div className="px-5 pt-4">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5">
            {/* Header row */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-brand-secondary-50 flex items-center justify-center shrink-0">
                <UserCircle size={24} className="text-brand-secondary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3
                    className="text-[16px] text-brand-neutral-900"
                    style={{ fontWeight: 600 }}
                  >
                    {DEPENDENT.name}
                  </h3>
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-success-50 text-[10px] text-brand-success-500 shrink-0"
                    style={{ fontWeight: 500 }}
                  >
                    {DEPENDENT.status}
                  </span>
                </div>
                <p
                  className="text-[13px] text-brand-neutral-500 mt-0.5"
                  style={{ fontWeight: 400 }}
                >
                  {DEPENDENT.relationship}
                </p>
              </div>
            </div>

            {/* Detail rows */}
            <div className="space-y-3 border-t border-brand-neutral-200 pt-4">
              {/* DOB / Age */}
              <div className="flex items-start gap-3">
                <CalendarDays
                  size={15}
                  className="text-brand-neutral-400 mt-0.5 shrink-0"
                />
                <div>
                  <p
                    className="text-[12px] text-brand-neutral-500"
                    style={{ fontWeight: 500 }}
                  >
                    Date of birth
                  </p>
                  <p
                    className="text-[13px] text-brand-neutral-900 mt-0.5"
                    style={{ fontWeight: 400 }}
                  >
                    {DEPENDENT.dob} (Age {DEPENDENT.age})
                  </p>
                </div>
              </div>

              {/* Gender */}
              {DEPENDENT.gender && (
                <div className="flex items-start gap-3">
                  <UserCircle
                    size={15}
                    className="text-brand-neutral-400 mt-0.5 shrink-0"
                  />
                  <div>
                    <p
                      className="text-[12px] text-brand-neutral-500"
                      style={{ fontWeight: 500 }}
                    >
                      Gender
                    </p>
                    <p
                      className="text-[13px] text-brand-neutral-900 mt-0.5"
                      style={{ fontWeight: 400 }}
                    >
                      {DEPENDENT.gender}
                    </p>
                  </div>
                </div>
              )}

              {/* Notes preview (allergies) */}
              {DEPENDENT.allergies && (
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={15}
                    className="text-brand-neutral-400 mt-0.5 shrink-0"
                  />
                  <div>
                    <p
                      className="text-[12px] text-brand-neutral-500"
                      style={{ fontWeight: 500 }}
                    >
                      Allergies
                    </p>
                    <p
                      className="text-[13px] text-brand-neutral-900 mt-0.5"
                      style={{ fontWeight: 400 }}
                    >
                      {DEPENDENT.allergies}
                    </p>
                  </div>
                </div>
              )}

              {/* Chronic conditions */}
              {DEPENDENT.conditions && (
                <div className="flex items-start gap-3">
                  <Heart
                    size={15}
                    className="text-brand-neutral-400 mt-0.5 shrink-0"
                  />
                  <div>
                    <p
                      className="text-[12px] text-brand-neutral-500"
                      style={{ fontWeight: 500 }}
                    >
                      Chronic conditions
                    </p>
                    <p
                      className="text-[13px] text-brand-neutral-900 mt-0.5"
                      style={{ fontWeight: 400 }}
                    >
                      {DEPENDENT.conditions}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Coverage card ── */}
        <div className="px-5 pt-3">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-brand-secondary-500" />
              <h3
                className="text-[14px] text-brand-neutral-900"
                style={{ fontWeight: 600 }}
              >
                Coverage
              </h3>
            </div>
            <p
              className="text-[13px] text-brand-neutral-700"
              style={{ fontWeight: 400 }}
            >
              Uses your active packages automatically
            </p>
            <p
              className="text-[11px] text-brand-neutral-500 mt-2"
              style={{ fontWeight: 400 }}
            >
              Facilities will request approval before redeeming benefits.
            </p>
          </div>
        </div>

        {/* ── Recent care (activity preview) ── */}
        <div className="px-5 pt-3">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList size={16} className="text-brand-secondary-500" />
              <h3
                className="text-[14px] text-brand-neutral-900"
                style={{ fontWeight: 600 }}
              >
                Recent care
              </h3>
            </div>

            {/* Empty state */}
            <div className="flex flex-col items-center py-4">
              <div className="w-10 h-10 rounded-full bg-brand-neutral-100 flex items-center justify-center mb-3">
                <ClipboardList
                  size={18}
                  className="text-brand-neutral-400"
                />
              </div>
              <p
                className="text-[13px] text-brand-neutral-500 mb-4"
                style={{ fontWeight: 400 }}
              >
                No visits yet
              </p>
              <button
                onClick={() => navigate("/care-01")}
                className="h-9 px-5 bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                style={{ fontWeight: 500 }}
              >
                View in My Care
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Fixed Bottom Action Bar ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-5">
        <button
          onClick={() => navigate("/dep-03")}
          className="w-full h-11 rounded-xl text-[14px] flex items-center justify-center gap-1.5 border-[1.5px] border-brand-neutral-900 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 transition-colors"
          style={{ fontWeight: 500 }}
        >
          <Pencil size={14} />
          Edit
        </button>
      </div>
    </div>
  );
}