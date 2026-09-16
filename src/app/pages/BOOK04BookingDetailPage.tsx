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
  CalendarDays,
  MapPin,
  Info,
  Send,
  Stethoscope,
  FlaskConical,
  Pill,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { fetchBooking, cancelBooking, requestReschedule, type Booking, type BookingStatus } from "../../lib/bookings";

const timeWindows = [
  { id: "morning", label: "Morning", sub: "8 am – 12 pm" },
  { id: "afternoon", label: "Afternoon", sub: "12 pm – 5 pm" },
  { id: "evening", label: "Evening", sub: "5 pm – 9 pm" },
] as const;

const TIME_LABELS: Record<string, string> = {
  morning: "Morning (8 am – 12 pm)",
  afternoon: "Afternoon (12 pm – 5 pm)",
  evening: "Evening (5 pm – 9 pm)",
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
  pending: { bg: "bg-brand-neutral-100", text: "text-brand-neutral-600", icon: Clock, label: "Pending confirmation" },
  confirmed: { bg: "bg-brand-success-50", text: "text-brand-success-500", icon: CheckCircle2, label: "Confirmed" },
  "reschedule-requested": { bg: "bg-brand-neutral-100", text: "text-brand-neutral-600", icon: Clock, label: "Reschedule requested" },
  proposed: { bg: "bg-brand-neutral-100", text: "text-brand-neutral-600", icon: Clock, label: "New time proposed" },
  declined: { bg: "bg-brand-error-50", text: "text-brand-error-500", icon: XCircle, label: "Declined" },
  completed: { bg: "bg-brand-success-50", text: "text-brand-success-500", icon: CircleCheckBig, label: "Completed" },
  cancelled: { bg: "bg-brand-neutral-100", text: "text-brand-neutral-500", icon: XCircle, label: "Cancelled" },
};

