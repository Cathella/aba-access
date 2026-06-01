import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle, CalendarCheck, Home, Info } from "lucide-react";
import { supabase } from "../../lib/supabase";

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

type Booking = {
  id: string;
  facility_name: string;
  patient_name: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
};

export function BOOK02BookingSubmittedPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("id") ?? "";

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) { setLoading(false); return; }
    supabase
      .from("bookings")
      .select("id, facility_name, patient_name, service, preferred_date, preferred_time")
      .eq("id", bookingId)
      .single()
      .then(({ data }) => {
        setBooking(data ?? null);
        setLoading(false);
      });
  }, [bookingId]);

  const summaryRows = booking
    ? [
        { label: "Facility", value: booking.facility_name },
        { label: "Patient", value: booking.patient_name },
        { label: "Service", value: booking.service },
        { label: "Preferred date", value: formatBookingDate(booking.preferred_date) },
        { label: "Time window", value: TIME_LABELS[booking.preferred_time] ?? booking.preferred_time },
        { label: "Booking ID", value: bookingRef(booking.id) },
      ]
    : [];

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      <div className="flex-1 overflow-y-auto pb-[80px] flex flex-col justify-center">
        {/* ── Success hero ── */}
        <div className="flex flex-col items-center px-5 pt-10 pb-6">
          <div className="w-16 h-16 rounded-full bg-brand-success-50 flex items-center justify-center mb-5">
            <CheckCircle size={32} className="text-brand-success-500" />
          </div>
          <h3 className="text-[22px] text-brand-neutral-900 mb-2 text-center" style={{ fontWeight: 600 }}>
            Booking request sent
          </h3>
          <p className="text-[14px] text-brand-neutral-500 text-center" style={{ fontWeight: 400, lineHeight: "20px" }}>
            The facility will confirm your booking in ABA Partner.
          </p>
        </div>

        {/* ── Summary card ── */}
        <div className="px-5 pb-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 rounded-full border-2 border-brand-primary-500 border-t-transparent animate-spin" />
            </div>
          ) : booking ? (
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
              {summaryRows.map((row, i) => (
                <div key={row.label}>
                  <div className="flex items-start justify-between py-2.5">
                    <p className="text-[12px] text-brand-neutral-500 shrink-0" style={{ fontWeight: 400 }}>
                      {row.label}
                    </p>
                    <p className="text-[13px] text-brand-neutral-900 text-right ml-4" style={{ fontWeight: 500 }}>
                      {row.value}
                    </p>
                  </div>
                  {i < summaryRows.length - 1 && <div className="h-px bg-brand-neutral-200" />}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* ── Info note ── */}
        <div className="px-5 pb-6">
          <div className="bg-brand-neutral-100 border border-brand-neutral-200 rounded-2xl px-4 py-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-neutral-200 flex items-center justify-center shrink-0 mt-0.5">
              <Info size={15} className="text-brand-neutral-500" />
            </div>
            <p className="text-[12px] text-brand-neutral-700" style={{ fontWeight: 400, lineHeight: "17px" }}>
              If urgent, you can walk in. Approvals may still be required for package redemption.
            </p>
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-4 pt-3 bg-brand-neutral-0 border-t border-brand-neutral-200 flex items-center gap-2.5">
        <button
          onClick={() => navigate("/home-01")}
          className="flex-1 min-h-[44px] bg-brand-neutral-0 hover:bg-brand-neutral-50 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[14px] flex items-center justify-center gap-1.5 transition-colors"
          style={{ fontWeight: 500 }}
        >
          <Home size={15} />
          Back to Home
        </button>
        <button
          onClick={() => navigate("/book-03")}
          className="flex-1 min-h-[44px] bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[14px] flex items-center justify-center gap-1.5 transition-colors"
          style={{ fontWeight: 500 }}
        >
          <CalendarCheck size={15} />
          View bookings
        </button>
      </div>
    </div>
  );
}
