import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Wallet,
  Smartphone,
  Clock,
  AlertCircle,
  AlertTriangle,
  ChevronRight,
  ArrowDownLeft,
} from "lucide-react";

const packageDetails: Record<
  string,
  {
    displayName: string;
    price: string;
    sharing: string;
    backRoute: string;
  }
> = {
  "care-bundle-50k": {
    displayName: "Care Bundle 50K",
    price: "UGX 50,000",
    sharing: "Up to 3 dependents",
    backRoute: "/pkg-02a",
  },
  "consultation-only-50k": {
    displayName: "Consultation Only 50K",
    price: "UGX 50,000",
    sharing: "Up to 3 dependents",
    backRoute: "/pkg-02b",
  },
  "lab-only-30k": {
    displayName: "Lab Only 30K",
    price: "UGX 30,000",
    sharing: "—",
    backRoute: "/pkg-02c",
  },
  "pharmacy-only-20k": {
    displayName: "Pharmacy Only 20K",
    price: "UGX 20,000",
    sharing: "—",
    backRoute: "/pkg-02d",
  },
};

type PaymentMethod = "aba-wallet" | "mobile-money" | "pay-later";

/* Parse "UGX 50,000" → 50000 */
function parsePrice(s: string): number {
  return Number(s.replace(/[^0-9]/g, "")) || 0;
}

const paymentOptions: {
  id: PaymentMethod;
  label: string;
  caption: string;
  badge: string | null;
  icon: React.ReactNode;
}[] = [
  {
    id: "aba-wallet",
    label: "Aba Wallet",
    caption: "Fastest approval experience",
    badge: "Recommended",
    icon: <Wallet size={16} />,
  },
  {
    id: "mobile-money",
    label: "Mobile Money",
    caption: "MTN/Airtel (coming soon)",
    badge: null,
    icon: <Smartphone size={16} />,
  },
  {
    id: "pay-later",
    label: "Pay later",
    caption: "Activate after payment",
    badge: "Optional",
    icon: <Clock size={16} />,
  },
];

