import { useNavigate, useSearchParams } from "react-router";
import {
  CheckCircle,
  CalendarCheck,
  Home,
  Info,
} from "lucide-react";
import { BottomNav } from "../components/BottomNav";

/* ══════════════════════════════════════════════
   Lookup maps
   ══════════════════════════════════════════════ */

const facilityNames: Record<string, string> = {
  f1: "Mukono Family Clinic",
  f2: "Sunrise Diagnostics",
  f3: "Divine Care Pharmacy",
  f4: "Kisaasi Medical Centre",
  f5: "Wandegeya Health Hub",
  f6: "Mengo Diagnostics",
  f7: "Ntinda Family Pharmacy",
  f8: "Bukoto Care Point",
};

const patientNames: Record<string, string> = {
  member: "Catherine",
  "dep-a": "Ben",
  "dep-b": "Anna",
};

const timeLabels: Record<string, string> = {
  morning: "Morning (8 am – 12 pm)",
  afternoon: "Afternoon (12 pm – 5 pm)",
  evening: "Evening (5 pm – 9 pm)",
};

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function BOOK02BookingSubmittedPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const facilityId = searchParams.get("facility") ?? "";
  const patientId = searchParams.get("patient") ?? "member";
  const service = searchParams.get("service") ?? "";
  const date = searchParams.get("date") ?? "Today";
  const time = searchParams.get("time") ?? "morning";

  const facilityName = facilityNames[facilityId] ?? "Selected facility";
  const patientName = patientNames[patientId] ?? "Catherine";
  const timeLabel = timeLabels[time] ?? time;

  /* Summary rows */
  const summaryRows = [
    { label: "Facility", value: facilityName },
    { label: "Patient", value: patientName },
    { label: "Service", value: service || "—" },
    { label: "Preferred date", value: date },
    { label: "Time window", value: timeLabel },
    { label: "Booking ID", value: "B-00021" },
  ];

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pb-[80px] flex flex-col justify-center">
        {/* ── Success hero ── */}
        <div className="flex flex-col items-center px-5 pt-10 pb-6">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-brand-success-50 flex items-center justify-center mb-5">
            <CheckCircle size={32} className="text-brand-success-500" />
          </div>

          {/* Title */}
          <h3
            className="text-[22px] text-brand-neutral-900 mb-2 text-center"
            style={{ fontWeight: 600 }}
          >
            Booking request sent
          </h3>

          {/* Body */}
          <p
            className="text-[14px] text-brand-neutral-500 text-center"
            style={{ fontWeight: 400, lineHeight: "20px" }}
          >
            The facility will confirm your booking in ABA Partner.
          </p>
        </div>

        {/* ── Summary card ── */}
        <div className="px-5 pb-4">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            {summaryRows.map((row, i) => (
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
                    style={{ fontWeight: 500 }}
                  >
                    {row.value}
                  </p>
                </div>
                {i < summaryRows.length - 1 && (
                  <div className="h-px bg-brand-neutral-200" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="fixed bottom-0 left-0 right-0 px-5 pb-4 pt-3 bg-brand-neutral-0 border-t border-brand-neutral-200 flex items-center gap-2.5">
          {/* Secondary outline */}
          <button
            onClick={() => navigate("/home-01")}
            className="flex-1 min-h-[44px] bg-brand-neutral-0 hover:bg-brand-neutral-50 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[14px] flex items-center justify-center gap-1.5 transition-colors"
            style={{ fontWeight: 500 }}
          >
            <Home size={15} />
            Back to Home
          </button>

          {/* Primary */}
          <button
            onClick={() => navigate("/book-03")}
            className="flex-1 min-h-[44px] bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[14px] flex items-center justify-center gap-1.5 transition-colors"
            style={{ fontWeight: 500 }}
          >
            <CalendarCheck size={15} />
            View bookings
          </button>
        </div>

        {/* ── Info note ── */}
        <div className="px-5 pb-6">
          <div className="bg-brand-neutral-100 border border-brand-neutral-200 rounded-2xl px-4 py-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-neutral-200 flex items-center justify-center shrink-0 mt-0.5">
              <Info size={15} className="text-brand-neutral-500" />
            </div>
            <p
              className="text-[12px] text-brand-neutral-700"
              style={{ fontWeight: 400, lineHeight: "17px" }}
            >
              If urgent, you can walk in. Approvals may still be required for
              package redemption.
            </p>
          </div>
        </div>
      </div>

      {/* ══ Bottom Navigation ══ */}
    </div>
  );
}