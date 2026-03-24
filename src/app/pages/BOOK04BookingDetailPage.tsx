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

/* ══════════════════════════════════════════════
   Booking data (mirrors BOOK-03)
   ══════════════════════════════════════════════ */

type BookingStatus = "Pending" | "Confirmed" | "Declined" | "Completed";

interface BookingDetail {
  id: string;
  facility: string;
  facilityId: string;
  patient: string;
  service: string;
  scheduledTime: string;
  preferredWindow: string;
  notes: string;
  status: BookingStatus;
  icon: typeof Stethoscope;
}

const bookingsMap: Record<string, BookingDetail> = {
  "B-00021": {
    id: "B-00021",
    facility: "Mukono Family Clinic",
    facilityId: "f1",
    patient: "Ben",
    service: "Consultation",
    scheduledTime: "Tomorrow",
    preferredWindow: "Morning (8 am – 12 pm)",
    notes: "",
    status: "Pending",
    icon: Stethoscope,
  },
  "B-00019": {
    id: "B-00019",
    facility: "Sunrise Diagnostics",
    facilityId: "f2",
    patient: "Catherine",
    service: "Lab",
    scheduledTime: "Fri, 27 Feb 2026",
    preferredWindow: "Afternoon (12 pm – 5 pm)",
    notes: "Fasting required before blood draw.",
    status: "Confirmed",
    icon: FlaskConical,
  },
  "B-00014": {
    id: "B-00014",
    facility: "Divine Care Pharmacy",
    facilityId: "f3",
    patient: "Catherine",
    service: "Pharmacy",
    scheduledTime: "12 Feb 2026",
    preferredWindow: "Morning (8 am – 12 pm)",
    notes: "",
    status: "Completed",
    icon: Pill,
  },
  "B-00010": {
    id: "B-00010",
    facility: "Kisaasi Medical Centre",
    facilityId: "f4",
    patient: "Anna",
    service: "Consultation",
    scheduledTime: "8 Feb 2026",
    preferredWindow: "Afternoon (12 pm – 5 pm)",
    notes: "Follow-up visit.",
    status: "Declined",
    icon: Stethoscope,
  },
};

/* ── Status chip styling ── */
const statusChip: Record<
  BookingStatus,
  { bg: string; text: string; icon: typeof Clock }
> = {
  Pending: {
    bg: "bg-brand-neutral-100",
    text: "text-brand-neutral-600",
    icon: Clock,
  },
  Confirmed: {
    bg: "bg-brand-success-50",
    text: "text-brand-success-500",
    icon: CheckCircle2,
  },
  Declined: {
    bg: "bg-brand-error-50",
    text: "text-brand-error-500",
    icon: XCircle,
  },
  Completed: {
    bg: "bg-brand-success-50",
    text: "text-brand-success-500",
    icon: CircleCheckBig,
  },
};

/* Chip label — "Pending" shows as "Pending confirmation" */
const statusLabel: Record<BookingStatus, string> = {
  Pending: "Pending confirmation",
  Confirmed: "Confirmed",
  Declined: "Declined",
  Completed: "Completed",
};

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function BOOK04BookingDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const bookingId = searchParams.get("id") ?? "B-00021";
  const booking = bookingsMap[bookingId] ?? bookingsMap["B-00021"];
  const chip = statusChip[booking.status];
  const ChipIcon = chip.icon;
  const FacilityIcon = booking.icon;

  /* Detail rows */
  const rows: { label: string; value: string }[] = [
    { label: "Facility", value: booking.facility },
    { label: "Patient", value: booking.patient },
    { label: "Service", value: booking.service },
    {
      label:
        booking.status === "Confirmed" || booking.status === "Completed"
          ? "Scheduled time"
          : "Preferred window",
      value:
        booking.status === "Confirmed" || booking.status === "Completed"
          ? `${booking.scheduledTime}, ${booking.preferredWindow}`
          : `${booking.scheduledTime} · ${booking.preferredWindow}`,
    },
  ];

  if (booking.notes) {
    rows.push({ label: "Notes", value: booking.notes });
  }

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
        <h2
          className="text-[17px] text-brand-neutral-900"
          style={{ fontWeight: 600 }}
        >
          Booking
        </h2>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[100px]">
        {/* ── Status header ── */}
        <div className="px-5 pt-5 pb-4">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-brand-primary-50 flex items-center justify-center shrink-0">
                <FacilityIcon size={20} className="text-brand-primary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[16px] text-brand-neutral-900 truncate"
                  style={{ fontWeight: 600 }}
                >
                  {booking.facility}
                </p>
                <p
                  className="text-[12px] text-brand-neutral-500 mt-0.5"
                  style={{ fontWeight: 400 }}
                >
                  Booking {booking.id}
                </p>
              </div>
            </div>

            {/* Status chip */}
            <div className="flex items-center">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] ${chip.bg} ${chip.text}`}
                style={{ fontWeight: 500 }}
              >
                <ChipIcon size={13} />
                {statusLabel[booking.status]}
              </span>
            </div>
          </div>
        </div>

        {/* ── Details card ── */}
        <div className="px-5 pb-4">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            DETAILS
          </p>
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            {rows.map((row, i) => (
              <div key={row.label}>
                <div className="flex items-start justify-between py-2.5">
                  <p
                    className="text-[12px] text-brand-neutral-500 shrink-0"
                    style={{ fontWeight: 400 }}
                  >
                    {row.label}
                  </p>
                  <p
                    className="text-[13px] text-brand-neutral-900 text-right ml-4"
                    style={{ fontWeight: 500, lineHeight: "18px" }}
                  >
                    {row.value}
                  </p>
                </div>
                {i < rows.length - 1 && (
                  <div className="h-px bg-brand-neutral-200" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Helper note ── */}
        <div className="px-5 pb-6">
          <div className="bg-brand-neutral-100 border border-brand-neutral-200 rounded-2xl px-4 py-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-neutral-200 flex items-center justify-center shrink-0 mt-0.5">
              <Info size={15} className="text-brand-neutral-500" />
            </div>
            <p
              className="text-[12px] text-brand-neutral-700"
              style={{ fontWeight: 400, lineHeight: "17px" }}
            >
              Package redemption approvals happen at the facility during
              service.
            </p>
          </div>
        </div>
      </div>

      {/* ══ Sticky bottom actions ══ */}
      {(booking.status === "Pending" ||
        booking.status === "Confirmed" ||
        booking.status === "Declined") && (
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4 flex items-center gap-2.5">
          {booking.status === "Pending" && (
            <button
              onClick={() => navigate(`/book-05?id=${booking.id}`)}
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
                onClick={() =>
                  navigate(
                    `/book-01?facility=${booking.facilityId}&patient=${booking.patient.toLowerCase()}&service=${booking.service}`
                  )
                }
                className="flex-1 min-h-[44px] bg-brand-neutral-0 hover:bg-brand-neutral-50 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                style={{ fontWeight: 500 }}
              >
                <CalendarClock size={14} />
                Reschedule
              </button>
              <button
                onClick={() => {
                  /* placeholder — would open phone dialer */
                }}
                className="flex-1 min-h-[44px] bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                style={{ fontWeight: 500 }}
              >
                <Phone size={14} />
                Call facility
              </button>
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
  );
}