import { useNavigate } from "react-router";
import { CircleCheck } from "lucide-react";

const valueBullets = [
  "Buy health packages",
  "Approve Facility Requests",
  "Track visits, results, and receipts",
];

export function AUTH01WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col relative">
      {/* ═══════════════════════════════════════
          A) Top brand area
         ═══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-6">
        {/* Logo placeholder */}
        <div className="w-[56px] h-[56px] rounded-2xl bg-brand-primary-500 flex items-center justify-center mb-5">
          <span
            className="text-[22px] text-brand-neutral-0"
            style={{ fontWeight: 700, lineHeight: 1 }}
          >
            A
          </span>
        </div>

        {/* Wordmark */}
        <h1
          className="text-[26px] tracking-[-0.02em] text-brand-neutral-900 text-center mb-2"
          style={{ fontWeight: 600, lineHeight: 1.15 }}
        >Aba Access</h1>

        {/* Tagline */}
        <p
          className="text-[14px] text-brand-neutral-500 text-center max-w-[280px]"
          style={{ fontWeight: 400, lineHeight: 1.55 }}
        >
          Prepay care. Approve with PIN. Track your visits.
        </p>

        {/* ═══════════════════════════════════════
            B) Value bullets
           ═══════════════════════════════════════ */}
        <div className="mt-10 space-y-4 mx-auto w-fit">
          {valueBullets.map((text) => (
            <div
              key={text}
              className="flex items-center gap-3"
            >
              <CircleCheck size={20} className="text-brand-success-500 shrink-0" />
              <p
                className="text-[14px] text-brand-neutral-900"
                style={{ fontWeight: 400, lineHeight: 1.4 }}
              >
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          C) Sticky bottom actions + D) Trust note
         ═══════════════════════════════════════ */}
      <div className="sticky bottom-0 bg-brand-neutral-100 px-5 pb-4 pt-4">
        {/* Primary — Create account */}
        <button
          onClick={() => navigate("/auth-02?mode=signup")}
          className="w-full h-[48px] bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[15px] flex items-center justify-center transition-colors mb-3"
          style={{ fontWeight: 500 }}
        >
          Create account
        </button>

        {/* Secondary outline — Log in */}
        <button
          onClick={() => navigate("/auth-02?mode=login")}
          className="w-full h-[48px] bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[15px] flex items-center justify-center transition-colors"
          style={{ fontWeight: 500 }}
        >
          Log in
        </button>

        {/* D) Trust note */}
        <p
          className="text-brand-neutral-500 text-center mt-5 px-4 text-[12px]"
          style={{ fontWeight: 400, lineHeight: 1.55 }}
        >
          Your ABA Member ID helps facilities confirm your account.
        </p>
      </div>
    </div>
  );
}