import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Stethoscope,
  TestTubes,
  Pill,
  Users,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

/* ── Package data keyed by slug ── */
const packageData: Record<
  string,
  {
    displayName: string;
    usage: { label: string; icon: React.ReactNode; remaining: number; total: number; unit: string; note?: string }[];
  }
> = {
  "care-bundle-50k": {
    displayName: "Care Bundle 50K",
    usage: [
      { label: "Consultation visits", icon: <Stethoscope size={18} />, remaining: 6, total: 6, unit: "visits" },
      { label: "Lab tests", icon: <TestTubes size={18} />, remaining: 3, total: 3, unit: "tests" },
      { label: "Pharmacy cap", icon: <Pill size={18} />, remaining: 30000, total: 30000, unit: "UGX", note: "monthly" },
    ],
  },
  "consultation-only-50k": {
    displayName: "Consultation Only 50K",
    usage: [
      { label: "Consultation visits", icon: <Stethoscope size={18} />, remaining: 6, total: 6, unit: "visits" },
    ],
  },
  "lab-only-30k": {
    displayName: "Lab Only 30K",
    usage: [
      { label: "Lab tests", icon: <TestTubes size={18} />, remaining: 5, total: 5, unit: "tests" },
    ],
  },
  "pharmacy-only-20k": {
    displayName: "Pharmacy Only 20K",
    usage: [
      { label: "Pharmacy cap", icon: <Pill size={18} />, remaining: 20000, total: 20000, unit: "UGX", note: "monthly" },
    ],
  },
};

function formatNumber(n: number) {
  return n >= 1000 ? `UGX ${n.toLocaleString()}` : String(n);
}

export function PKG05PackageDashboardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("package") || "care-bundle-50k";

  const pkg = packageData[packageId] || packageData["care-bundle-50k"];

  /* Read dependent count from sessionStorage (kept in sync by DEP-01) */
  const [depCount, setDepCount] = useState(() => {
    const stored = sessionStorage.getItem("dep_count");
    return stored !== null ? Number(stored) : 2; // default sample count
  });

  /* Re-read on focus (returning from DEP flow) */
  useEffect(() => {
    const sync = () => {
      const stored = sessionStorage.getItem("dep_count");
      if (stored !== null) setDepCount(Number(stored));
    };
    window.addEventListener("focus", sync);
    // also sync on mount / navigation back
    sync();
    return () => window.removeEventListener("focus", sync);
  }, []);

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ── App Bar (fixed top) ── */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 flex items-center gap-3 border-b border-brand-neutral-200">
        <button
          onClick={() => navigate("/pkg-07")}
          className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
        >
          <ArrowLeft size={16} className="text-brand-neutral-900" />
        </button>
        <h2
          className="text-[17px] text-brand-neutral-900"
          style={{ fontWeight: 600 }}
        >
          My Package
        </h2>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[80px] px-5">
        {/* ── 1) Header card ── */}
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 mt-4 mb-3">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3
              className="text-[17px] text-brand-neutral-900"
              style={{ fontWeight: 600 }}
            >
              {pkg.displayName}
            </h3>
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] bg-brand-success-50 text-brand-success-500 shrink-0"
              style={{ fontWeight: 500 }}
            >
              Active
            </span>
          </div>
          <p
            className="text-[13px] text-brand-neutral-500"
            style={{ fontWeight: 400 }}
          >
            Valid 18 Feb 2026 – 20 Mar 2026
          </p>
        </div>

        {/* ── 2) Usage section ── */}
        <div className="mb-3">
          <h4
            className="text-[13px] text-brand-neutral-500 mb-2 px-0.5"
            style={{ fontWeight: 500 }}
          >
            Usage
          </h4>
          <div className="space-y-2.5">
            {pkg.usage.map((item) => {
              const isCurrency = item.unit === "UGX";
              const pct = item.total > 0 ? (item.remaining / item.total) * 100 : 0;

              return (
                <div
                  key={item.label}
                  className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4"
                >
                  {/* Top row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-primary-50 flex items-center justify-center text-brand-primary-500">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[13px] text-brand-neutral-900"
                        style={{ fontWeight: 500 }}
                      >
                        {item.label}
                      </span>
                      {item.note && (
                        <span
                          className="ml-1.5 text-[11px] text-brand-neutral-500"
                          style={{ fontWeight: 400 }}
                        >
                          ({item.note})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-brand-neutral-200 rounded-full mb-2">
                    <div
                      className="h-2 rounded-full bg-brand-primary-300 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Bottom label */}
                  <div className="flex items-baseline justify-between">
                    <span
                      className="text-[13px] text-brand-neutral-900"
                      style={{ fontWeight: 500 }}
                    >
                      {isCurrency ? formatNumber(item.remaining) : item.remaining}{" "}
                      <span
                        className="text-brand-neutral-500"
                        style={{ fontWeight: 400 }}
                      >
                        remaining
                      </span>
                    </span>
                    <span
                      className="text-[12px] text-brand-neutral-500"
                      style={{ fontWeight: 400 }}
                    >
                      / {isCurrency ? formatNumber(item.total) : `${item.total} ${item.unit}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 3) Household card ── */}
        <div className="mb-3">
          <h4
            className="text-[13px] text-brand-neutral-500 mb-2 px-0.5"
            style={{ fontWeight: 500 }}
          >
            Household
          </h4>
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-brand-secondary-50 flex items-center justify-center text-brand-secondary-500">
                <Users size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className="text-[13px] text-brand-neutral-900"
                  style={{ fontWeight: 500 }}
                >
                  Dependents: {depCount}/3
                </span>
              </div>
            </div>
            {depCount === 0 && (
              <p
                className="text-[12px] text-brand-neutral-500 mb-3"
                style={{ fontWeight: 400 }}
              >
                Add dependents to share coverage.
              </p>
            )}
            <div className="border-t border-brand-neutral-200 pt-3">
              <button
                onClick={() => navigate("/dep-01")}
                className="w-full text-[13px] text-brand-primary-500 hover:text-brand-primary-400 flex items-center justify-center transition-colors"
                style={{ fontWeight: 500 }}
              >
                Manage dependents
              </button>
            </div>
          </div>
        </div>

        {/* ── 4) Recent activity card ── */}
        <div className="mb-4">
          <h4
            className="text-[13px] text-brand-neutral-500 mb-2 px-0.5"
            style={{ fontWeight: 500 }}
          >
            Recent activity
          </h4>
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-brand-neutral-100 flex items-center justify-center text-brand-neutral-500">
                <Clock size={18} />
              </div>
              <span
                className="text-[13px] text-brand-neutral-500"
                style={{ fontWeight: 400 }}
              >
                No redemptions yet
              </span>
            </div>
            <button
              onClick={() => navigate(`/pkg-06?package=${packageId}`)}
              className="w-full flex items-center justify-between py-2 border-t border-brand-neutral-200 pt-3 mt-1"
            >
              <span
                className="text-[13px] text-brand-primary-500"
                style={{ fontWeight: 500 }}
              >
                View usage history
              </span>
              <ChevronRight size={16} className="text-brand-primary-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}