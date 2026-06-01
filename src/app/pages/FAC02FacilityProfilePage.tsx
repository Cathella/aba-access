import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Stethoscope,
  FlaskConical,
  Pill,
  CheckCircle,
  Phone,
  Navigation,
  CalendarPlus,
} from "lucide-react";

/* ══════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════ */

type FacilityType = "Clinic" | "Lab" | "Pharmacy";
type ServiceLabel = "Consultation" | "Lab tests" | "Pharmacy";

interface DayHours {
  day: string;
  time: string;
  isClosed: boolean;
}

interface Facility {
  id: string;
  name: string;
  types: FacilityType[];
  distance: string;
  address: string;
  region: string;
  phone: string;
  isOpen: boolean;
  hours: DayHours[];
}

/* ══════════════════════════════════════════════
   Facility data (mirrors FAC-01's 8 facilities)
   ══════════════════════════════════════════════ */

const facilities: Facility[] = [
  {
    id: "f1",
    name: "Mukono Family Clinic",
    types: ["Clinic"],
    distance: "1.2 km",
    address: "Plot 12, Main St, Mukono",
    region: "Mukono District",
    phone: "+256 700 123 456",
    isOpen: true,
    hours: [
      { day: "Mon", time: "8:00 AM – 6:00 PM", isClosed: false },
      { day: "Tue", time: "8:00 AM – 6:00 PM", isClosed: false },
      { day: "Wed", time: "8:00 AM – 6:00 PM", isClosed: false },
      { day: "Thu", time: "8:00 AM – 6:00 PM", isClosed: false },
      { day: "Fri", time: "8:00 AM – 6:00 PM", isClosed: false },
      { day: "Sat", time: "9:00 AM – 1:00 PM", isClosed: false },
      { day: "Sun", time: "Closed", isClosed: true },
    ],
  },
  {
    id: "f2",
    name: "Sunrise Diagnostics",
    types: ["Lab"],
    distance: "2.1 km",
    address: "Block A, Sunrise Rd, Kampala",
    region: "Kampala District",
    phone: "+256 700 234 567",
    isOpen: true,
    hours: [
      { day: "Mon", time: "7:00 AM – 7:00 PM", isClosed: false },
      { day: "Tue", time: "7:00 AM – 7:00 PM", isClosed: false },
      { day: "Wed", time: "7:00 AM – 7:00 PM", isClosed: false },
      { day: "Thu", time: "7:00 AM – 7:00 PM", isClosed: false },
      { day: "Fri", time: "7:00 AM – 7:00 PM", isClosed: false },
      { day: "Sat", time: "8:00 AM – 2:00 PM", isClosed: false },
      { day: "Sun", time: "8:00 AM – 2:00 PM", isClosed: false },
    ],
  },
  {
    id: "f3",
    name: "Divine Care Pharmacy",
    types: ["Pharmacy"],
    distance: "2.8 km",
    address: "Unit 5, Market Ave, Mukono",
    region: "Mukono District",
    phone: "+256 700 345 678",
    isOpen: true,
    hours: [
      { day: "Mon", time: "8:00 AM – 8:00 PM", isClosed: false },
      { day: "Tue", time: "8:00 AM – 8:00 PM", isClosed: false },
      { day: "Wed", time: "8:00 AM – 8:00 PM", isClosed: false },
      { day: "Thu", time: "8:00 AM – 8:00 PM", isClosed: false },
      { day: "Fri", time: "8:00 AM – 8:00 PM", isClosed: false },
      { day: "Sat", time: "8:00 AM – 8:00 PM", isClosed: false },
      { day: "Sun", time: "10:00 AM – 4:00 PM", isClosed: false },
    ],
  },
  {
    id: "f4",
    name: "Kisaasi Medical Centre",
    types: ["Clinic", "Lab"],
    distance: "3.0 km",
    address: "Plot 44, Kisaasi Rd, Kampala",
    region: "Kampala District",
    phone: "+256 700 456 789",
    isOpen: false,
    hours: [
      { day: "Mon", time: "8:00 AM – 5:00 PM", isClosed: false },
      { day: "Tue", time: "8:00 AM – 5:00 PM", isClosed: false },
      { day: "Wed", time: "8:00 AM – 5:00 PM", isClosed: false },
      { day: "Thu", time: "8:00 AM – 5:00 PM", isClosed: false },
      { day: "Fri", time: "Closed", isClosed: true },
      { day: "Sat", time: "Closed", isClosed: true },
      { day: "Sun", time: "Closed", isClosed: true },
    ],
  },
  {
    id: "f5",
    name: "Wandegeya Health Hub",
    types: ["Clinic"],
    distance: "4.4 km",
    address: "Plot 8, Wandegeya Rd, Kampala",
    region: "Kampala District",
    phone: "+256 700 567 890",
    isOpen: true,
    hours: [
      { day: "Mon", time: "7:30 AM – 6:30 PM", isClosed: false },
      { day: "Tue", time: "7:30 AM – 6:30 PM", isClosed: false },
      { day: "Wed", time: "7:30 AM – 6:30 PM", isClosed: false },
      { day: "Thu", time: "7:30 AM – 6:30 PM", isClosed: false },
      { day: "Fri", time: "7:30 AM – 6:30 PM", isClosed: false },
      { day: "Sat", time: "9:00 AM – 2:00 PM", isClosed: false },
      { day: "Sun", time: "Closed", isClosed: true },
    ],
  },
  {
    id: "f6",
    name: "Mengo Diagnostics",
    types: ["Lab"],
    distance: "5.2 km",
    address: "Floor 1, Mengo Hill, Kampala",
    region: "Kampala District",
    phone: "+256 700 678 901",
    isOpen: true,
    hours: [
      { day: "Mon", time: "7:00 AM – 6:00 PM", isClosed: false },
      { day: "Tue", time: "7:00 AM – 6:00 PM", isClosed: false },
      { day: "Wed", time: "7:00 AM – 6:00 PM", isClosed: false },
      { day: "Thu", time: "7:00 AM – 6:00 PM", isClosed: false },
      { day: "Fri", time: "7:00 AM – 6:00 PM", isClosed: false },
      { day: "Sat", time: "8:00 AM – 1:00 PM", isClosed: false },
      { day: "Sun", time: "Closed", isClosed: true },
    ],
  },
  {
    id: "f7",
    name: "Ntinda Family Pharmacy",
    types: ["Pharmacy"],
    distance: "6.0 km",
    address: "Plot 22, Ntinda Rd, Kampala",
    region: "Kampala District",
    phone: "+256 700 789 012",
    isOpen: true,
    hours: [
      { day: "Mon", time: "8:00 AM – 9:00 PM", isClosed: false },
      { day: "Tue", time: "8:00 AM – 9:00 PM", isClosed: false },
      { day: "Wed", time: "8:00 AM – 9:00 PM", isClosed: false },
      { day: "Thu", time: "8:00 AM – 9:00 PM", isClosed: false },
      { day: "Fri", time: "8:00 AM – 9:00 PM", isClosed: false },
      { day: "Sat", time: "8:00 AM – 9:00 PM", isClosed: false },
      { day: "Sun", time: "9:00 AM – 5:00 PM", isClosed: false },
    ],
  },
  {
    id: "f8",
    name: "Bukoto Care Point",
    types: ["Clinic", "Pharmacy"],
    distance: "6.5 km",
    address: "Plot 3, Bukoto St, Kampala",
    region: "Kampala District",
    phone: "+256 700 890 123",
    isOpen: true,
    hours: [
      { day: "Mon", time: "8:00 AM – 7:00 PM", isClosed: false },
      { day: "Tue", time: "8:00 AM – 7:00 PM", isClosed: false },
      { day: "Wed", time: "8:00 AM – 7:00 PM", isClosed: false },
      { day: "Thu", time: "8:00 AM – 7:00 PM", isClosed: false },
      { day: "Fri", time: "8:00 AM – 7:00 PM", isClosed: false },
      { day: "Sat", time: "9:00 AM – 3:00 PM", isClosed: false },
      { day: "Sun", time: "Closed", isClosed: true },
    ],
  },
];

