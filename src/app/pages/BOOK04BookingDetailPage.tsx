import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  CircleCheckBig,
  XCircle,
  Phone,
  CalendarClock,
  MapPin,
  Info,
  Stethoscope,
  FlaskConical,
  Pill,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type BookingStatus = "Pending" | "Confirmed" | "Declined" | "Completed" | "Cancelled";

type Booking = {
  id: string;
  facility_id: string;
  facility_name: string;
  patient_name: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  notes: string | null;
  status: BookingStatus;
};

const TIME_LABELS: Record<string, string> = {
  morning: "Morning (8 am – 12 pm)",
  afternoon: "Afternoon (12 pm – 5 pm)",
  evening: "Evening (5 pm – 9 pm)",
};

const FACILITY_PHONES: Record<string, string> = {
  f1: "+256700000001",
  f2: "+256700000002",
  f3: "+256700000003",
  f4: "+256700000004",
  f5: "+256700000005",
  f6: "+256700000006",
  f7: "+256700000007",
  f8: "+256700000008",
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

const statusChip: Record<BookingStatus, { bg: string; text: string; icon: typeof Clock; label: string }> = {
  Pending: { bg: "bg-brand-neutral-100", text: "text-brand-neutral-600", icon: Clock, label: "Pending confirmation" },
  Confirmed: { bg: "bg-brand-success-50", text: "text-brand-success-500", icon: CheckCircle2, label: "Confirmed" },
  Declined: { bg: "bg-brand-error-50", text: "text-brand-error-500", icon: XCircle, label: "Declined" },
  Completed: { bg: "bg-brand-success-50", text: "text-brand-success-500", icon: CircleCheckBig, label: "Completed" },
  Cancelled: { bg: "bg-brand-neutral-100", text: "text-brand-neutral-500", icon: XCircle, label: "Cancelled" },
};

export function BOOK04BookingDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("id") ?? "";

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    if (!bookingId) { setLoading(false); return; }
    supabase
      .from("bookings")
      .select("id, facility_id, facility_name, patient_name, service, preferred_date, preferred_time, notes, status")
      .eq("id", bookingId)
      .single()
      .then(({ data }) => {
        setBooking(data ?? null);
        setLoading(false);
      });
  }, [bookingId]);

  const handleCancelConfirm = async () => {
    if (!booking) return;
    setCancelError("");
    setCancelling(true);
    const { error } = await supabase
      .from("bookings")
      .update({ status: "Cancelled" })
      .eq("id", booking.id);
    if (error) {
      setCancelError("Failed to cancel. Please try again.");
      setCancelling(false);
    } else {
      navigate("/book-03", { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-neutral-100 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-brand-primary-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-brand-neutral-100 flex items-center justify-center px-5">
        <p className="text-[13px] text-brand-neutral-500">Booking not found.</p>
      </div>
    );
  }

  const chip = statusChip[booking.status] ?? statusChip["Pending"];
  const ChipIcon = chip.icon;
  const FacilityIcon = serviceIcon[booking.service] ?? Stethoscope;
  const phone = FACILITY_PHONES[booking.facility_id] ?? "+256700000000";

  const rows = [
    { label: "Facility", value: booking.facility_name },
    { label: "Patient", value: booking.patient_name },
    { label: "Service", value: booking.service },
    {
      label: booking.status === "Confirmed" || booking.status === "Completed"
        ? "Scheduled time"
        : "Preferred window",
      value: `${formatBookingDate(booking.preferred_date)} · ${TIME_LABELS[booking.preferred_time] ?? booking.preferred_time}`,
    },
    ...(booking.notes ? [{ label: "Notes", value: booking.notes }] : []),
  ];

  const showActions = booking.status === "Pending" || booking.status === "Confirmed" || booking.status === "Declined";

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ App bar (fixed) ══ */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-brand-neutral-100 px-5 pt-6 pb-3 flex items-center gap-3 border-b border-brand-neutral-200">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
        >
          <ArrowLeft size={16} className="text-brand-neutral-900" />
        </button>
        <h2 className="text-[17px] text-brand-neutral-900" style={{ fontWeight: 600 }}>
          Booking
        </h2>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[100px]">
        {/* Status header */}
        <div className="px-5 pt-5 pb-4">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-brand-primary-50 flex items-center justify-center shrink-0">
                <FacilityIcon size={20} className="text-brand-primary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[16px] text-brand-neutral-900 truncate" style={{ fontWeight: 600 }}>
                  {booking.facility_name}
                </p>
                <p className="text-[12px] text-brand-neutral-500 mt-0.5" style={{ fontWeight: 400 }}>
                  {bookingRef(booking.id)}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] ${chip.bg} ${chip.text}`}
                style={{ fontWeight: 500 }}
              >
                <ChipIcon size={13} />
                {chip.label}
              </span>
            </div>
          </div>
        </div>

        {/* Details card */}
        <div className="px-5 pb-4">
          <p className="text-[12px] text-brand-neutral-500 mb-2 px-1" style={{ fontWeight: 500, letterSpacing: "0.02em" }}>
            DETAILS
          </p>
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            {rows.map((row, i) => (
              <div key={row.label}>
                <div className="flex items-start justify-between py-2.5">
                  <p className="text-[12px] text-brand-neutral-500 shrink-0" style={{ fontWeight: 400 }}>
                    {row.label}
                  </p>
                  <p className="text-[13px] text-brand-neutral-900 text-right ml-4" style={{ fontWeight: 500, lineHeight: "18px" }}>
                    {row.value}
                  </p>
                </div>
                {i < rows.length - 1 && <div className="h-px bg-brand-neutral-200" />}
              </div>
            ))}
          </div>
        </div>

        {/* Helper note */}
        <div className="px-5 pb-6">
          <div className="bg-brand-neutral-100 border border-brand-neutral-200 rounded-2xl px-4 py-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-neutral-200 flex items-center justify-center shrink-0 mt-0.5">
              <Info size={15} className="text-brand-neutral-500" />
            </div>
            <p className="text-[12px] text-brand-neutral-700" style={{ fontWeight: 400, lineHeight: "17px" }}>
              Package redemption approvals happen at the facility during service.
            </p>
          </div>
        </div>
      </div>

      {/* ══ Sticky bottom actions ══ */}
      {showActions && (
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4">
          {confirmCancel ? (
            <div className="space-y-2">
              <p className="text-[13px] text-brand-neutral-700 text-center mb-1" style={{ fontWeight: 400 }}>
                Cancel this booking request?
              </p>
              {cancelError && (
                <p className="text-[12px] text-brand-error-500 text-center" style={{ fontWeight: 400 }}>
                  {cancelError}
                </p>
              )}
              <div className="flex gap-2.5">
                <button
                  onClick={() => { setConfirmCancel(false); setCancelError(""); }}
                  disabled={cancelling}
                  className="flex-1 min-h-[44px] bg-brand-neutral-200 hover:bg-brand-neutral-300 text-brand-neutral-900 rounded-xl text-[13px] transition-colors disabled:opacity-60"
                  style={{ fontWeight: 500 }}
                >
                  Keep booking
                </button>
                <button
                  onClick={handleCancelConfirm}
                  disabled={cancelling}
                  className="flex-1 min-h-[44px] bg-brand-error-500 hover:bg-brand-error-600 text-brand-neutral-0 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60"
                  style={{ fontWeight: 500 }}
                >
                  <XCircle size={14} />
                  {cancelling ? "Cancelling…" : "Yes, cancel"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {booking.status === "Pending" && (
                <button
                  onClick={() => setConfirmCancel(true)}
                  className="w-full min-h-[44px] bg-brand-error-50 hover:bg-brand-error-500/20 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  <XCircle size={14} />
                  Cancel request
                </button>
              )}

              {booking.status === "Confirmed" && (
                <>
                  <button
                    onClick={() => navigate(`/book-01?facility=${booking.facility_id}`)}
                    className="flex-1 min-h-[44px] bg-brand-neutral-0 hover:bg-brand-neutral-50 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    <CalendarClock size={14} />
                    Reschedule
                  </button>
                  <a
                    href={`tel:${phone}`}
                    className="flex-1 min-h-[44px] bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    <Phone size={14} />
                    Call facility
                  </a>
                </>
              )}

              {booking.status === "Declined" && (
                <button
                  onClick={() => navigate("/fac-01")}
                  className="w-full min-h-[44px] bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  <MapPin size={14} />
                  Choose another facility
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
