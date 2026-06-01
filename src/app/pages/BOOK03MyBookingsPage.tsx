import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
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
  XCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type Tab = "Upcoming" | "Past";

type Booking = {
  id: string;
  facility_name: string;
  patient_name: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
};

const TIME_LABELS: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

function formatBookingDate(d: string): string {
  if (d === "Today" || d === "Tomorrow") return d;
  try {
    return new Date(d + "T00:00:00").toLocaleDateString("en-UG", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return d;
  }
}

function bookingRef(id: string): string {
  return `B-${id.slice(0, 6).toUpperCase()}`;
}

const serviceIcon: Record<string, typeof Stethoscope> = {
  Consultation: Stethoscope,
  "Lab tests": FlaskConical,
  Pharmacy: Pill,
};

const statusConfig: Record<string, { bg: string; text: string; icon: typeof Clock; label: string }> = {
  Pending: { bg: "bg-brand-neutral-100", text: "text-brand-neutral-600", icon: Clock, label: "Pending confirmation" },
  Confirmed: { bg: "bg-brand-success-50", text: "text-brand-success-500", icon: CheckCircle2, label: "Confirmed" },
  Completed: { bg: "bg-brand-success-50", text: "text-brand-success-500", icon: CircleCheckBig, label: "Completed" },
  Declined: { bg: "bg-brand-error-50", text: "text-brand-error-500", icon: XCircle, label: "Declined" },
  Cancelled: { bg: "bg-brand-neutral-100", text: "text-brand-neutral-500", icon: XCircle, label: "Cancelled" },
};

const UPCOMING_STATUSES = ["Pending", "Confirmed"];
const PAST_STATUSES = ["Completed", "Declined", "Cancelled"];

export function BOOK03MyBookingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("Upcoming");
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase
        .from("bookings")
        .select("id, facility_name, patient_name, service, preferred_date, preferred_time, status")
        .in("status", UPCOMING_STATUSES)
        .order("created_at", { ascending: false }),
      supabase
        .from("bookings")
        .select("id, facility_name, patient_name, service, preferred_date, preferred_time, status")
        .in("status", PAST_STATUSES)
        .order("created_at", { ascending: false }),
    ]).then(([{ data: upcoming }, { data: past }]) => {
      setUpcomingBookings(upcoming ?? []);
      setPastBookings(past ?? []);
      setLoading(false);
    });
  }, []);

  const tabs: Tab[] = ["Upcoming", "Past"];
  const filtered = activeTab === "Upcoming" ? upcomingBookings : pastBookings;

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ App bar (fixed) ══ */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-brand-neutral-100 border-b border-brand-neutral-200">
        <div className="px-5 pt-6 pb-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/home-01")}
            className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-brand-neutral-900" />
          </button>
          <h2 className="text-[17px] text-brand-neutral-900" style={{ fontWeight: 600 }}>
            My bookings
          </h2>
        </div>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[80px]">
        {/* Tabs */}
        <div className="px-5 pt-4 pb-3 flex items-center gap-2">
          {tabs.map((tab) => {
            const count = tab === "Upcoming" ? upcomingBookings.length : pastBookings.length;
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
                {tab} {!loading && `(${count})`}
              </button>
            );
          })}
        </div>

        <div className="px-5 space-y-3">
          {loading ? (
            <div className="flex justify-center mt-10">
              <div className="w-5 h-5 rounded-full border-2 border-brand-primary-500 border-t-transparent animate-spin" />
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((b) => {
              const Icon = serviceIcon[b.service] ?? Stethoscope;
              const chip = statusConfig[b.status] ?? statusConfig["Pending"];
              const ChipIcon = chip.icon;

              return (
                <div key={b.id} className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
                  {/* Header row */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary-50 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-brand-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] text-brand-neutral-900 truncate" style={{ fontWeight: 500 }}>
                        {b.facility_name}
                      </p>
                      <p className="text-[12px] text-brand-neutral-500 mt-0.5" style={{ fontWeight: 400 }}>
                        {b.service}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] shrink-0 ${chip.bg} ${chip.text}`}
                      style={{ fontWeight: 500 }}
                    >
                      <ChipIcon size={10} />
                      {chip.label}
                    </span>
                  </div>

                  {/* Detail rows */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Patient</span>
                      <span className="text-[12px] text-brand-neutral-900" style={{ fontWeight: 500 }}>{b.patient_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Date / time</span>
                      <span className="text-[12px] text-brand-neutral-700" style={{ fontWeight: 400 }}>
                        {formatBookingDate(b.preferred_date)} · {TIME_LABELS[b.preferred_time] ?? b.preferred_time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>Booking ID</span>
                      <span className="text-[12px] text-brand-neutral-700" style={{ fontWeight: 400 }}>{bookingRef(b.id)}</span>
                    </div>
                  </div>

                  {/* CTA */}
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
            <div className="flex flex-col items-center text-center py-16">
              <div className="w-14 h-14 rounded-full bg-brand-neutral-200 flex items-center justify-center mb-4">
                <CalendarX2 size={24} className="text-brand-neutral-500" />
              </div>
              <p className="text-[16px] text-brand-neutral-900 mb-1" style={{ fontWeight: 600 }}>
                No bookings yet
              </p>
              <p className="text-[13px] text-brand-neutral-500 mb-5" style={{ fontWeight: 400, lineHeight: "19px" }}>
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
    </div>
  );
}
