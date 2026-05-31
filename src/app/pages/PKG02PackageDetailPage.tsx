import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Users,
  ShieldCheck,
  XCircle,
} from "lucide-react";

type PackageInfo = {
  name: string;
  price: string;
  benefits: { label: string; value: string }[];
  sharing: string | null;
  exclusions: string[];
};

const PACKAGES: Record<string, PackageInfo> = {
  "care-bundle-50k": {
    name: "Care Bundle 50K",
    price: "UGX 50,000",
    benefits: [
      { label: "Consultation visits", value: "6" },
      { label: "Lab tests", value: "3" },
      { label: "Pharmacy discount", value: "10% (cap UGX 30,000)" },
    ],
    sharing: "Covers you + up to 3 dependents",
    exclusions: [
      "Admissions not covered",
      "Surgery not covered",
      "Beyond caps is out-of-pocket",
    ],
  },
  "consultation-only-50k": {
    name: "Consultation Only 50K",
    price: "UGX 50,000",
    benefits: [{ label: "Consultation visits", value: "6" }],
    sharing: "Covers you + up to 3 dependents",
    exclusions: [
      "Admissions not covered",
      "Surgery not covered",
      "Beyond caps is out-of-pocket",
    ],
  },
  "lab-only-30k": {
    name: "Lab Only 30K",
    price: "UGX 30,000",
    benefits: [{ label: "Lab tests", value: "5" }],
    sharing: null,
    exclusions: [
      "Admissions not covered",
      "Surgery not covered",
      "Beyond caps is out-of-pocket",
    ],
  },
  "pharmacy-only-20k": {
    name: "Pharmacy Only 20K",
    price: "UGX 20,000",
    benefits: [{ label: "Pharmacy discount", value: "10% (cap UGX 20,000)" }],
    sharing: null,
    exclusions: [
      "Admissions not covered",
      "Surgery not covered",
      "Beyond caps is out-of-pocket",
    ],
  },
};

const REDEMPTION_STEPS = [
  "Redemption starts at the facility.",
  "You'll receive an approval request in AbaAccess.",
  "Approve with your PIN to apply coverage.",
  "If not covered, pay out-of-pocket.",
];

export function PKG02PackageDetailPage() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const pkg = PACKAGES[packageId || ""];

  if (!pkg) {
    return (
      <div className="min-h-screen bg-brand-neutral-100 flex flex-col items-center justify-center px-5">
        <p className="text-[14px] text-brand-neutral-500 mb-4">
          Package not found.
        </p>
        <button
          onClick={() => navigate("/pkg-01")}
          className="text-[13px] text-brand-primary-500"
          style={{ fontWeight: 500 }}
        >
          Back to Packages
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-brand-neutral-100 flex flex-col">
      {/* ── App Bar ── */}
      <div className="shrink-0 bg-brand-neutral-100 px-5 pt-6 pb-3 flex items-center gap-3 border-b border-brand-neutral-200">
        <button
          onClick={() => navigate("/pkg-01")}
          className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
        >
          <ArrowLeft size={16} className="text-brand-neutral-900" />
        </button>
        <h2
          className="text-[17px] text-brand-neutral-900"
          style={{ fontWeight: 600 }}
        >
          Package Details
        </h2>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto pt-4">
        {/* Header */}
        <div className="px-5 pb-4">
          <div className="flex items-center justify-between gap-3">
            <h3
              className="text-[20px] text-brand-neutral-900"
              style={{ fontWeight: 600 }}
            >
              {pkg.name}
            </h3>
            <span
              className="shrink-0 px-3 py-1 rounded-full text-[11px] bg-brand-neutral-200 text-brand-neutral-700"
              style={{ fontWeight: 500 }}
            >
              Not purchased
            </span>
          </div>
          <p
            className="text-[14px] text-brand-neutral-700 mt-0.5"
            style={{ fontWeight: 500 }}
          >
            {pkg.price}{" "}
            <span
              className="text-brand-neutral-500"
              style={{ fontWeight: 400 }}
            >
              / 30 days
            </span>
          </p>
        </div>

        {/* Card 1: What you get */}
        <div className="px-5 pb-3">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <h4
              className="text-[13px] text-brand-neutral-900 mb-3"
              style={{ fontWeight: 600 }}
            >
              What you get
            </h4>
            <div className="space-y-3">
              {pkg.benefits.map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="text-brand-primary-500 shrink-0"
                  />
                  <div className="flex-1 flex items-baseline justify-between gap-2">
                    <span
                      className="text-[13px] text-brand-neutral-700"
                      style={{ fontWeight: 400 }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="text-[13px] text-brand-neutral-900 shrink-0"
                      style={{ fontWeight: 500 }}
                    >
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Sharing (conditional) */}
        {pkg.sharing && (
          <div className="px-5 pb-3">
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-secondary-50 flex items-center justify-center shrink-0 mt-0.5">
                  <Users size={14} className="text-brand-secondary-500" />
                </div>
                <div>
                  <h4
                    className="text-[13px] text-brand-neutral-900 mb-0.5"
                    style={{ fontWeight: 600 }}
                  >
                    Sharing
                  </h4>
                  <p
                    className="text-[13px] text-brand-neutral-700"
                    style={{ fontWeight: 400 }}
                  >
                    {pkg.sharing}
                  </p>
                  <p
                    className="text-[11px] text-brand-neutral-500 mt-1"
                    style={{ fontWeight: 400 }}
                  >
                    Add dependents after purchase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card 3: Redemption */}
        <div className="px-5 pb-3">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-primary-50 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck size={14} className="text-brand-primary-500" />
              </div>
              <div>
                <h4
                  className="text-[13px] text-brand-neutral-900 mb-2"
                  style={{ fontWeight: 600 }}
                >
                  Redemption
                </h4>
                <ul className="space-y-1.5">
                  {REDEMPTION_STEPS.map((step) => (
                    <li
                      key={step}
                      className="text-[12px] text-brand-neutral-700 flex items-start gap-2"
                      style={{ fontWeight: 400 }}
                    >
                      <span className="text-brand-neutral-300 mt-0.5 shrink-0">
                        •
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Exclusions */}
        <div className="px-5 pb-4">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-error-50 flex items-center justify-center shrink-0 mt-0.5">
                <XCircle size={14} className="text-brand-error-500" />
              </div>
              <div>
                <h4
                  className="text-[13px] text-brand-neutral-900 mb-2"
                  style={{ fontWeight: 600 }}
                >
                  Exclusions
                </h4>
                <ul className="space-y-1.5">
                  {pkg.exclusions.map((item) => (
                    <li
                      key={item}
                      className="text-[12px] text-brand-neutral-700 flex items-start gap-2"
                      style={{ fontWeight: 400 }}
                    >
                      <span className="text-brand-neutral-300 mt-0.5 shrink-0">
                        •
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="h-24" />
      </div>

      {/* ── Sticky CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 px-5 pt-3 pb-5 border-t border-brand-neutral-200">
        <button
          onClick={() => navigate(`/pkg-03?package=${packageId}`)}
          className="w-full h-12 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[14px] flex items-center justify-center transition-colors"
          style={{ fontWeight: 500 }}
        >
          Buy package
        </button>
      </div>
    </div>
  );
}
