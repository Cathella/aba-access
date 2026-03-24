import { useState } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import {
  SlidersHorizontal,
  CalendarDays,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";

/* ── Visit data model ── */
interface Visit {
  id: string;
  facility: string;
  patient: string;
  serviceType: "Consultation" | "Lab" | "Pharmacy";
  coverageLabel: string;
  status: "Completed";
}

interface VisitGroup {
  header: string;
  visits: Visit[];
}

/* ── Sample timeline data ── */
const sampleTimeline: VisitGroup[] = [
  {
    header: "Today",
    visits: [
      {
        id: "visit-001",
        facility: "Mukono Family Clinic",
        patient: "Ben (Dependent)",
        serviceType: "Consultation",
        coverageLabel: "Covered",
        status: "Completed",
      },
    ],
  },
  {
    header: "Yesterday",
    visits: [
      {
        id: "visit-002",
        facility: "Sunrise Diagnostics",
        patient: "Catherine",
        serviceType: "Lab",
        coverageLabel: "Covered",
        status: "Completed",
      },
    ],
  },
  {
    header: "Last week",
    visits: [
      {
        id: "visit-003",
        facility: "Divine Care Pharmacy",
        patient: "Catherine",
        serviceType: "Pharmacy",
        coverageLabel: "Discount applied",
        status: "Completed",
      },
    ],
  },
];

/* ── Service-type chip colour mapping ── */
const serviceChipStyles: Record<Visit["serviceType"], string> = {
  Consultation: "bg-brand-secondary-50 text-brand-secondary-500",
  Lab: "bg-brand-warning-50 text-brand-warning-500",
  Pharmacy: "bg-brand-success-50 text-brand-success-500",
};

export function CARE01CareHomePage() {
  const navigate = useNavigate();
  const [showSample, setShowSample] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Covered", "Out-of-pocket", "Pending"] as const;

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ App Bar (fixed top) ══ */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 border-b border-brand-neutral-200">
        <div className="px-5 pt-6 pb-3 flex items-center justify-between">
          <h2
            className="text-[22px] tracking-[-0.01em] text-brand-neutral-900"
            style={{ fontWeight: 600 }}
          >
            My Care
          </h2>
          <button className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center">
            <SlidersHorizontal size={15} className="text-brand-neutral-500" />
          </button>
        </div>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[80px]">
        {/* ── Filter chips ── */}
        <div className="px-5 pt-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map((label) => {
            const isActive = activeFilter === label;
            return (
              <button
                key={label}
                onClick={() => setActiveFilter(label)}
                className={`shrink-0 h-8 px-3.5 rounded-full text-[12px] border transition-colors ${
                  isActive
                    ? "bg-brand-neutral-900 text-brand-neutral-0 border-brand-neutral-900"
                    : "bg-brand-neutral-0 text-brand-neutral-500 border-brand-neutral-200 hover:bg-brand-neutral-200"
                }`}
                style={{ fontWeight: 500 }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* ════════════════════════════════════════════
            Section A — Empty state (default)
        ════════════════════════════════════════════ */}
        {!showSample && (
          <div className="px-5 pt-10 pb-6 flex flex-col items-center">
            {/* Icon placeholder */}
            <div className="w-16 h-16 rounded-2xl bg-brand-neutral-200 flex items-center justify-center mb-4">
              <CalendarDays size={28} className="text-brand-neutral-400" />
            </div>

            <h3
              className="text-[17px] text-brand-neutral-900 mb-1.5 text-center"
              style={{ fontWeight: 600 }}
            >
              No visits yet
            </h3>
            <p
              className="text-[13px] text-brand-neutral-500 text-center max-w-[260px] mb-6"
              style={{ fontWeight: 400 }}
            >
              Your visits will appear here after you approve facility requests.
            </p>

            {/* Primary CTA → PKG-01 */}
            <button
              onClick={() => navigate("/pkg-01")}
              className="h-10 w-full max-w-[260px] bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1 transition-colors mb-2.5"
              style={{ fontWeight: 500 }}
            >
              Browse packages
              <ChevronRight size={14} />
            </button>

            {/* Secondary CTA → APR-01 */}
            <button
              onClick={() => navigate("/apr-01")}
              className="h-10 w-full max-w-[260px] bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1 transition-colors"
              style={{ fontWeight: 500 }}
            >
              View approvals
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════════
            Section B — Sample timeline (toggled on)
        ════════════════════════════════════════════ */}
        {showSample && (
          <div className="px-5 pt-4 pb-4 space-y-5">
            {sampleTimeline.map((group) => (
              <div key={group.header}>
                {/* ── Date header ── */}
                <h4
                  className="text-[12px] text-brand-neutral-500 mb-2.5 px-0.5"
                  style={{ fontWeight: 500 }}
                >
                  {group.header}
                </h4>

                {/* ── Visit cards ── */}
                <div className="space-y-3">
                  {group.visits.map((visit) => (
                    <button
                      key={visit.id}
                      onClick={() =>
                        navigate("/care-02?id=" + visit.id)
                      }
                      className="w-full text-left bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 transition-colors active:bg-brand-neutral-100"
                    >
                      {/* Row 1 — Facility + Status chip */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3
                          className="text-[14px] text-brand-neutral-900"
                          style={{ fontWeight: 600 }}
                        >
                          {visit.facility}
                        </h3>
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] shrink-0 bg-brand-success-50 text-brand-success-500"
                          style={{ fontWeight: 500 }}
                        >
                          {visit.status}
                        </span>
                      </div>

                      {/* Row 2 — Patient */}
                      <p
                        className="text-[12px] text-brand-neutral-500 mb-2"
                        style={{ fontWeight: 400 }}
                      >
                        {visit.patient}
                      </p>

                      {/* Row 3 — Service chip + Coverage label */}
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${serviceChipStyles[visit.serviceType]}`}
                          style={{ fontWeight: 500 }}
                        >
                          {visit.serviceType}
                        </span>
                        <span
                          className="text-[11px] text-brand-neutral-500"
                          style={{ fontWeight: 400 }}
                        >
                          {visit.coverageLabel}
                        </span>
                      </div>

                      {/* CTA — View details */}
                      <div className="flex items-center justify-end gap-1 text-[13px] text-brand-primary-500">
                        <span style={{ fontWeight: 500 }}>View details</span>
                        <ChevronRight size={14} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Toggle: show / hide sample visits ── */}
        <div className="px-5 pt-2 pb-4">
          <button
            onClick={() => setShowSample((s) => !s)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-neutral-0 border border-brand-neutral-200 text-[12px] text-brand-neutral-500 transition-colors hover:bg-brand-neutral-100"
            style={{ fontWeight: 500 }}
          >
            {showSample ? (
              <>
                <EyeOff size={14} />
                Hide sample visits
              </>
            ) : (
              <>
                <Eye size={14} />
                Show sample visits
              </>
            )}
          </button>
        </div>
      </div>

      {/* ══ Bottom Navigation ══ */}
      <BottomNav activeTab="care" />
    </div>
  );
}