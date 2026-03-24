import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  Users,
  User,
  Stethoscope,
  FlaskConical,
  Pill,
  CalendarDays,
  Clock,
  FileText,
  Info,
  Send,
  Check,
} from "lucide-react";
import { BottomNav } from "../components/BottomNav";

/* ══════════════════════════════════════════════
   Data
   ══════════════════════════════════════════════ */

type FacilityType = "Clinic" | "Lab" | "Pharmacy";

interface FacilityInfo {
  id: string;
  name: string;
  types: FacilityType[];
  distance: string;
}

const facilitiesMap: Record<string, FacilityInfo> = {
  f1: { id: "f1", name: "Mukono Family Clinic", types: ["Clinic"], distance: "1.2 km" },
  f2: { id: "f2", name: "Sunrise Diagnostics", types: ["Lab"], distance: "2.1 km" },
  f3: { id: "f3", name: "Divine Care Pharmacy", types: ["Pharmacy"], distance: "2.8 km" },
  f4: { id: "f4", name: "Kisaasi Medical Centre", types: ["Clinic", "Lab"], distance: "3.0 km" },
  f5: { id: "f5", name: "Wandegeya Health Hub", types: ["Clinic"], distance: "4.4 km" },
  f6: { id: "f6", name: "Mengo Diagnostics", types: ["Lab"], distance: "5.2 km" },
  f7: { id: "f7", name: "Ntinda Family Pharmacy", types: ["Pharmacy"], distance: "6.0 km" },
  f8: { id: "f8", name: "Bukoto Care Point", types: ["Clinic", "Pharmacy"], distance: "6.5 km" },
};

/* Map facility types → service labels */
const typeToService: Record<FacilityType, string> = {
  Clinic: "Consultation",
  Lab: "Lab tests",
  Pharmacy: "Pharmacy",
};

const allServices = ["Consultation", "Lab tests", "Pharmacy"] as const;
type ServiceLabel = (typeof allServices)[number];

const serviceIcon: Record<ServiceLabel, typeof Stethoscope> = {
  Consultation: Stethoscope,
  "Lab tests": FlaskConical,
  Pharmacy: Pill,
};

const serviceChipActive: Record<ServiceLabel, string> = {
  Consultation: "bg-brand-primary-50 text-brand-primary-500 border-brand-primary-300",
  "Lab tests": "bg-brand-secondary-50 text-brand-secondary-500 border-brand-secondary-300",
  Pharmacy: "bg-brand-warning-50 text-brand-warning-500 border-brand-warning-300",
};

/* Patient data (mirrors DEP-01) */
interface Patient {
  id: string;
  name: string;
  label: string;
}

const patients: Patient[] = [
  { id: "member", name: "Catherine", label: "Member" },
  { id: "dep-a", name: "Ben", label: "Child, 6 yrs" },
  { id: "dep-b", name: "Anna", label: "Child, 10 yrs" },
];

/* Time windows */
const timeWindows = [
  { id: "morning", label: "Morning", sub: "8 am – 12 pm" },
  { id: "afternoon", label: "Afternoon", sub: "12 pm – 5 pm" },
  { id: "evening", label: "Evening", sub: "5 pm – 9 pm" },
] as const;

