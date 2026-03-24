import {
  ArrowLeft,
  Users,
  UserCircle,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  AlertTriangle,
  Info,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════
   Types & Constants
   ══════════════════════════════════════════════ */

interface Dependent {
  id: string;
  name: string;
  relationship: string;
  age: number;
  status: "Active" | "Inactive";
}

const MAX_DEPENDENTS = 3;

const SAMPLE_DEPENDENTS: Dependent[] = [
  { id: "dep-a", name: "Ben", relationship: "Child", age: 6, status: "Active" },
  { id: "dep-b", name: "Anna", relationship: "Child", age: 10, status: "Active" },
];

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function DEP01DependentsListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dependents, setDependents] = useState<Dependent[]>(SAMPLE_DEPENDENTS);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  /* Pick up new dependent from DEP-02 via location state */
  useEffect(() => {
    if (location.state?.newDependent) {
      setDependents((prev) => {
        if (prev.length >= MAX_DEPENDENTS) return prev;
        const nd = location.state.newDependent as {
          name: string;
          relationship: string;
          dob: string;
          age?: number;
        };
        const age =
          nd.age ??
          (() => {
            const birth = new Date(nd.dob);
            const today = new Date();
            let a = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
            return Math.max(0, a);
          })();
        return [
          ...prev,
          {
            id: `dep-${Date.now()}`,
            name: nd.name,
            relationship: nd.relationship,
            age,
            status: "Active" as const,
          },
        ];
      });
      window.history.replaceState({}, "");
    }

    /* Pick up removal from DEP-06 via location state */
    if (location.state?.removeDependentId) {
      const removeId = location.state.removeDependentId as string;
      setDependents((prev) => prev.filter((d) => d.id !== removeId));
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  /* Persist count so DEP-02 can check the limit */
  useEffect(() => {
    sessionStorage.setItem("dep_count", String(dependents.length));
  }, [dependents]);

  /* Close overflow menu on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const count = dependents.length;
  const isEmpty = count === 0;
  const limitReached = count >= MAX_DEPENDENTS;

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ App Bar (fixed) ══ */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-brand-neutral-100 px-5 pt-6 pb-3 flex items-center justify-between border-b border-brand-neutral-200">
        <div className="flex items-center gap-3">
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
            Dependents
          </h2>
        </div>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[100px]">
        {/* ── Info banner ── */}
        <div className="px-5 pt-4">
          <div className="bg-brand-neutral-100 border border-brand-neutral-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
            <Info size={16} className="text-brand-neutral-500 mt-0.5 shrink-0" />
            <p
              className="text-[13px] text-brand-neutral-700"
              style={{ fontWeight: 400 }}
            >
              Add up to 3 dependents to share your package benefits.
            </p>
          </div>
        </div>

        {/* ── Counter ── */}
        <div className="px-5 pt-4 pb-1 flex items-center justify-between">
          <span
            className="text-[13px] text-brand-neutral-500"
            style={{ fontWeight: 500 }}
          >
            {count}/{MAX_DEPENDENTS} added
          </span>
        </div>

        {/* ── Limit-reached warning banner ── */}
        {limitReached && (
          <div className="px-5 pt-2 pb-1">
            <div className="bg-brand-warning-50 border border-[var(--brand-warning-500)] rounded-xl px-4 py-3 flex items-start gap-2.5">
              <AlertTriangle
                size={16}
                className="text-[var(--brand-warning-500)] mt-0.5 shrink-0"
              />
              <p
                className="text-[13px] text-brand-neutral-700"
                style={{ fontWeight: 400 }}
              >
                Limit reached ({MAX_DEPENDENTS}/{MAX_DEPENDENTS}). Upgrade
                options coming soon.
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
              <h3
                className="text-[17px] text-brand-neutral-900 mb-1"
                style={{ fontWeight: 600 }}
              >
                No dependents yet
              </h3>
              <p
                className="text-[13px] text-brand-neutral-500 text-center max-w-[260px] mb-5"
                style={{ fontWeight: 400 }}
              >
                Add your children or family members to use your package
                benefits.
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
                onClick={() => navigate("/dep-04")}
                className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-colors hover:bg-brand-neutral-100 relative"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-brand-secondary-50 flex items-center justify-center shrink-0">
                  <UserCircle size={20} className="text-brand-secondary-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      className="text-[14px] text-brand-neutral-900 truncate"
                      style={{ fontWeight: 600 }}
                    >
                      {dep.name}
                    </h4>
                    {/* Status chip */}
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-success-50 text-[10px] text-brand-success-500 shrink-0"
                      style={{ fontWeight: 500 }}
                    >
                      {dep.status}
                    </span>
                  </div>
                  <p
                    className="text-[12px] text-brand-neutral-500 mt-0.5"
                    style={{ fontWeight: 400 }}
                  >
                    {dep.relationship} • Age {dep.age}
                  </p>
                </div>

                {/* Chevron */}
                <ChevronRight
                  size={16}
                  className="text-brand-neutral-300 shrink-0 mr-6"
                />

                {/* Overflow menu trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === dep.id ? null : dep.id);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center hover:bg-brand-neutral-100 transition-colors"
                >
                  <MoreVertical size={16} className="text-brand-neutral-500" />
                </button>

                {/* Overflow dropdown */}
                {openMenuId === dep.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-3 top-[52px] z-30 w-40 bg-brand-neutral-0 border border-brand-neutral-200 rounded-xl shadow-lg overflow-hidden"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(null);
                        navigate("/dep-03");
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-[13px] text-brand-neutral-900 hover:bg-brand-neutral-100 transition-colors border-b border-brand-neutral-200"
                      style={{ fontWeight: 400 }}
                    >
                      <Pencil size={14} className="text-brand-neutral-500" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(null);
                        navigate("/dep-06");
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-[13px] text-brand-error-500 hover:bg-brand-error-50 transition-colors"
                      style={{ fontWeight: 400 }}
                    >
                      <Trash2 size={14} className="text-brand-error-500" />
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══ Fixed Bottom Action Bar ══ */}
      {!isEmpty && (
        <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 py-4">
          <button
            onClick={() => {
              if (!limitReached) navigate("/dep-02");
            }}
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