export function BOOK04BookingDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("id") ?? "";

  const [booking, setBooking] = useState<Booking | null>(null);
  const [facilityPhone, setFacilityPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("Today");
  const [customDate, setCustomDate] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);
  const [rescheduleTime, setRescheduleTime] = useState("morning");
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState("");

  useEffect(() => {
    if (!bookingId) { setLoading(false); return; }
    fetchBooking(bookingId)
      .then((data) => {
        setBooking(data);
        setLoading(false);
        if (data?.facility_id) {
          supabase
            .from("facilities")
            .select("phone")
            .eq("id", data.facility_id)
            .maybeSingle()
            .then(({ data: facilityData }) => setFacilityPhone(facilityData?.phone ?? null));
        }
      })
      .catch(() => {
        setBooking(null);
        setLoading(false);
      });
  }, [bookingId]);

  const handleCancelConfirm = async () => {
    if (!booking) return;
    setCancelError("");
    setCancelling(true);
    try {
      await cancelBooking(booking.id);
      navigate("/book-03", { replace: true });
    } catch {
      setCancelError("Failed to cancel. Please try again.");
      setCancelling(false);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!booking) return;
    setRescheduleError("");
    setRescheduling(true);
    try {
      await requestReschedule(booking.id, rescheduleDate, rescheduleTime);
      const updated = await fetchBooking(booking.id);
      setBooking(updated);
      setShowReschedule(false);
    } catch {
      setRescheduleError("Failed to send reschedule request. Please try again.");
    } finally {
      setRescheduling(false);
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

  const chip = statusChip[booking.status] ?? statusChip["pending"];
  const ChipIcon = chip.icon;
  const FacilityIcon = serviceIcon[booking.service] ?? Stethoscope;

  const rows = [
    { label: "Facility", value: booking.facility_name },
    { label: "Patient", value: booking.patient_name },
    { label: "Service", value: booking.service },
    {
      label: booking.status === "confirmed" || booking.status === "completed"
        ? "Scheduled time"
        : "Preferred window",
      value: `${formatBookingDate(booking.preferred_date)} · ${TIME_LABELS[booking.preferred_time] ?? booking.preferred_time}`,
    },
    ...(booking.notes ? [{ label: "Notes", value: booking.notes }] : []),
  ];

  const showActions =
    booking.status === "pending" ||
    booking.status === "confirmed" ||
    booking.status === "reschedule-requested" ||
    booking.status === "declined";
  const isCustomDateSelected = rescheduleDate !== "Today" && rescheduleDate !== "Tomorrow";

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
          ) : showReschedule ? (
            <div className="space-y-3">
              <p className="text-[13px] text-brand-neutral-900 text-center" style={{ fontWeight: 500 }}>
                Request a new date & time
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <CalendarDays size={14} className="text-brand-neutral-400 shrink-0" />
                {(["Today", "Tomorrow"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => { setRescheduleDate(d); setCustomDate(""); setShowDateInput(false); }}
                    className={`px-3 py-1.5 rounded-lg text-[12px] transition-colors ${
                      rescheduleDate === d
                        ? "bg-brand-neutral-900 text-brand-neutral-0"
                        : "bg-brand-neutral-100 text-brand-neutral-700 hover:bg-brand-neutral-200"
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    {d}
                  </button>
                ))}
                <button
                  onClick={() => setShowDateInput(true)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] transition-colors ${
                    isCustomDateSelected
                      ? "bg-brand-neutral-900 text-brand-neutral-0"
                      : "bg-brand-neutral-100 text-brand-neutral-700 hover:bg-brand-neutral-200"
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {customDate ? formatBookingDate(customDate) : "Pick date"}
                </button>
              </div>

              {showDateInput && (
                <input
                  type="date"
                  autoFocus
                  className="w-full h-10 px-3 bg-brand-neutral-0 border border-brand-neutral-200 rounded-xl text-[13px] text-brand-neutral-900 focus:outline-none focus:border-brand-primary-300 transition-colors"
                  min={new Date().toISOString().split("T")[0]}
                  value={customDate}
                  onChange={(e) => {
                    if (e.target.value) {
                      setCustomDate(e.target.value);
                      setRescheduleDate(e.target.value);
                      setShowDateInput(false);
                    }
                  }}
                />
              )}

              <div className="flex items-center gap-2">
                {timeWindows.map((tw) => (
                  <button
                    key={tw.id}
                    onClick={() => setRescheduleTime(tw.id)}
                    className={`flex-1 px-2 py-2 rounded-lg text-[12px] transition-colors ${
                      rescheduleTime === tw.id
                        ? "bg-brand-primary-300 text-brand-neutral-900"
                        : "bg-brand-neutral-100 text-brand-neutral-700 hover:bg-brand-neutral-200"
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    {tw.label}
                  </button>
                ))}
              </div>

              {rescheduleError && (
                <p className="text-[12px] text-brand-error-500 text-center" style={{ fontWeight: 400 }}>
                  {rescheduleError}
                </p>
              )}

              <div className="flex gap-2.5">
                <button
                  onClick={() => { setShowReschedule(false); setRescheduleError(""); }}
                  disabled={rescheduling}
                  className="flex-1 min-h-[44px] bg-brand-neutral-200 hover:bg-brand-neutral-300 text-brand-neutral-900 rounded-xl text-[13px] transition-colors disabled:opacity-60"
                  style={{ fontWeight: 500 }}
                >
                  Back
                </button>
                <button
                  onClick={handleRescheduleSubmit}
                  disabled={rescheduling}
                  className="flex-1 min-h-[44px] bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60"
                  style={{ fontWeight: 500 }}
                >
                  <Send size={14} />
                  {rescheduling ? "Sending…" : "Send request"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {(booking.status === "pending" || booking.status === "reschedule-requested") && (
                <button
                  onClick={() => setConfirmCancel(true)}
                  className="w-full min-h-[44px] bg-brand-error-50 hover:bg-brand-error-500/20 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  <XCircle size={14} />
                  Cancel request
                </button>
              )}

              {booking.status === "confirmed" && (
                <>
                  <button
                    onClick={() => setShowReschedule(true)}
                    className="flex-1 min-h-[44px] bg-brand-neutral-0 hover:bg-brand-neutral-50 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    <CalendarClock size={14} />
                    Reschedule
                  </button>
                  {facilityPhone ? (
                    <a
                      href={`tel:${facilityPhone}`}
                      className="flex-1 min-h-[44px] bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      <Phone size={14} />
                      Call facility
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex-1 min-h-[44px] bg-brand-neutral-100 text-brand-neutral-400 border-[1.5px] border-brand-neutral-200 rounded-xl text-[13px] flex items-center justify-center gap-1.5 cursor-not-allowed"
                      style={{ fontWeight: 500 }}
                    >
                      <Phone size={14} />
                      No phone on file
                    </button>
                  )}
                </>
              )}

              {booking.status === "declined" && (
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