/* Date chips */
const dateChips = ["Today", "Tomorrow", "Pick date"] as const;

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function BOOK01BookVisitPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const facilityParam = searchParams.get("facility"); // e.g. "f1"

  /* ── Form state ── */
  const [selectedPatient, setSelectedPatient] = useState<string>("member");
  const [selectedService, setSelectedService] = useState<ServiceLabel | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("Today");
  const [selectedTime, setSelectedTime] = useState<string>("morning");
  const [notes, setNotes] = useState("");

  /* ── Derived ── */
  const facility = facilityParam ? facilitiesMap[facilityParam] ?? null : null;

  /* Available services based on facility */
  const availableServices = useMemo<ServiceLabel[]>(() => {
    if (!facility) return [...allServices];
    return facility.types.map((t) => typeToService[t]) as ServiceLabel[];
  }, [facility]);

  /* If selected service isn't available for this facility, clear it */
  const effectiveService =
    selectedService && availableServices.includes(selectedService)
      ? selectedService
      : null;

  /* Can submit? */
  const canSubmit = facility !== null && effectiveService !== null;

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
          className="text-[17px] text-brand-neutral-900"
          style={{ fontWeight: 600 }}
        >
          Book visit
        </h2>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[180px]">
        {/* ─────────────────────────────────────
            1) Facility
           ───────────────────────────────────── */}
        <div className="px-5 pt-4">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            FACILITY
          </p>

          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            {facility ? (
              /* Facility selected */
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-brand-primary-50 flex items-center justify-center shrink-0">
                  <Building2 size={18} className="text-brand-primary-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[14px] text-brand-neutral-900 truncate"
                    style={{ fontWeight: 500 }}
                  >
                    {facility.name}
                  </p>
                  <p
                    className="text-[11px] text-brand-neutral-500 mt-0.5"
                    style={{ fontWeight: 400 }}
                  >
                    {facility.types.join(" · ")} · {facility.distance}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/fac-01")}
                  className="text-[12px] text-brand-primary-500 shrink-0"
                  style={{ fontWeight: 500 }}
                >
                  Change
                </button>
              </div>
            ) : (
              /* No facility selected */
              <button
                onClick={() => navigate("/fac-01")}
                className="w-full flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
                  <Building2 size={18} className="text-brand-neutral-400" />
                </div>
                <div className="flex-1 text-left">
                  <p
                    className="text-[14px] text-brand-neutral-400"
                    style={{ fontWeight: 500 }}
                  >
                    Select facility
                  </p>
                  <p
                    className="text-[11px] text-brand-neutral-300 mt-0.5"
                    style={{ fontWeight: 400 }}
                  >
                    Choose where you'd like to visit
                  </p>
                </div>
                <ChevronRight size={16} className="text-brand-neutral-300 shrink-0" />
              </button>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────
            2) Patient
           ───────────────────────────────────── */}
        <div className="px-5 pt-4">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            PATIENT
          </p>

          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden">
            {patients.map((p, i) => {
              const isSelected = selectedPatient === p.id;
              const isMember = p.id === "member";
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatient(p.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-colors ${
                    i < patients.length - 1
                      ? "border-b border-brand-neutral-200"
                      : ""
                  } ${isSelected ? "bg-brand-primary-50/30" : "hover:bg-brand-neutral-50"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-brand-primary-50"
                        : "bg-brand-neutral-100"
                    }`}
                  >
                    {isMember ? (
                      <User
                        size={16}
                        className={
                          isSelected
                            ? "text-brand-primary-500"
                            : "text-brand-neutral-500"
                        }
                      />
                    ) : (
                      <Users
                        size={16}
                        className={
                          isSelected
                            ? "text-brand-primary-500"
                            : "text-brand-neutral-500"
                        }
                      />
                    )}
                  </div>

                  {/* Name + label */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-[13px] truncate ${
                        isSelected
                          ? "text-brand-primary-500"
                          : "text-brand-neutral-900"
                      }`}
                      style={{ fontWeight: 500 }}
                    >
                      {p.name}
                    </p>
                    <p
                      className="text-[11px] text-brand-neutral-500 mt-0.5"
                      style={{ fontWeight: 400 }}
                    >
                      {p.label}
                    </p>
                  </div>

                  {/* Check indicator */}
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-brand-primary-500 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-brand-neutral-0" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <p
            className="text-[11px] text-brand-neutral-400 mt-2 px-1"
            style={{ fontWeight: 400 }}
          >
            Bookings can be made for your dependents.
          </p>
        </div>

        {/* ─────────────────────────────────────
            3) Service
           ───────────────────────────────────── */}
        <div className="px-5 pt-4">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            SERVICE
          </p>

          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <div className="flex flex-wrap gap-2">
              {allServices.map((s) => {
                const isAvailable = availableServices.includes(s);
                const isActive = effectiveService === s;
                const Icon = serviceIcon[s];

                return (
                  <button
                    key={s}
                    disabled={!isAvailable}
                    onClick={() => setSelectedService(s)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] border-[1.5px] transition-colors ${
                      !isAvailable
                        ? "bg-brand-neutral-50 text-brand-neutral-300 border-brand-neutral-200 cursor-not-allowed opacity-50"
                        : isActive
                        ? serviceChipActive[s]
                        : "bg-brand-neutral-0 text-brand-neutral-700 border-brand-neutral-200 hover:bg-brand-neutral-50"
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    <Icon size={14} />
                    {s}
                  </button>
                );
              })}
            </div>

            {facility && availableServices.length < 3 && (
              <p
                className="text-[11px] text-brand-neutral-400 mt-3"
                style={{ fontWeight: 400 }}
              >
                Only services offered by {facility.name} are shown.
              </p>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────
            4) Preferred date & time
           ───────────────────────────────────── */}
        <div className="px-5 pt-4">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            PREFERRED DATE & TIME
          </p>

          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            {/* Date chips */}
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays
                size={14}
                className="text-brand-neutral-400 shrink-0"
              />
              {dateChips.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] transition-colors ${
                    selectedDate === d
                      ? "bg-brand-neutral-900 text-brand-neutral-0"
                      : "bg-brand-neutral-100 text-brand-neutral-700 hover:bg-brand-neutral-200"
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Time window */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-brand-neutral-400" />
                <p
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 500 }}
                >
                  Time window
                </p>
              </div>

              {timeWindows.map((tw) => {
                const isActive = selectedTime === tw.id;
                return (
                  <button
                    key={tw.id}
                    onClick={() => setSelectedTime(tw.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl border-[1.5px] transition-colors ${
                      isActive
                        ? "bg-brand-primary-50/40 border-brand-primary-300"
                        : "bg-brand-neutral-0 border-brand-neutral-200 hover:bg-brand-neutral-50"
                    }`}
                  >
                    <div>
                      <p
                        className={`text-[13px] ${
                          isActive
                            ? "text-brand-primary-500"
                            : "text-brand-neutral-900"
                        }`}
                        style={{ fontWeight: 500 }}
                      >
                        {tw.label}
                      </p>
                      <p
                        className="text-[11px] text-brand-neutral-500 mt-0.5"
                        style={{ fontWeight: 400 }}
                      >
                        {tw.sub}
                      </p>
                    </div>
                    {isActive && (
                      <div className="w-5 h-5 rounded-full bg-brand-primary-500 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-brand-neutral-0" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Notes */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <FileText size={14} className="text-brand-neutral-400" />
                <label
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 500 }}
                >
                  Reason / notes (optional)
                </label>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., fever for 2 days"
                rows={3}
                className="w-full px-3.5 py-3 bg-brand-neutral-0 border border-brand-neutral-200 rounded-xl text-[13px] text-brand-neutral-900 placeholder:text-brand-neutral-400 outline-none focus:border-brand-primary-300 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────
            Coverage hint card
           ───────────────────────────────────── */}
        <div className="px-5 pt-4 pb-4">
          <div className="bg-brand-primary-50 border border-brand-primary-100 rounded-2xl px-4 py-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary-100 flex items-center justify-center shrink-0 mt-0.5">
              <Info size={15} className="text-brand-primary-500" />
            </div>
            <div>
              <p
                className="text-[13px] text-brand-neutral-900 mb-0.5"
                style={{ fontWeight: 500 }}
              >
                Coverage check
              </p>
              <p
                className="text-[12px] text-brand-neutral-700"
                style={{ fontWeight: 400, lineHeight: "17px" }}
              >
                If you have an active package, the facility will apply the best
                one during care. Otherwise you can pay out-of-pocket.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Sticky bottom CTA ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4">
        <button
          disabled={!canSubmit}
          onClick={() =>
            navigate(
              `/book-02?facility=${facility?.id ?? ""}&patient=${selectedPatient}&service=${effectiveService ?? ""}&date=${selectedDate}&time=${selectedTime}`
            )
          }
          className={`w-full h-11 rounded-xl text-[14px] flex items-center justify-center gap-1.5 border-[1.5px] transition-colors ${
            canSubmit
              ? "bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-brand-neutral-900"
              : "bg-brand-neutral-200 text-brand-neutral-400 border-brand-neutral-200 cursor-not-allowed"
          }`}
          style={{ fontWeight: 500 }}
        >
          <Send size={14} />
          Send booking request
        </button>
      </div>

      {/* ══ Bottom Navigation ══ */}
    </div>
  );
}