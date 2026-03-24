import { useParams, useNavigate } from "react-router";
import { PageNav } from "../components/PageNav";
import {
  ArrowLeft,
  Home,
  Package,
  ClipboardList,
  Activity,
  Star,
  CheckCircle2,
  Users,
  Shield,
} from "lucide-react";

const packagesData: Record<
  string,
  {
    name: string;
    price: string;
    period: string;
    highlights: string[];
    tag: string | null;
    note: string | null;
    description: string;
  }
> = {
  "care-bundle-50k": {
    name: "Care Bundle 50K",
    price: "UGX 50,000",
    period: "30 days",
    highlights: [
      "6 consultation visits",
      "3 lab tests",
      "10% pharmacy discount",
    ],
    tag: "Best value",
    note: "Share with up to 3 dependents",
    description:
      "A comprehensive care package combining consultations, lab tests, and pharmacy discounts for your family.",
  },
  "consultation-only-50k": {
    name: "Consultation Only 50K",
    price: "UGX 50,000",
    period: "30 days",
    highlights: ["6 consultation visits"],
    tag: null,
    note: "Up to 3 dependents",
    description:
      "Focused on consultation visits at any ABA Partner facility. Ideal for routine check-ups and follow-ups.",
  },
  "lab-only-30k": {
    name: "Lab Only 30K",
    price: "UGX 30,000",
    period: "30 days",
    highlights: ["5 lab tests"],
    tag: null,
    note: null,
    description:
      "Covers essential lab tests at ABA Partner facilities. Perfect for monitoring and diagnostics.",
  },
  "pharmacy-only-20k": {
    name: "Pharmacy Only 20K",
    price: "UGX 20,000",
    period: "30 days",
    highlights: ["10% discount up to UGX 20,000"],
    tag: null,
    note: null,
    description:
      "Get pharmacy discounts on medications at participating ABA Partner pharmacies.",
  },
};

export function PKG02PackageDetailPage() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const pkg = packagesData[packageId || ""];

  if (!pkg) {
    return (
      <div className="min-h-screen bg-brand-neutral-100">
        <div className="px-5 pt-6 text-center">
          <p className="text-[14px] text-brand-neutral-500">
            Package not found.
          </p>
          <button
            onClick={() => navigate("/pkg-01")}
            className="mt-4 text-[13px] text-brand-secondary-500"
            style={{ fontWeight: 500 }}
          >
            Back to Packages
          </button>
        </div>
        <PageNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-neutral-100">
      {/* ── App bar ── */}
      <div className="px-5 pt-6 pb-3 flex items-center gap-3">
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

      {/* ── Hero card ── */}
      <div className="px-5 pb-3">
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-2">
            <h3
              className="text-[18px] text-brand-neutral-900"
              style={{ fontWeight: 600 }}
            >
              {pkg.name}
            </h3>
            {pkg.tag && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-brand-primary-50 text-brand-primary-500 shrink-0"
                style={{ fontWeight: 500 }}
              >
                <Star size={10} />
                {pkg.tag}
              </span>
            )}
          </div>

          <div className="mb-3">
            <span
              className="text-[22px] text-brand-neutral-900"
              style={{ fontWeight: 700 }}
            >
              {pkg.price}
            </span>
            <span
              className="text-[13px] text-brand-neutral-500 ml-1"
              style={{ fontWeight: 400 }}
            >
              / {pkg.period}
            </span>
          </div>

          <p
            className="text-[13px] text-brand-neutral-500"
            style={{ fontWeight: 400 }}
          >
            {pkg.description}
          </p>
        </div>
      </div>

      {/* ── What's included ── */}
      <div className="px-5 pb-3">
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
          <h4
            className="text-[13px] text-brand-neutral-900 mb-3"
            style={{ fontWeight: 600 }}
          >
            What's included
          </h4>
          <div className="space-y-2.5">
            {pkg.highlights.map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <CheckCircle2
                  size={16}
                  className="text-brand-primary-500 shrink-0"
                />
                <span
                  className="text-[13px] text-brand-neutral-700"
                  style={{ fontWeight: 400 }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Additional info ── */}
      {pkg.note && (
        <div className="px-5 pb-3">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-secondary-50 flex items-center justify-center shrink-0">
              <Users size={14} className="text-brand-secondary-500" />
            </div>
            <div>
              <h4
                className="text-[13px] text-brand-neutral-900"
                style={{ fontWeight: 500 }}
              >
                Dependents
              </h4>
              <p
                className="text-[12px] text-brand-neutral-500"
                style={{ fontWeight: 400 }}
              >
                {pkg.note}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Redemption info ── */}
      <div className="px-5 pb-4">
        <div className="bg-brand-secondary-50 border border-brand-neutral-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-neutral-0 flex items-center justify-center shrink-0">
            <Shield size={14} className="text-brand-secondary-500" />
          </div>
          <div>
            <h4
              className="text-[13px] text-brand-neutral-900"
              style={{ fontWeight: 500 }}
            >
              Secure redemption
            </h4>
            <p
              className="text-[12px] text-brand-neutral-500"
              style={{ fontWeight: 400 }}
            >
              Approve with your PIN at any ABA Partner facility.
            </p>
          </div>
        </div>
      </div>

      {/* ── Purchase CTA ── */}
      <div className="px-5 pb-4">
        <button
          className="w-full h-12 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[14px] flex items-center justify-center transition-colors"
          style={{ fontWeight: 500 }}
        >
          Purchase Package
        </button>
      </div>

      {/* ── Bottom Navigation ── */}
      <div className="sticky bottom-0 bg-brand-neutral-100 px-5 pt-2 pb-4">
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-xl pt-2.5 pb-1.5">
          <div className="flex items-center justify-around">
            {[
              { icon: <Home size={20} />, label: "Home", active: false },
              {
                icon: <Package size={20} />,
                label: "Packages",
                active: true,
              },
              {
                icon: <ClipboardList size={20} />,
                label: "Approvals",
                active: false,
              },
              {
                icon: <Activity size={20} />,
                label: "Tracking",
                active: false,
              },
            ].map((tab) => (
              <div
                key={tab.label}
                className={`flex flex-col items-center gap-0.5 ${
                  tab.active
                    ? "text-brand-primary-500"
                    : "text-brand-neutral-500"
                }`}
              >
                {tab.icon}
                <span
                  className="text-[10px]"
                  style={{ fontWeight: tab.active ? 500 : 400 }}
                >
                  {tab.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PageNav />
    </div>
  );
}