/* ── Style helpers ── */

const typeChipStyles: Record<FacilityType, string> = {
  Clinic: "bg-brand-primary-50 text-brand-primary-500",
  Lab: "bg-brand-secondary-50 text-brand-secondary-500",
  Pharmacy: "bg-brand-warning-50 text-brand-warning-500",
};

const typeIconBg: Record<FacilityType, string> = {
  Clinic: "bg-brand-primary-50",
  Lab: "bg-brand-secondary-50",
  Pharmacy: "bg-brand-warning-50",
};

const typeIconFg: Record<FacilityType, string> = {
  Clinic: "text-brand-primary-500",
  Lab: "text-brand-secondary-500",
  Pharmacy: "text-brand-warning-500",
};

const typeIcon: Record<FacilityType, typeof Stethoscope> = {
  Clinic: Stethoscope,
  Lab: FlaskConical,
  Pharmacy: Pill,
};

/* Map facility type → service labels */
const typeToService: Record<FacilityType, { label: ServiceLabel; desc: string }> = {
  Clinic: { label: "Consultation", desc: "General consultations & checkups" },
  Lab: { label: "Lab tests", desc: "Diagnostic tests & pathology" },
  Pharmacy: { label: "Pharmacy", desc: "Prescription & OTC medications" },
};

