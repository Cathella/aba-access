import {
  ArrowLeft,
  Users,
  UserCircle,
  Plus,
  AlertTriangle,
  Info,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

type Dependent = {
  id: string;
  full_name: string;
  relationship: string;
  dob: string;
};

const MAX_DEPENDENTS = 3;

function computeAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return Math.max(0, age);
}

export function DEP01DependentsListPage() {
  const navigate = useNavigate();
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("dependents")
      .select("id, full_name, relationship, dob")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setDependents(data ?? []);
        setLoading(false);
      });
  }, []);

  const count = dependents.length;
  const isEmpty = count === 0;
  const limitReached = count >= MAX_DEPENDENTS;

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ App Bar (fixed) ══ */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-brand-neutral-100 px-5 pt-6 pb-3 flex items-center gap-3 border-b border-brand-neutral-200">
        <button
          onClick={() => navigate("/home-01")}
          className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
        >
          <ArrowLeft size={16} className="text-brand-neutral-900" />
        </button>
        <h2
          className="text-[17px] text-brand-neutral-900"
          style={{ fontWeight: 600 }}
        >
          Dependents
        </h2>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[100px]">
        {/* ── Info banner ── */}
        <div className="px-5 pt-4">
          <div className="bg-brand-neutral-100 border border-brand-neutral-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
            <Info size={16} className="text-brand-neutral-500 mt-0.5 shrink-0" />
            <p className="text-[13px] text-brand-neutral-700" style={{ fontWeight: 400 }}>
              Add up to 3 dependents to share your package benefits.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center mt-10">
            <div className="w-5 h-5 rounded-full border-2 border-brand-primary-500 border-t-transparent animate-spin" />
          </div>
        ) : (
          <>
            {/* ── Counter ── */}
            <div className="px-5 pt-4 pb-1">
              <span className="text-[13px] text-brand-neutral-500" style={{ fontWeight: 500 }}>
                {count}/{MAX_DEPENDENTS} added
              </span>
            </div>

            {/* ── Limit-reached warning ── */}
            {limitReached && (
              <div className="px-5 pt-2 pb-1">
                <div className="bg-brand-warning-50 border border-[var(--brand-warning-500)] rounded-xl px-4 py-3 flex items-start gap-2.5">
                  <AlertTriangle size={16} className="text-[var(--brand-warning-500)] mt-0.5 shrink-0" />
                  <p className="text-[13px] text-brand-neutral-700" style={{ fontWeight: 400 }}>
                    Limit reached ({MAX_DEPENDENTS}/{MAX_DEPENDENTS}). Upgrade options coming soon.
                  </p>
                </div>
              </div>
            )}

            {isEmpty ? (
              /* ══ Empty state ══ */
              <div className="px-5 pt-3">
                <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[260px]">
                  <div className="w-14 h-14 rounded-full bg-brand-secondary-50 flex items-center justify-center mb-4">
                    <Users size={24} className="text-brand-secondary-500" />
                  </div>
                  <h3 className="text-[17px] text-brand-neutral-900 mb-1" style={{ fontWeight: 600 }}>
                    No dependents yet
                  </h3>
                  <p className="text-[13px] text-brand-neutral-500 text-center max-w-[260px] mb-5" style={{ fontWeight: 400 }}>
                    Add your children or family members to use your package benefits.
                  </p>
                  <button
                    onClick={() => navigate("/dep-02")}
                    className="h-10 px-6 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    <Plus size={14} />
                    Add dependent
                  </button>
                </div>
              </div>
            ) : (
              /* ══ List state ══ */
              <div className="px-5 pt-2 space-y-3">
                {dependents.map((dep) => (
                  <div
                    key={dep.id}
                    onClick={() => navigate(`/dep-04?id=${dep.id}`)}
                    className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-colors hover:bg-brand-neutral-100"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-brand-secondary-50 flex items-center justify-center shrink-0">
                      <UserCircle size={20} className="text-brand-secondary-500" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[14px] text-brand-neutral-900 truncate" style={{ fontWeight: 600 }}>
                          {dep.full_name}
                        </h4>
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-success-50 text-[10px] text-brand-success-500 shrink-0"
                          style={{ fontWeight: 500 }}
                        >
                          Active
                        </span>
                      </div>
                      <p className="text-[12px] text-brand-neutral-500 mt-0.5" style={{ fontWeight: 400 }}>
                        {dep.relationship} • Age {computeAge(dep.dob)}
                      </p>
                    </div>

                    {/* Chevron */}
                    <ChevronRight size={16} className="text-brand-neutral-300 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ══ Fixed Bottom Action Bar ══ */}
      {!isEmpty && !loading && (
        <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 py-4">
          <button
            onClick={() => { if (!limitReached) navigate("/dep-02"); }}
            disabled={limitReached}
            className={`w-full h-11 rounded-xl text-[14px] flex items-center justify-center gap-1.5 border-[1.5px] transition-colors ${
              limitReached
                ? "bg-brand-neutral-200 text-brand-neutral-500 border-brand-neutral-300 cursor-not-allowed"
                : "bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-brand-neutral-900"
            }`}
            style={{ fontWeight: 500 }}
          >
            <Plus size={14} />
            Add dependent
          </button>
        </div>
      )}
    </div>
  );
}
