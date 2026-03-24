import { useNavigate } from "react-router";
import { LogOut } from "lucide-react";

export function AUTH09LogoutConfirmPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ═══════════════════════════════════════
          Centered content
         ═══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-[120px]">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-brand-warning-50 flex items-center justify-center mb-5">
          <LogOut size={32} className="text-brand-warning-500" />
        </div>

        {/* Title */}
        <h1
          className="text-[24px] tracking-[-0.01em] text-brand-neutral-900 text-center mb-2"
          style={{ fontWeight: 600, lineHeight: 1.25 }}
        >
          Log out?
        </h1>

        {/* Body */}
        <p
          className="text-[14px] text-brand-neutral-500 text-center"
          style={{ fontWeight: 400, lineHeight: 1.55 }}
        >
          You'll need your PIN to log back in.
        </p>
      </div>

      {/* ═══════════════════════════════════════
          Fixed bottom action bar
         ═══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4">
        <div className="flex items-center gap-3">
          {/* Secondary: Cancel */}
          <button
            onClick={() => navigate("/more")}
            className="flex-1 h-[48px] rounded-xl text-[15px] flex items-center justify-center border-[1.5px] bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 border-brand-neutral-900 transition-colors"
            style={{ fontWeight: 500 }}
          >
            Cancel
          </button>

          {/* Primary (destructive): Log out */}
          <button
            onClick={() => navigate("/auth-01")}
            className="flex-1 h-[48px] rounded-xl text-[15px] flex items-center justify-center border-[1.5px] bg-brand-error-50 hover:bg-brand-error-500/20 text-brand-neutral-900 border-brand-neutral-900 transition-colors"
            style={{ fontWeight: 500 }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}