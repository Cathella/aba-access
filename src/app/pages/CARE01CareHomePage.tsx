import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { CalendarDays, ChevronRight } from "lucide-react";
import { supabase } from "../../lib/supabase";

type ServiceType = "Consultation" | "Lab" | "Pharmacy";

type ApprovedVisit = {
  id: string;
  facility_name: string;
  service_type: ServiceType;
  patient_name: string;
  covered: boolean;
  responded_at: string;
};

type VisitGroup = { header: string; visits: ApprovedVisit[] };

const serviceChipStyles: Record<ServiceType, string> = {
  Consultation: "bg-brand-secondary-50 text-brand-secondary-500",
  Lab: "bg-brand-warning-50 text-brand-warning-500",
  Pharmacy: "bg-brand-success-50 text-brand-success-500",
};

function groupByDate(items: ApprovedVisit[]): VisitGroup[] {
  const todayMs = new Date().setHours(0, 0, 0, 0);
  const yesterdayMs = todayMs - 86400000;
  const groups = new Map<string, ApprovedVisit[]>();

  for (const item of items) {
    const d = new Date(item.responded_at);
    const dayMs = new Date(d).setHours(0, 0, 0, 0);
    const label =
      dayMs === todayMs ? "Today"
      : dayMs === yesterdayMs ? "Yesterday"
      : d.toLocaleDateString("en-UG", { day: "numeric", month: "short", year: "numeric" });

    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(item);
  }

  return Array.from(groups.entries()).map(([header, visits]) => ({ header, visits }));
}

type Filter = "All" | "Covered" | "Out-of-pocket";
const filters: Filter[] = ["All", "Covered", "Out-of-pocket"];

export function CARE01CareHomePage() {
  const navigate = useNavigate();
  const [visits, setVisits] = useState<ApprovedVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  useEffect(() => {
    supabase
      .from("approval_requests")
      .select("id, facility_name, service_type, patient_name, covered, responded_at")
      .eq("status", "Approved")
      .order("responded_at", { ascending: false })
      .then(({ data }) => {
        setVisits(data ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = visits.filter((v) => {
    if (activeFilter === "Covered") return v.covered;
    if (activeFilter === "Out-of-pocket") return !v.covered;
    return true;
  });

  const groups = groupByDate(filtered);

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 border-b border-brand-neutral-200">
        <div className="px-5 pt-6 pb-3">
          <h2 className="text-[22px] tracking-[-0.01em] text-brand-neutral-900" style={{ fontWeight: 600 }}>
            My Care
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-[72px] pb-[80px] flex flex-col">
        {/* Filter chips */}
        <div className="px-5 pt-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          {filters.map((label) => (
            <button
              key={label}
              onClick={() => setActiveFilter(label)}
              className={`shrink-0 h-8 px-3.5 rounded-full text-[12px] border transition-colors ${
                activeFilter === label
                  ? "bg-brand-neutral-900 text-brand-neutral-0 border-brand-neutral-900"
                  : "bg-brand-neutral-0 text-brand-neutral-500 border-brand-neutral-200 hover:bg-brand-neutral-200"
              }`}
              style={{ fontWeight: 500 }}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-brand-primary-500 border-t-transparent animate-spin" />
          </div>
        ) : visits.length === 0 ? (
          <div className="flex-1 px-5 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-neutral-200 flex items-center justify-center mb-4">
              <CalendarDays size={28} className="text-brand-neutral-400" />
            </div>
            <h3 className="text-[17px] text-brand-neutral-900 mb-1.5 text-center" style={{ fontWeight: 600 }}>
              No visits yet
            </h3>
            <p className="text-[13px] text-brand-neutral-500 text-center max-w-[260px] mb-6" style={{ fontWeight: 400 }}>
              Your visits will appear here after you approve facility requests.
            </p>
            <button
              onClick={() => navigate("/pkg-01")}
              className="h-10 w-full max-w-[260px] bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1 transition-colors mb-2.5"
              style={{ fontWeight: 500 }}
            >
              Browse packages <ChevronRight size={14} />
            </button>
            <button
              onClick={() => navigate("/apr-01")}
              className="h-10 w-full max-w-[260px] bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1 transition-colors"
              style={{ fontWeight: 500 }}
            >
              View approvals <ChevronRight size={14} />
            </button>
          </div>
        ) : (
          <div className="px-5 pt-4 pb-4 space-y-5">
            {groups.length === 0 && (
              <p className="text-[13px] text-brand-neutral-500 text-center py-8" style={{ fontWeight: 400 }}>
                No visits match this filter.
              </p>
            )}
            {groups.map((group) => (
              <div key={group.header}>
                <h4 className="text-[12px] text-brand-neutral-500 mb-2.5 px-0.5" style={{ fontWeight: 500 }}>
                  {group.header}
                </h4>
                <div className="space-y-3">
                  {group.visits.map((visit) => (
                    <button
                      key={visit.id}
                      onClick={() => navigate("/care-02?id=" + visit.id)}
                      className="w-full text-left bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 transition-colors active:bg-brand-neutral-100"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-[14px] text-brand-neutral-900" style={{ fontWeight: 600 }}>
                          {visit.facility_name}
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] shrink-0 bg-brand-success-50 text-brand-success-500" style={{ fontWeight: 500 }}>
                          Completed
                        </span>
                      </div>
                      <p className="text-[12px] text-brand-neutral-500 mb-2" style={{ fontWeight: 400 }}>
                        {visit.patient_name}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${serviceChipStyles[visit.service_type]}`} style={{ fontWeight: 500 }}>
                          {visit.service_type}
                        </span>
                        <span className="text-[11px] text-brand-neutral-500" style={{ fontWeight: 400 }}>
                          {visit.covered ? "Covered" : "Out-of-pocket"}
                        </span>
                      </div>
                      <div className="flex items-center justify-end gap-1 text-[13px] text-brand-primary-500">
                        <span style={{ fontWeight: 500 }}>View details</span>
                        <ChevronRight size={14} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav activeTab="care" />
    </div>
  );
}