export function PKG03CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("package") || "care-bundle-50k";

  const pkg = packageDetails[packageId] || {
    displayName: packageId,
    price: "—",
    sharing: "—",
    backRoute: "/pkg-01",
  };

  const [selectedPayment, setSelectedPayment] =
    useState<PaymentMethod>("aba-wallet");
  const [agreed, setAgreed] = useState(false);
  const [showError, setShowError] = useState(false);
  const [simulateFunds, setSimulateFunds] = useState(false);

  /* Wallet balance logic */
  const walletBalance = simulateFunds ? 200_000 : 0;
  const packagePrice = parsePrice(pkg.price);
  const isWalletSelected = selectedPayment === "aba-wallet";
  const insufficientFunds = isWalletSelected && walletBalance < packagePrice;

  const handleConfirm = () => {
    if (insufficientFunds) return;
    if (!agreed) {
      setShowError(true);
      return;
    }
    setShowError(false);
    const methodParam = isWalletSelected ? "&method=aba-wallet" : "";
    navigate(`/pkg-04?package=${packageId}${methodParam}`);
  };

  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 30);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-UG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ── App Bar (fixed top) ── */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 flex items-center gap-3 border-b border-brand-neutral-200">
        <button
          onClick={() => navigate(pkg.backRoute)}
          className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
        >
          <ArrowLeft size={16} className="text-brand-neutral-900" />
        </button>
        <h2
          className="text-[17px] text-brand-neutral-900"
          style={{ fontWeight: 600 }}
        >
          Checkout
        </h2>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto pt-24 pb-40 px-5">
        {/* ── 1) Order Summary ── */}
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 mb-3">
          <h4
            className="text-[13px] text-brand-neutral-900 mb-3"
            style={{ fontWeight: 600 }}
          >
            Order summary
          </h4>

          <div className="space-y-2.5">
            {[
              { label: "Package", value: pkg.displayName },
              { label: "Price", value: pkg.price },
              { label: "Validity", value: "30 days" },
              { label: "Sharing", value: pkg.sharing },
              { label: "Start date", value: `Today — ${formatDate(today)}` },
              { label: "End date", value: formatDate(endDate) },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-3"
              >
                <span
                  className="text-[13px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  {row.label}
                </span>
                <span
                  className="text-[13px] text-brand-neutral-900 text-right shrink-0"
                  style={{ fontWeight: 500 }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 2) Payment Method ── */}
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 mb-3">
          <h4
            className="text-[13px] text-brand-neutral-900 mb-3"
            style={{ fontWeight: 600 }}
          >
            Payment method
          </h4>

          <div className="space-y-2">
            {paymentOptions.map((option) => {
              const isSelected = selectedPayment === option.id;
              const isDisabled = option.id === "mobile-money";
              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => setSelectedPayment(option.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-colors text-left ${
                    isSelected
                      ? "border-brand-neutral-900 bg-brand-neutral-50"
                      : "border-brand-neutral-200 bg-brand-neutral-0"
                  } ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {/* Radio circle */}
                  <div
                    className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? "border-brand-neutral-900"
                        : "border-brand-neutral-300"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-neutral-900" />
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[13px] text-brand-neutral-900"
                        style={{ fontWeight: 500 }}
                      >
                        {option.label}
                      </span>
                      {option.badge && (
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-brand-primary-50 text-brand-primary-500"
                          style={{ fontWeight: 500 }}
                        >
                          {option.badge}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-[12px] text-brand-neutral-500 mt-0.5"
                      style={{ fontWeight: 400 }}
                    >
                      {option.caption}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 2b) Wallet balance row (Aba Wallet only) ── */}
        {isWalletSelected && (
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[13px] text-brand-neutral-500"
                style={{ fontWeight: 400 }}
              >
                Wallet balance
              </span>
              <span
                className={`text-[14px] ${
                  insufficientFunds
                    ? "text-brand-warning-500"
                    : "text-brand-neutral-900"
                }`}
                style={{ fontWeight: 600 }}
              >
                UGX {walletBalance.toLocaleString("en-UG")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/wal-02")}
                className="inline-flex items-center gap-1 text-[12px] text-brand-primary-500 hover:text-brand-primary-400 transition-colors"
                style={{ fontWeight: 500 }}
              >
                <ArrowDownLeft size={12} />
                Top up
              </button>
              <span className="text-brand-neutral-200">|</span>
              <button
                type="button"
                onClick={() => navigate("/wal-01")}
                className="inline-flex items-center gap-1 text-[12px] text-brand-primary-500 hover:text-brand-primary-400 transition-colors"
                style={{ fontWeight: 500 }}
              >
                View wallet
                <ChevronRight size={12} />
              </button>
            </div>

            {/* Prototype helper: simulate funds toggle */}
            <div className="mt-3 pt-3 border-t border-dashed border-brand-neutral-200">
              <button
                type="button"
                onClick={() => setSimulateFunds(!simulateFunds)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                  simulateFunds
                    ? "bg-brand-success-50 text-brand-success-500"
                    : "bg-brand-neutral-100 text-brand-neutral-500"
                }`}
                style={{ fontWeight: 500 }}
              >
                <div
                  className={`w-3 h-3 rounded-full border ${
                    simulateFunds
                      ? "bg-brand-success-500 border-brand-success-500"
                      : "bg-brand-neutral-0 border-brand-neutral-300"
                  }`}
                />
                {simulateFunds ? "Funds simulated" : "Simulate funds"}
              </button>
            </div>
          </div>
        )}

        {/* ── 2c) Insufficient funds banner ── */}
        {insufficientFunds && (
          <div className="bg-brand-warning-50 border border-brand-warning-500/25 rounded-xl px-4 py-3 flex items-start gap-2.5 mb-3">
            <AlertTriangle
              size={16}
              className="text-brand-warning-500 shrink-0 mt-0.5"
            />
            <p
              className="text-[13px] text-brand-neutral-900"
              style={{ fontWeight: 500 }}
            >
              Insufficient wallet balance. Please top up to continue.
            </p>
          </div>
        )}

        {/* ── 3) Agreement ── */}
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 mb-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (e.target.checked) setShowError(false);
                }}
                className="sr-only peer"
              />
              <div
                className={`w-[18px] h-[18px] rounded-[4px] border-[1.5px] flex items-center justify-center transition-colors ${
                  agreed
                    ? "bg-brand-neutral-900 border-brand-neutral-900"
                    : "bg-brand-neutral-0 border-brand-neutral-300"
                }`}
              >
                {agreed && (
                  <svg
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span
              className="text-[13px] text-brand-neutral-700"
              style={{ fontWeight: 400 }}
            >
              I agree to the{" "}
              <a
                href="#terms"
                onClick={(e) => e.stopPropagation()}
                className="underline text-brand-primary-500"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="#privacy"
                onClick={(e) => e.stopPropagation()}
                className="underline text-brand-primary-500"
              >
                Privacy Policy
              </a>
            </span>
          </label>
        </div>

        {/* ── Error banner ── */}
        {showError && (
          <div className="bg-brand-error-50 border border-brand-error-200 rounded-xl px-4 py-3 flex items-start gap-2.5 mb-3">
            <AlertCircle
              size={16}
              className="text-brand-error-500 shrink-0 mt-0.5"
            />
            <p
              className="text-[13px] text-brand-error-500"
              style={{ fontWeight: 500 }}
            >
              Please accept Terms to continue.
            </p>
          </div>
        )}
      </div>

      {/* ── Sticky CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 px-5 pt-3 pb-5 border-t border-brand-neutral-200">
        <button
          onClick={handleConfirm}
          disabled={insufficientFunds}
          className={`w-full h-12 border-[1.5px] rounded-xl text-[14px] flex items-center justify-center transition-colors ${
            insufficientFunds
              ? "bg-brand-neutral-100 text-brand-neutral-400 border-brand-neutral-200 cursor-not-allowed"
              : "bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-brand-neutral-900"
          }`}
          style={{ fontWeight: 500 }}
        >
          Confirm purchase
        </button>
      </div>
    </div>
  );
}