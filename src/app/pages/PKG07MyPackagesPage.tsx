import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronRight,
} from "lucide-react";
import { BottomNav } from "../components/BottomNav";

/* ── Tab options ── */
const tabs = ["Active", "Expired"] as const;
type Tab = (typeof tabs)[number];

export function PKG07MyPackagesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("Active");

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ── App Bar (fixed top) ── */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <div className="flex items-center gap-3">
          <h2
            className="text-[17px] text-brand-neutral-900"
            style={{ fontWeight: 600 }}
          >
            My Packages
          </h2>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[80px] px-5">
        {/* ── Tabs ── */}
        <div className="flex mt-3 mb-1 gap-2">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-[13px] text-center transition-colors rounded-full ${
                  isActive
                    ? "bg-brand-neutral-900 text-brand-neutral-0"
                    : "text-brand-neutral-500"
                }`}
                style={{ fontWeight: isActive ? 600 : 400 }}
              >
                {tab} packages
              </button>
            );
          })}
        </div>

        {activeTab === "Active" && (
          <div className="mt-4 space-y-3">
            {/* ── Active package card ── */}
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h3
                  className="text-[15px] text-brand-neutral-900"
                  style={{ fontWeight: 600 }}
                >
                  Care Bundle 50K
                </h3>
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] bg-brand-success-50 text-brand-success-500 shrink-0"
                  style={{ fontWeight: 500 }}
                >
                  Active
                </span>
              </div>

              <p
                className="text-[12px] text-brand-neutral-500 mb-1"
                style={{ fontWeight: 400 }}
              >
                6 consult visits • 3 lab tests • 10% pharmacy discount
              </p>

              <p
                className="text-[12px] text-brand-neutral-500 mb-3"
                style={{ fontWeight: 400 }}
              >
                Valid 18 Feb 2026 – 20 Mar 2026
              </p>

              <button
                onClick={() =>
                  navigate("/pkg-05?package=care-bundle-50k")
                }
                className="w-full mt-1 pt-3 border-t border-brand-neutral-200 text-brand-primary-500 hover:text-brand-primary-600 text-[13px] flex items-center justify-center gap-1 transition-colors"
                style={{ fontWeight: 500 }}
              >
                View usage
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {activeTab === "Expired" && (
          <div className="mt-4 space-y-3">
            {/* ── Expired package card ── */}
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h3
                  className="text-[15px] text-brand-neutral-900"
                  style={{ fontWeight: 600 }}
                >
                  Consultation Only 50K
                </h3>
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] bg-brand-neutral-200 text-brand-neutral-500 shrink-0"
                  style={{ fontWeight: 500 }}
                >
                  Expired
                </span>
              </div>

              <p
                className="text-[12px] text-brand-neutral-500 mb-1"
                style={{ fontWeight: 400 }}
              >
                6 consultation visits
              </p>

              <p
                className="text-[12px] text-brand-neutral-500 mb-3"
                style={{ fontWeight: 400 }}
              >
                Expired 17 Jan 2026
              </p>

              <div className="border-t border-brand-neutral-200 pt-3">
                <button
                  onClick={() =>
                    navigate("/pkg-03?package=consultation-only-50k")
                  }
                  className="w-full text-[13px] text-brand-primary-500 hover:text-brand-primary-400 flex items-center justify-center gap-1 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  Renew
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Navigation (fixed) ── */}
      <BottomNav activeTab="packages" />
    </div>
  );
}