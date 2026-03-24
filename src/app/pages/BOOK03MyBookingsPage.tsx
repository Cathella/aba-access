import { useNavigate } from "react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Stethoscope,
  FlaskConical,
  Pill,
  ChevronRight,
  CalendarPlus,
  CalendarX2,
  Clock,
  CheckCircle2,
  CircleCheckBig,
} from "lucide-react";
import { BottomNav } from "../components/BottomNav";

/* ══════════════════════════════════════════════
   Types & data
   ══════════════════════════════════════════════ */

type Tab = "Upcoming" | "Past";

interface Booking {
  id: string;
  facility: string;
  patient: string;
  service: string;
  dateTime: string;
  status: "Pending confirmation" | "Confirmed" | "Completed";
  icon: typeof Stethoscope;
  tab: Tab;
}

const bookings: Booking[] = [
  /* ── Upcoming ── */
  {
    id: "B-00021",
    facility: "Mukono Family Clinic",
    patient: "Ben",
    service: "Consultation",
    dateTime: "Tomorrow · Morning",
    status: "Pending confirmation",
    icon: Stethoscope,
    tab: "Upcoming",
  },
  {
    id: "B-00019",
    facility: "Sunrise Diagnostics",
    patient: "Catherine",
    service: "Lab",
    dateTime: "Fri · Afternoon",
    status: "Confirmed",
    icon: FlaskConical,
    tab: "Upcoming",
  },

  /* ── Past ── */
  {
    id: "B-00014",
    facility: "Divine Care Pharmacy",
    patient: "Catherine",
    service: "Pharmacy",
    dateTime: "12 Feb 2026",
    status: "Completed",
    icon: Pill,
    tab: "Past",
  },
];

/* Status chip config */
const statusConfig: Record<
  Booking["status"],
  { bg: string; text: string; icon: typeof Clock }
> = {
  "Pending confirmation": {
    bg: "bg-brand-neutral-100",
    text: "text-brand-neutral-600",
    icon: Clock,
  },
  Confirmed: {
    bg: "bg-brand-success-50",
    text: "text-brand-success-500",
    icon: CheckCircle2,
  },
  Completed: {
    bg: "bg-brand-success-50",
    text: "text-brand-success-500",
    icon: CircleCheckBig,
  },
};

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function BOOK03MyBookingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("Upcoming");

  const filtered = bookings.filter((b) => b.tab === activeTab);
  const tabs: Tab[] = ["Upcoming", "Past"];

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ App bar (fixed) ══ */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-brand-neutral-100 border-b border-brand-neutral-200">
        {/* Title row */}
        <div className="px-5 pt-6 pb-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-brand-neutral-900" />
          </button>
          <h2
            className="text-[17px] text-brand-neutral-900"
            style={{ fontWeight: 600 }}
          >
            My bookings
          </h2>
        </div>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[80px]">
        {/* Tabs */}
        <div className="px-5 pt-4 pb-3 flex items-center gap-2">
          {tabs.map((tab) => {
            const count = bookings.filter((b) => b.tab === tab).length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-[12px] transition-colors ${
                  isActive
                    ? "bg-brand-neutral-900 text-brand-neutral-0"
                    : "bg-brand-neutral-0 border border-brand-neutral-200 text-brand-neutral-700 hover:bg-brand-neutral-100"
                }`}
                style={{ fontWeight: 500 }}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        <div className="px-5 space-y-3">
          {filtered.length > 0 ? (
            filtered.map((b) => {
              const Icon = b.icon;
              const chip = statusConfig[b.status];
              const ChipIcon = chip.icon;

              return (
                <div
                  key={b.id}
                  className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4"
                >
                  {/* ── Header row ── */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary-50 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-brand-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[14px] text-brand-neutral-900 truncate"
                        style={{ fontWeight: 500 }}
                      >
                        {b.facility}
                      </p>
                      <p
                        className="text-[12px] text-brand-neutral-500 mt-0.5"
                        style={{ fontWeight: 400 }}
                      >
                        {b.service}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] shrink-0 ${chip.bg} ${chip.text}`}
                      style={{ fontWeight: 500 }}
                    >
                      <ChipIcon size={10} />
                      {b.status}
                    </span>
                  </div>

                  {/* ── Detail rows ── */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[12px] text-brand-neutral-500"
                        style={{ fontWeight: 400 }}
                      >
                        Patient
                      </span>
                      <span
                        className="text-[12px] text-brand-neutral-900"
                        style={{ fontWeight: 500 }}
                      >
                        {b.patient}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[12px] text-brand-neutral-500"
                        style={{ fontWeight: 400 }}
                      >
                        Date / time
                      </span>
                      <span
                        className="text-[12px] text-brand-neutral-700"
                        style={{ fontWeight: 400 }}
                      >
                        {b.dateTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[12px] text-brand-neutral-500"
                        style={{ fontWeight: 400 }}
                      >
                        Booking ID
                      </span>
                      <span
                        className="text-[12px] text-brand-neutral-700"
                        style={{ fontWeight: 400 }}
                      >
                        {b.id}
                      </span>
                    </div>
                  </div>

                  {/* ── CTA ── */}
                  <button
                    onClick={() => navigate(`/book-04?id=${b.id}`)}
                    className="w-full min-h-[44px] border-t border-brand-neutral-200 text-brand-neutral-700 hover:text-brand-neutral-900 text-[13px] flex items-center justify-center gap-0.5 transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    View details
                    <ChevronRight size={13} />
                  </button>
                </div>
              );
            })
          ) : (
            /* ── Empty state ── */
            <div className="flex flex-col items-center text-center py-16">
              <div className="w-14 h-14 rounded-full bg-brand-neutral-200 flex items-center justify-center mb-4">
                <CalendarX2
                  size={24}
                  className="text-brand-neutral-500"
                />
              </div>
              <p
                className="text-[16px] text-brand-neutral-900 mb-1"
                style={{ fontWeight: 600 }}
              >
                No bookings yet
              </p>
              <p
                className="text-[13px] text-brand-neutral-500 mb-5"
                style={{ fontWeight: 400, lineHeight: "19px" }}
              >
                {activeTab === "Upcoming"
                  ? "Book a visit at an ABA Partner facility to get started."
                  : "Your past bookings will appear here."}
              </p>
              {activeTab === "Upcoming" && (
                <button
                  onClick={() => navigate("/book-01")}
                  className="min-h-[44px] px-6 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  <CalendarPlus size={14} />
                  Book a visit
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ══ Bottom Navigation ══ */}
    </div>
  );
}