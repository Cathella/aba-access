import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { Inbox, ChevronRight, Clock } from "lucide-react";
import { supabase } from "../../lib/supabase";

type ApprovalRequest = {
  id: string;
  facility_name: string;
  service_type: "Consultation" | "Lab" | "Pharmacy";
  patient_name: string;
  status: "Pending" | "Approved" | "Declined" | "Expired";
  created_at: string;
  expires_at: string;
};

const typeChipStyles: Record<string, string> = {
  Consultation: "bg-brand-secondary-50 text-brand-secondary-500",
  Lab: "bg-brand-warning-50 text-brand-warning-500",
  Pharmacy: "bg-brand-success-50 text-brand-success-500",
};

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? "s" : ""} ago`;
}

export function APR01ApprovalsInboxPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("approval_requests")
      .select("id, facility_name, service_type, patient_name, status, created_at, expires_at")
      .in("status", ["Pending", "Expired"])
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        // Mark any Pending rows whose expires_at has passed as Expired in-memory
        const now = new Date();
        const normalised = (data ?? []).map((r) =>
          r.status === "Pending" && new Date(r.expires_at) < now
            ? { ...r, status: "Expired" as const }
            : r
        );
        setRequests(normalised);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <h2 className="text-[22px] tracking-[-0.01em] text-brand-neutral-900" style={{ fontWeight: 600 }}>
          Approvals
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pt-[72px] pb-[80px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-brand-primary-500 border-t-transparent animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex-1 px-5 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-neutral-200 flex items-center justify-center mb-4">
              <Inbox size={28} className="text-brand-neutral-400" />
            </div>
            <h3 className="text-[17px] text-brand-neutral-900 mb-1.5 text-center" style={{ fontWeight: 600 }}>
              No approval requests
            </h3>
            <p className="text-[13px] text-brand-neutral-500 text-center max-w-[260px]" style={{ fontWeight: 400 }}>
              When a facility requests coverage, it will appear here.
            </p>
          </div>
        ) : (
          <div className="px-5 pt-4 pb-4 space-y-3">
            {requests.map((req) => {
              const isExpired = req.status === "Expired";
              return (
                <button
                  key={req.id}
                  onClick={() => navigate(isExpired ? "/apr-09?id=" + req.id : "/apr-02?id=" + req.id)}
                  className={`w-full text-left bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 transition-colors active:bg-brand-neutral-100 ${isExpired ? "opacity-70" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3
                      className={`text-[14px] ${isExpired ? "text-brand-neutral-500" : "text-brand-neutral-900"}`}
                      style={{ fontWeight: 600 }}
                    >
                      {req.facility_name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] shrink-0 ${isExpired ? "bg-brand-neutral-200 text-brand-neutral-500" : "bg-brand-neutral-100 text-brand-neutral-700"}`}
                      style={{ fontWeight: 500 }}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${typeChipStyles[req.service_type] ?? ""}`}
                      style={{ fontWeight: 500 }}
                    >
                      {req.service_type}
                    </span>
                    <span className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400 }}>
                      {req.patient_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    <Clock size={11} className="text-brand-neutral-400" />
                    <p className="text-[11px] text-brand-neutral-400" style={{ fontWeight: 400 }}>
                      {timeAgo(req.created_at)}
                    </p>
                  </div>

                  <div className={`flex items-center justify-end gap-1 text-[13px] ${isExpired ? "text-brand-neutral-400" : "text-brand-primary-500"}`}>
                    <span style={{ fontWeight: 500 }}>{isExpired ? "View" : "Review"}</span>
                    <ChevronRight size={14} />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav activeTab="approvals" />
    </div>
  );
}
