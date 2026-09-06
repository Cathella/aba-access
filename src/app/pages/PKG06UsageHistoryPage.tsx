import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Clock,
  Stethoscope,
  TestTubes,
  Pill,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

/* ── Filter options ── */
const filters = ["All", "Consultation", "Lab", "Pharmacy"] as const;
type Filter = (typeof filters)[number];
type Category = Exclude<Filter, "All">;

interface ActivityItem {
  id: string;
  category: Category;
  facility: string;
  patient: string;
  covered: boolean;
  date: string;
}

const categoryMeta: Record<Category, { title: string; icon: React.ReactNode }> = {
  Consultation: { title: "Consultation redeemed", icon: <Stethoscope size={16} /> },
  Lab: { title: "Lab test redeemed", icon: <TestTubes size={16} /> },
  Pharmacy: { title: "Pharmacy visit redeemed", icon: <Pill size={16} /> },
};

const categoryColors: Record<Category, { bg: string; text: string }> = {
  Consultation: { bg: "bg-brand-primary-50", text: "text-brand-primary-500" },
  Lab: { bg: "bg-brand-warning-50", text: "text-brand-warning-500" },
  Pharmacy: { bg: "bg-brand-secondary-50", text: "text-brand-secondary-500" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-UG", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export function PKG06UsageHistoryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("package") || "care-bundle-50k";

  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("approval_requests")
      .select("id, facility_name, service_type, patient_name, covered, responded_at")
      .eq("status", "Approved")
      .order("responded_at", { ascending: false })
      .then(({ data }) => {
        setItems(
          (data ?? [])
            .filter((r) => r.service_type in categoryMeta)
            .map((r) => ({
              id: r.id,
              category: r.service_type as Category,
              facility: r.facility_name,
              patient: r.patient_name,
              covered: r.covered,
              date: formatDate(r.responded_at),
            }))
        );
        setLoading(false);
      });
  }, []);

  const filteredItems =
    activeFilter === "All"
      ? items
      : items.filter((i) => i.category === activeFilter);

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ── App Bar (fixed top) ── */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 flex items-center gap-3 border-b border-brand-neutral-200">
        <button
          onClick={() => navigate(`/pkg-05?package=${packageId}`)}
          className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
        >
          <ArrowLeft size={16} className="text-brand-neutral-900" />
        </button>
        <h2
          className="text-[17px] text-brand-neutral-900"
          style={{ fontWeight: 600 }}
        >
          Usage history
        </h2>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[80px] px-5">
        {/* ── Filter chips ── */}
        <div className="flex gap-2 mt-4 mb-4 overflow-x-auto no-scrollbar">
          {filters.map((f) => {
            const isActive = f === activeFilter;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`shrink-0 h-8 px-3.5 rounded-full text-[12px] border transition-colors ${
                  isActive
                    ? "bg-brand-neutral-900 text-brand-neutral-0 border-brand-neutral-900"
                    : "bg-brand-neutral-0 text-brand-neutral-700 border-brand-neutral-200 hover:bg-brand-neutral-100"
                }`}
                style={{ fontWeight: 500 }}
              >
                {f}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-brand-primary-500 border-t-transparent animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[220px]">
            <div className="w-14 h-14 rounded-full bg-brand-neutral-100 flex items-center justify-center mb-4">
              <Clock size={24} className="text-brand-neutral-500" />
            </div>
            <h3
              className="text-[17px] text-brand-neutral-900 mb-1"
              style={{ fontWeight: 600 }}
            >
              No activity yet
            </h3>
            <p
              className="text-[13px] text-brand-neutral-500 text-center max-w-[260px]"
              style={{ fontWeight: 400 }}
            >
              Once you approve a facility request, your usage will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredItems.map((item) => {
              const meta = categoryMeta[item.category];
              const color = categoryColors[item.category];
              return (
                <div
                  key={item.id}
                  className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4"
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl ${color.bg} ${color.text} flex items-center justify-center shrink-0 mt-0.5`}
                    >
                      {meta.icon}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[13px] text-brand-neutral-900 mb-0.5"
                        style={{ fontWeight: 500 }}
                      >
                        {meta.title}
                      </p>
                      <p
                        className="text-[12px] text-brand-neutral-500 mb-1.5"
                        style={{ fontWeight: 400 }}
                      >
                        at {item.facility}
                      </p>

                      <div className="flex items-center justify-between">
                        <span
                          className="text-[11px] text-brand-neutral-500"
                          style={{ fontWeight: 400 }}
                        >
                          Patient: {item.patient}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] ${
                            item.covered ? "text-brand-success-500" : "text-brand-warning-500"
                          }`}
                          style={{ fontWeight: 500 }}
                        >
                          {item.covered ? (
                            <>
                              <ShieldCheck size={11} /> Covered
                            </>
                          ) : (
                            <>
                              <AlertTriangle size={11} /> Out-of-pocket
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Date footer */}
                  <div className="mt-2.5 pt-2.5 border-t border-brand-neutral-200">
                    <span
                      className="text-[11px] text-brand-neutral-500"
                      style={{ fontWeight: 400 }}
                    >
                      {item.date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
