import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Search,
  MapPin,
  ChevronRight,
  Stethoscope,
  FlaskConical,
  Pill,
  CheckCircle,
} from "lucide-react";

/* ══════════════════════════════════════════════
   Data
   ══════════════════════════════════════════════ */

type FacilityType = "Clinic" | "Lab" | "Pharmacy";

interface Facility {
  id: string;
  name: string;
  types: FacilityType[];
  distance: string;
  distanceKm: number;
  isOpen: boolean;
}

const facilities: Facility[] = [
  {
    id: "f1",
    name: "Mukono Family Clinic",
    types: ["Clinic"],
    distance: "1.2 km",
    distanceKm: 1.2,
    isOpen: true,
  },
  {
    id: "f2",
    name: "Sunrise Diagnostics",
    types: ["Lab"],
    distance: "2.1 km",
    distanceKm: 2.1,
    isOpen: true,
  },
  {
    id: "f3",
    name: "Divine Care Pharmacy",
    types: ["Pharmacy"],
    distance: "2.8 km",
    distanceKm: 2.8,
    isOpen: true,
  },
  {
    id: "f4",
    name: "Kisaasi Medical Centre",
    types: ["Clinic", "Lab"],
    distance: "3.0 km",
    distanceKm: 3.0,
    isOpen: false,
  },
  {
    id: "f5",
    name: "Wandegeya Health Hub",
    types: ["Clinic"],
    distance: "4.4 km",
    distanceKm: 4.4,
    isOpen: true,
  },
  {
    id: "f6",
    name: "Mengo Diagnostics",
    types: ["Lab"],
    distance: "5.2 km",
    distanceKm: 5.2,
    isOpen: true,
  },
  {
    id: "f7",
    name: "Ntinda Family Pharmacy",
    types: ["Pharmacy"],
    distance: "6.0 km",
    distanceKm: 6.0,
    isOpen: true,
  },
  {
    id: "f8",
    name: "Bukoto Care Point",
    types: ["Clinic", "Pharmacy"],
    distance: "6.5 km",
    distanceKm: 6.5,
    isOpen: true,
  },
];

/* ── Style helpers ── */

const typeFilterChips: ("All" | FacilityType)[] = [
  "All",
  "Clinic",
  "Lab",
  "Pharmacy",
];

const typeIcon: Record<FacilityType, typeof Stethoscope> = {
  Clinic: Stethoscope,
  Lab: FlaskConical,
  Pharmacy: Pill,
};

const typeChipStyles: Record<FacilityType, string> = {
  Clinic: "bg-brand-primary-50 text-brand-primary-500",
  Lab: "bg-brand-secondary-50 text-brand-secondary-500",
  Pharmacy: "bg-brand-warning-50 text-brand-warning-500",
};

