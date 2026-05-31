import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ChevronRight,
  Star,
  Info,
} from "lucide-react";
import { useState } from "react";

const filterChips = ["All", "Care Bundle", "Consultation", "Lab", "Pharmacy"];

const packages = [
  {
    id: "care-bundle-50k",
    name: "Care Bundle 50K",
    category: "Care Bundle",
    price: "UGX 50,000",
    period: "30 days",
    highlights: "6 consult visits • 3 lab tests • 10% pharmacy discount",
    tag: "Best value",
    note: "Share with up to 3 dependents",
  },
  {
    id: "consultation-only-50k",
    name: "Consultation Only 50K",
    category: "Consultation",
    price: "UGX 50,000",
    period: "30 days",
    highlights: "6 consultation visits",
    tag: null,
    note: "Up to 3 dependents",
  },
  {
    id: "lab-only-30k",
    name: "Lab Only 30K",
    category: "Lab",
    price: "UGX 30,000",
    period: "30 days",
    highlights: "5 lab tests",
    tag: null,
    note: null,
  },
  {
    id: "pharmacy-only-20k",
    name: "Pharmacy Only 20K",
    category: "Pharmacy",
    price: "UGX 20,000",
    period: "30 days",
    highlights: "10% discount up to UGX 20,000",
    tag: null,
    note: null,
  },
];

export function PKG01PackagesHomePage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredPackages =
    activeFilter === "All"
      ? packages
      : packages.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ── A) Header (fixed) ── */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center shrink-0"
          >
            <ArrowLeft size={16} className="text-brand-neutral-900" />
          </button>
          <h2
            className="text-[17px] text-brand-neutral-900 flex-1"
            style={{ fontWeight: 600 }}
          >
            Packages
          </h2>
          <button
            onClick={() => navigate("/pkg-07")}
            className="shrink-0 text-[13px] text-brand-primary-500"
            style={{ fontWeight: 500 }}
          >
            My packages
          </button>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-6">
        {/* ── B) Filter chips ── */}
        <div className="px-5 pt-3 pb-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {filterChips.map((chip) => (
              <button
                key={chip}
                onClick={() => setActiveFilter(chip)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] whitespace-nowrap shrink-0 transition-colors ${
                  activeFilter === chip
                    ? "bg-brand-neutral-900 text-brand-neutral-0"
                    : "bg-brand-neutral-0 text-brand-neutral-500 border border-brand-neutral-200"
                }`}
                style={{ fontWeight: 500 }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* ── D) Package cards ── */}
        <div className="px-5 space-y-3 pb-4">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4"
            >
              {/* Title + Tag */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3
                  className="text-[15px] text-brand-neutral-900"
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

              {/* Price */}
              <div
                className="text-[13px] text-brand-neutral-700 mb-2"
                style={{ fontWeight: 500 }}
              >
                {pkg.price}{" "}
                <span
                  className="text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  / {pkg.period}
                </span>
              </div>

              {/* Highlights */}
              <p
                className="text-[12px] text-brand-neutral-500 mb-1.5"
                style={{ fontWeight: 400 }}
              >
                {pkg.highlights}
              </p>

              {/* Note */}
              {pkg.note && (
                <p
                  className="text-[11px] text-brand-neutral-500 mb-3"
                  style={{ fontWeight: 400 }}
                >
                  {pkg.note}
                </p>
              )}

              {/* CTA */}
              <button
                onClick={() => navigate(`/pkg-02/${pkg.id}`)}
                className="w-full mt-1 pt-3 border-t border-brand-neutral-200 text-brand-primary-500 hover:text-brand-primary-600 text-[13px] flex items-center justify-center gap-1 transition-colors"
                style={{ fontWeight: 500 }}
              >
                View details
                <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* ── E) Helper info card ── */}
        <div className="px-5 pb-4">
          <div className="bg-brand-secondary-50 border border-brand-neutral-200 rounded-2xl p-4 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-neutral-0 flex items-center justify-center shrink-0">
              <Info size={16} className="text-brand-secondary-500" />
            </div>
            <div>
              <h4
                className="text-[13px] text-brand-neutral-900 mb-0.5"
                style={{ fontWeight: 600 }}
              >
                How redemption works
              </h4>
              <p
                className="text-[12px] text-brand-neutral-500"
                style={{ fontWeight: 400 }}
              >
                Facilities request approval. You approve with PIN. Coverage
                applies automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}