/* Determine today's day name (short form) */
const TODAY_INDEX = new Date().getDay(); // 0=Sun, 1=Mon…
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TODAY_SHORT = DAY_NAMES[TODAY_INDEX];

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function FAC02FacilityProfilePage() {
  const navigate = useNavigate();
  const { facilityId } = useParams();

  const facility =
    facilities.find((f) => f.id === facilityId) ?? facilities[0];

  const primaryType = facility.types[0];
  const PrimaryIcon = typeIcon[primaryType];

  /* Derive services from types */
  const services = facility.types.map((t) => ({
    type: t,
    ...typeToService[t],
    icon: typeIcon[t],
  }));

  /* Check if closed today */
  const todayHours = facility.hours.find((h) => h.day === TODAY_SHORT);
  const closedToday = todayHours?.isClosed ?? false;

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ App bar (fixed) ══ */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-brand-neutral-100 px-5 pt-6 pb-3 flex items-center gap-3 border-b border-brand-neutral-200">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center shrink-0"
        >
          <ArrowLeft size={16} className="text-brand-neutral-900" />
        </button>
        <h2
          className="text-[17px] text-brand-neutral-900 truncate"
          style={{ fontWeight: 600 }}
        >
          {facility.name}
        </h2>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[160px]">
        {/* ─────────────────────────────────────
            Header card
           ───────────────────────────────────── */}
        <div className="px-5 pt-4">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5">
            {/* Leading icon + name */}
            <div className="flex items-start gap-3.5 mb-4">
              <div
                className={`w-12 h-12 rounded-xl ${typeIconBg[primaryType]} flex items-center justify-center shrink-0`}
              >
                <PrimaryIcon size={22} className={typeIconFg[primaryType]} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[18px] text-brand-neutral-900 mb-1"
                  style={{ fontWeight: 600 }}
                >
                  {facility.name}
                </p>

                {/* Type chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {facility.types.map((t) => (
                    <span
                      key={t}
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${typeChipStyles[t]}`}
                      style={{ fontWeight: 500 }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Distance + location */}
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={13} className="text-brand-neutral-400 shrink-0" />
              <p
                className="text-[13px] text-brand-neutral-700"
                style={{ fontWeight: 400 }}
              >
                {facility.address} &middot; {facility.region}
              </p>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <MapPin size={13} className="text-brand-neutral-300 shrink-0" />
              <p
                className="text-[12px] text-brand-neutral-500"
                style={{ fontWeight: 400 }}
              >
                {facility.distance} away
              </p>
            </div>

            {/* Badges row */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Open / Closed */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] ${
                  facility.isOpen
                    ? "bg-brand-success-50 text-brand-success-500"
                    : "bg-brand-neutral-100 text-brand-neutral-500"
                }`}
                style={{ fontWeight: 500 }}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    facility.isOpen
                      ? "bg-brand-success-500"
                      : "bg-brand-neutral-400"
                  }`}
                />
                {facility.isOpen ? "Open" : "Closed"}
              </span>

              {/* Accepts AbaAccess */}
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-success-50 text-[11px] text-brand-success-500"
                style={{ fontWeight: 500 }}
              >
                <CheckCircle size={11} />
                Accepts AbaAccess
              </span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────
            1) Services offered
           ───────────────────────────────────── */}
        <div className="px-5 pt-4">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            SERVICES OFFERED
          </p>

          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className={`flex items-center gap-3.5 px-4 py-3.5 ${
                    i < services.length - 1
                      ? "border-b border-brand-neutral-200"
                      : ""
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl ${typeIconBg[s.type]} flex items-center justify-center shrink-0`}
                  >
                    <Icon size={16} className={typeIconFg[s.type]} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[13px] text-brand-neutral-900"
                      style={{ fontWeight: 500 }}
                    >
                      {s.label}
                    </p>
                    <p
                      className="text-[11px] text-brand-neutral-500 mt-0.5"
                      style={{ fontWeight: 400 }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─────────────────────────────────────
            2) Operating hours
           ───────────────────────────────────── */}
        <div className="px-5 pt-4">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            OPERATING HOURS
          </p>

          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            {/* Closed-today note */}
            {closedToday && (
              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-brand-neutral-100">
                <Clock
                  size={12}
                  className="text-brand-neutral-500 shrink-0"
                />
                <p
                  className="text-[11px] text-brand-neutral-500"
                  style={{ fontWeight: 500 }}
                >
                  This facility is closed today ({TODAY_SHORT})
                </p>
              </div>
            )}

            {/* Weekly grid */}
            <div className="space-y-0">
              {facility.hours.map((h) => {
                const isToday = h.day === TODAY_SHORT;
                return (
                  <div
                    key={h.day}
                    className={`flex items-center justify-between py-2.5 ${
                      isToday
                        ? "bg-brand-primary-50/40 -mx-2 px-2 rounded-lg"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-[13px] w-8 ${
                          isToday
                            ? "text-brand-primary-500"
                            : "text-brand-neutral-900"
                        }`}
                        style={{ fontWeight: isToday ? 600 : 500 }}
                      >
                        {h.day}
                      </p>
                      {isToday && (
                        <span
                          className="text-[9px] text-brand-primary-500 px-1.5 py-0.5 rounded bg-brand-primary-50"
                          style={{ fontWeight: 600 }}
                        >
                          TODAY
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[12px] ${
                        h.isClosed
                          ? "text-brand-neutral-400"
                          : isToday
                          ? "text-brand-primary-500"
                          : "text-brand-neutral-700"
                      }`}
                      style={{ fontWeight: h.isClosed ? 400 : 400 }}
                    >
                      {h.time}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────
            3) Contact & directions
           ───────────────────────────────────── */}
        <div className="px-5 pt-4 pb-4">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            CONTACT & DIRECTIONS
          </p>

          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden">
            {/* Phone */}
            <button className="w-full flex items-center gap-3.5 px-4 py-3.5 border-b border-brand-neutral-200 text-left hover:bg-brand-neutral-50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
                <Phone size={15} className="text-brand-neutral-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[13px] text-brand-neutral-900"
                  style={{ fontWeight: 500 }}
                >
                  Call facility
                </p>
                <p
                  className="text-[11px] text-brand-neutral-500 mt-0.5"
                  style={{ fontWeight: 400 }}
                >
                  {facility.phone}
                </p>
              </div>
            </button>

            {/* Directions */}
            <button className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left hover:bg-brand-neutral-50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
                <Navigation size={15} className="text-brand-neutral-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[13px] text-brand-neutral-900"
                  style={{ fontWeight: 500 }}
                >
                  Get directions
                </p>
                <p
                  className="text-[11px] text-brand-neutral-500 mt-0.5"
                  style={{ fontWeight: 400 }}
                >
                  {facility.address}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ══ Sticky bottom CTA ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-5">
        <button
          onClick={() =>
            navigate(`/book-01?facility=${facility.id}`)
          }
          className="w-full h-11 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[14px] flex items-center justify-center gap-1.5 transition-colors"
          style={{ fontWeight: 500 }}
        >
          <CalendarPlus size={15} />
          Book visit
        </button>
        <p
          className="text-[11px] text-brand-neutral-400 text-center mt-2"
          style={{ fontWeight: 400, lineHeight: "15px" }}
        >
          Booking requests are confirmed by the facility in ABA Partner.
        </p>
      </div>

    </div>
  );
}
