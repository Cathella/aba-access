import { useState, useEffect } from "react";
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
import { supabase } from "../../lib/supabase";

/* ══════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════ */

type FacilityType = "Clinic" | "Lab" | "Pharmacy";
type ServiceLabel = "Consultation" | "Lab tests" | "Pharmacy";

interface Facility {
  id: string;
  name: string;
  types: FacilityType[];
  address: string | null;
  region: string | null;
  phone: string;
  isOpen: boolean;
  hoursNote: string | null;
}


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

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function FAC02FacilityProfilePage() {
  const navigate = useNavigate();
  const { facilityId } = useParams();

  const [facility, setFacility] = useState<Facility | null | undefined>(undefined);

  useEffect(() => {
    if (!facilityId) { setFacility(null); return; }
    supabase
      .from("facilities")
      .select("id, name, types, address, region, phone, is_open, hours_note")
      .eq("id", facilityId)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) { setFacility(null); return; }
        setFacility({
          id: data.id,
          name: data.name,
          types: (data.types ?? []) as FacilityType[],
          address: data.address,
          region: data.region,
          phone: data.phone,
          isOpen: data.is_open,
          hoursNote: data.hours_note,
        });
      });
  }, [facilityId]);

  if (facility === undefined) {
    return (
      <div className="min-h-screen bg-brand-neutral-100 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-brand-primary-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="min-h-screen bg-brand-neutral-100 flex items-center justify-center px-5">
        <p className="text-[13px] text-brand-neutral-500">Facility not found.</p>
      </div>
    );
  }

  const primaryType = facility.types[0] ?? "Clinic";
  const PrimaryIcon = typeIcon[primaryType];

  /* Derive services from types */
  const services = facility.types.map((t) => ({
    type: t,
    ...typeToService[t],
    icon: typeIcon[t],
  }));

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

            {/* Location */}
            {(facility.address || facility.region) && (
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={13} className="text-brand-neutral-400 shrink-0" />
                <p
                  className="text-[13px] text-brand-neutral-700"
                  style={{ fontWeight: 400 }}
                >
                  {[facility.address, facility.region].filter(Boolean).join(" · ")}
                </p>
              </div>
            )}

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
            <div className="flex items-start gap-2.5">
              <Clock size={14} className="text-brand-neutral-400 shrink-0 mt-0.5" />
              <p
                className="text-[13px] text-brand-neutral-700"
                style={{ fontWeight: 400, lineHeight: 1.5 }}
              >
                {facility.hoursNote || "Hours not listed yet."}
              </p>
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
