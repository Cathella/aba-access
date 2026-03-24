import { useNavigate } from "react-router";
import { AlertTriangle, Trash2 } from "lucide-react";

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function DEP06ConfirmRemovePage() {
  const navigate = useNavigate();

  /* Hardcoded to first sample dependent for the prototype */
  const dependentName = "Ben";
  const dependentId = "dep-a";

  const handleRemove = () => {
    navigate("/dep-01", {
      state: { removeDependentId: dependentId },
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col items-center justify-center px-5">
      {/* ── Modal card ── */}
      <div className="w-full max-w-[360px] bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-brand-error-50 flex items-center justify-center">
            <Trash2 size={22} className="text-brand-error-500" />
          </div>
        </div>

        {/* Title */}
        <h2
          className="text-[17px] text-brand-neutral-900 text-center mb-2"
          style={{ fontWeight: 600 }}
        >
          Remove dependent?
        </h2>

        {/* Body */}
        <p
          className="text-[13px] text-brand-neutral-500 text-center mb-4"
          style={{ fontWeight: 400 }}
        >
          <span
            className="text-brand-neutral-900"
            style={{ fontWeight: 500 }}
          >
            {dependentName}
          </span>{" "}
          will no longer be able to use package benefits.
        </p>

        {/* Warning note */}
        <div className="bg-brand-warning-50 rounded-xl px-4 py-3 flex items-start gap-2.5 mb-6">
          <AlertTriangle
            size={15}
            className="text-[var(--brand-warning-500)] mt-0.5 shrink-0"
          />
          <p
            className="text-[12px] text-brand-neutral-700"
            style={{ fontWeight: 400 }}
          >
            This won't delete past care history.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          {/* Primary – Destructive */}
          <button
            onClick={handleRemove}
            className="w-full h-11 rounded-xl text-[14px] flex items-center justify-center gap-1.5 bg-brand-error-500 hover:bg-brand-error-600 text-brand-neutral-0 transition-colors"
            style={{ fontWeight: 500 }}
          >
            <Trash2 size={14} />
            Remove
          </button>

          {/* Secondary – Cancel */}
          <button
            onClick={() => navigate(-1)}
            className="w-full h-11 rounded-xl text-[14px] flex items-center justify-center bg-brand-neutral-200 hover:bg-brand-neutral-300 text-brand-neutral-900 transition-colors"
            style={{ fontWeight: 500 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