/* Choose an icon-bg pair for the leading icon based on the first type */
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

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function FAC01FacilitiesListPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<"All" | FacilityType>(
    "All"
  );
  const [openNow, setOpenNow] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = facilities.filter((f) => {
    const matchType =
      activeFilter === "All" || f.types.includes(activeFilter);
    const matchSearch =
      search.trim() === "" ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.types.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchOpen = !openNow || f.isOpen;
    return matchType && matchSearch && matchOpen;
  });

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ App bar (fixed) ══ */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-brand-neutral-100 border-b border-brand-neutral-200">
        {/* Title row */}
        <div className="px-5 pt-6 pb-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/home-01")}
            className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-brand-neutral-900" />
          </button>
          <h2
            className="text-[17px] text-brand-neutral-900"
            style={{ fontWeight: 600 }}
          >
            Facilities
          </h2>
        </div>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[68px] pb-[80px]">
        {/* Search */}
        <div className="px-5 pt-3 pb-2.5">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-neutral-400"
            />
            <input
              type="text"
              placeholder="Search facilities"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-brand-neutral-0 border border-brand-neutral-200 rounded-xl text-[13px] text-brand-neutral-900 placeholder:text-brand-neutral-400 outline-none focus:border-brand-primary-300 transition-colors"
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="px-5 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {typeFilterChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveFilter(chip)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] whitespace-nowrap shrink-0 transition-colors ${
                activeFilter === chip
                  ? "bg-brand-neutral-900 text-brand-neutral-0"
                  : "bg-brand-neutral-0 text-brand-neutral-500 border border-brand-neutral-200"
              }`}
              style={{ fontWeight: 500 }}
            >
              {chip}
            </button>
          ))}

          {/* Separator dot */}
          <span className="shrink-0 flex items-center text-brand-neutral-300 text-[8px]">
            &bull;
          </span>

          {/* Open now toggle */}
          <button
            onClick={() => setOpenNow(!openNow)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] whitespace-nowrap shrink-0 transition-colors ${
              openNow
                ? "bg-brand-success-50 text-brand-success-500 border border-brand-success-500/30"
                : "bg-brand-neutral-0 text-brand-neutral-500 border border-brand-neutral-200"
            }`}
            style={{ fontWeight: 500 }}
          >
            Open now
          </button>
        </div>

        {/* Results count */}
        <div className="px-5 pb-2.5">
          <p
            className="text-[12px] text-brand-neutral-500 px-1"
            style={{ fontWeight: 400 }}
          >
            {filtered.length}{" "}
            {filtered.length === 1 ? "facility" : "facilities"} found
          </p>
        </div>

        {/* Facility cards */}
        <div className="px-5 space-y-2.5">
          {filtered.map((f) => {
            const primaryType = f.types[0];
            const PrimaryIcon = typeIcon[primaryType];

            return (
              <button
                key={f.id}
                onClick={() => navigate(`/fac-02/${f.id}`)}
                className="w-full bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 text-left hover:bg-brand-neutral-50 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  {/* Leading icon */}
                  <div
                    className={`w-11 h-11 rounded-xl ${typeIconBg[primaryType]} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <PrimaryIcon
                      size={20}
                      className={typeIconFg[primaryType]}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Name */}
                    <p
                      className="text-[14px] text-brand-neutral-900 truncate mb-1.5"
                      style={{ fontWeight: 500 }}
                    >
                      {f.name}
                    </p>

                    {/* Type chips + Open/Closed row */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-2">
                      {f.types.map((t) => (
                        <span
                          key={t}
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${typeChipStyles[t]}`}
                          style={{ fontWeight: 500 }}
                        >
                          {t}
                        </span>
                      ))}

                      {/* Open / Closed badge */}
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${
                          f.isOpen
                            ? "bg-brand-success-50 text-brand-success-500"
                            : "bg-brand-neutral-100 text-brand-neutral-500"
                        }`}
                        style={{ fontWeight: 500 }}
                      >
                        {f.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>

                    {/* Meta row: Distance + AbaAccess badge */}
                    <div className="flex items-center gap-3">
                      {/* Distance */}
                      <span className="inline-flex items-center gap-1 text-[11px] text-brand-neutral-500">
                        <MapPin
                          size={10}
                          className="text-brand-neutral-300"
                        />
                        {f.distance}
                      </span>

                      {/* AbaAccess badge */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-success-50 text-[10px] text-brand-success-500"
                        style={{ fontWeight: 500 }}
                      >
                        <CheckCircle size={10} />
                        Accepts AbaAccess
                      </span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <ChevronRight
                    size={16}
                    className="text-brand-neutral-300 shrink-0 mt-2"
                  />
                </div>
              </button>
            );
          })}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="py-16 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-brand-neutral-200 flex items-center justify-center mb-4">
                <Search size={20} className="text-brand-neutral-500" />
              </div>
              <p
                className="text-[14px] text-brand-neutral-900 mb-1"
                style={{ fontWeight: 500 }}
              >
                No facilities found
              </p>
              <p
                className="text-[12px] text-brand-neutral-500 text-center"
                style={{ fontWeight: 400, maxWidth: 240 }}
              >
                Try a different search term or adjust your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}