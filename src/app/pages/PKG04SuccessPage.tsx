import { useNavigate, useSearchParams } from "react-router";
import {
  CheckCircle2,
  X,
  Wallet,
  ChevronRight,
} from "lucide-react";

const packageData: Record<
  string,
  { displayName: string; highlights: string }
> = {
  "care-bundle-50k": {
    displayName: "Care Bundle 50K",
    highlights: "6 consult \u2022 3 lab \u2022 10% pharmacy",
  },
  "consultation-only-50k": {
    displayName: "Consultation Only 50K",
    highlights: "6 consultation visits",
  },
  "lab-only-30k": {
    displayName: "Lab Only 30K",
    highlights: "5 lab tests",
  },
  "pharmacy-only-20k": {
    displayName: "Pharmacy Only 20K",
    highlights: "10% discount (cap UGX 20,000)",
  },
};

export function PKG04SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("package") || "care-bundle-50k";
  const paymentMethod = searchParams.get("method");
  const isWalletPayment = paymentMethod === "aba-wallet";

  const pkg = packageData[packageId] || {
    displayName: packageId,
    highlights: "—",
  };

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ── Minimal close icon (top-right) ── */}
      <div className="fixed top-0 left-0 right-0 z-10 px-5 pt-6 pb-3 flex items-center justify-end">
        <button
          onClick={() => navigate("/pkg-01")}
          className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
        >
          <X size={16} className="text-brand-neutral-900" />
        </button>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col items-center px-5 pt-28 pb-20">
        {/* Success icon */}
        <div className="w-16 h-16 rounded-full bg-brand-success-50 flex items-center justify-center mb-5">
          <CheckCircle2 size={32} className="text-brand-success-500" />
        </div>

        {/* Title + body */}
        <h3
          className="text-[20px] text-brand-neutral-900 text-center mb-1.5"
          style={{ fontWeight: 600 }}
        >
          Package activated
        </h3>
        <p
          className="text-[14px] text-brand-neutral-500 text-center max-w-[280px] mb-6"
          style={{ fontWeight: 400 }}
        >
          You can now redeem care at ABA Partner facilities. Approval requests
          will appear in AbaAccess.
        </p>

        {/* ── Activated package mini card ── */}
        <div className="w-full bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 mb-6">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h4
              className="text-[15px] text-brand-neutral-900"
              style={{ fontWeight: 600 }}
            >
              {pkg.displayName}
            </h4>
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] bg-brand-success-50 text-brand-success-500 shrink-0"
              style={{ fontWeight: 500 }}
            >
              Active
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span
                className="text-[13px] text-brand-neutral-500"
                style={{ fontWeight: 400 }}
              >
                Validity
              </span>
              <span
                className="text-[13px] text-brand-neutral-900"
                style={{ fontWeight: 500 }}
              >
                Active for 30 days
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span
                className="text-[13px] text-brand-neutral-500"
                style={{ fontWeight: 400 }}
              >
                Includes
              </span>
              <span
                className="text-[13px] text-brand-neutral-900 text-right"
                style={{ fontWeight: 500 }}
              >
                {pkg.highlights}
              </span>
            </div>
          </div>
        </div>

        {/* ── Paid via Aba Wallet row ── */}
        {isWalletPayment && (
          <div className="w-full bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl px-4 py-3.5 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-primary-50 flex items-center justify-center shrink-0">
              <Wallet size={15} className="text-brand-primary-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[13px] text-brand-neutral-900"
                style={{ fontWeight: 500 }}
              >
                Paid via Aba Wallet
              </p>
            </div>
            <button
              onClick={() => navigate("/wal-04/TX-00091")}
              className="inline-flex items-center gap-1 text-[12px] text-brand-primary-500 hover:text-brand-primary-400 transition-colors shrink-0"
              style={{ fontWeight: 500 }}
            >
              View receipt
              <ChevronRight size={12} />
            </button>
          </div>
        )}

        {/* ── CTAs ── */}
        <div className="fixed bottom-0 left-0 right-0 px-5 pb-5 pt-3 bg-brand-neutral-0 border-t border-brand-neutral-200 flex gap-3">
          {/* Secondary */}
          <button
            onClick={() => navigate(`/dep-01?package=${packageId}`)}
            className="flex-1 h-12 bg-brand-neutral-0 hover:bg-brand-neutral-50 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[14px] flex items-center justify-center transition-colors"
            style={{ fontWeight: 500 }}
          >
            Add dependents
          </button>
          {/* Primary */}
          <button
            onClick={() => navigate(`/pkg-05?package=${packageId}`)}
            className="flex-1 h-12 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[14px] flex items-center justify-center transition-colors"
            style={{ fontWeight: 500 }}
          >
            View my package
          </button>
        </div>
      </div>
    </div>
  );
}