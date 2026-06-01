import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  FileText,
  Download,
  ExternalLink,
  Clock,
  Pill,
  Info,
} from "lucide-react";

/* ══════════════════════════════════════════════
   Data types
   ══════════════════════════════════════════════ */

interface LabDocument {
  name: string;
  date: string;
}

interface Medicine {
  name: string;
  dosage: string;
  qty: number;
}

interface DocumentsData {
  visitId: string;
  facility: string;
  labResults: {
    status: "Available" | "Pending";
    documents: LabDocument[];
  };
  prescription: {
    medicines: Medicine[];
  };
  facilityNotes: string | null;
}

/* ══════════════════════════════════════════════
   Sample data keyed by visitId
   ══════════════════════════════════════════════ */

const documentsData: Record<string, DocumentsData> = {
  "visit-001": {
    visitId: "visit-001",
    facility: "Mukono Family Clinic",
    labResults: {
      status: "Available",
      documents: [
        { name: "CBC Results.pdf", date: "19 Feb 2026" },
      ],
    },
    prescription: {
      medicines: [
        { name: "Amoxicillin", dosage: "500mg", qty: 10 },
        { name: "Paracetamol", dosage: "500mg", qty: 20 },
      ],
    },
    facilityNotes: null,
  },
  "visit-002": {
    visitId: "visit-002",
    facility: "Sunrise Diagnostics",
    labResults: {
      status: "Pending",
      documents: [],
    },
    prescription: {
      medicines: [],
    },
    facilityNotes: null,
  },
  "visit-003": {
    visitId: "visit-003",
    facility: "Divine Care Pharmacy",
    labResults: {
      status: "Pending",
      documents: [],
    },
    prescription: {
      medicines: [
        { name: "Amoxicillin", dosage: "500mg", qty: 10 },
        { name: "Paracetamol", dosage: "500mg", qty: 20 },
      ],
    },
    facilityNotes: null,
  },
};

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function CARE03DocumentsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const visitId = searchParams.get("visitId") || "visit-001";
  const data = documentsData[visitId] ?? documentsData["visit-001"];

  const labAvailable = data.labResults.status === "Available";
  const hasPrescription = data.prescription.medicines.length > 0;

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ App Bar (fixed) ══ */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/care-02?id=" + visitId)}
            className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-brand-neutral-900" />
          </button>
          <h2
            className="text-[17px] text-brand-neutral-900"
            style={{ fontWeight: 600 }}
          >
            Documents
          </h2>
        </div>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className={`flex-1 overflow-y-auto pt-[72px] ${hasPrescription ? "pb-[80px]" : "pb-[24px]"}`}>
        <div className="px-5 pt-4 space-y-3">
          {/* ──────────────────────────────────────
              Section A — Lab results
          ────────────────────────────────────── */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
              <h4
                className="text-[13px] text-brand-neutral-900"
                style={{ fontWeight: 600 }}
              >
                Lab results
              </h4>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${
                  labAvailable
                    ? "bg-brand-success-50 text-brand-success-500"
                    : "bg-brand-warning-50 text-brand-warning-500"
                }`}
                style={{ fontWeight: 500 }}
              >
                {data.labResults.status}
              </span>
            </div>

            {labAvailable ? (
              /* ── Available — document rows ── */
              <div className="space-y-2.5">
                {data.labResults.documents.map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center gap-3 bg-brand-neutral-100 rounded-xl p-3"
                  >
                    {/* File icon */}
                    <div className="w-9 h-9 rounded-lg bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center shrink-0">
                      <FileText
                        size={16}
                        className="text-brand-neutral-500"
                      />
                    </div>

                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[13px] text-brand-neutral-900 truncate"
                        style={{ fontWeight: 500 }}
                      >
                        {doc.name}
                      </p>
                      <p
                        className="text-[11px] text-brand-neutral-400"
                        style={{ fontWeight: 400 }}
                      >
                        {doc.date}
                      </p>
                    </div>

                    {/* Open action */}
                    <button className="inline-flex items-center gap-1 text-[12px] text-brand-primary-500 shrink-0">
                      <span style={{ fontWeight: 500 }}>Open</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* ── Pending — info message ── */
              <div className="flex items-center gap-2.5 bg-brand-neutral-100 rounded-xl p-3">
                <Clock
                  size={14}
                  className="text-brand-warning-500 shrink-0"
                />
                <p
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  Results will appear once uploaded by the facility.
                </p>
              </div>
            )}
          </div>

          {/* ──────────────────────────────────────
              Section B — Prescription
          ────────────────────────────────────── */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            <h4
              className="text-[13px] text-brand-neutral-900 mb-3"
              style={{ fontWeight: 600 }}
            >
              Prescription
            </h4>

            {hasPrescription ? (
              <>
                {/* Medicine list */}
                <div className="space-y-2.5">
                  {data.prescription.medicines.map((med) => (
                    <div
                      key={med.name + med.dosage}
                      className="flex items-center gap-3 bg-brand-neutral-100 rounded-xl p-3"
                    >
                      {/* Pill icon */}
                      <div className="w-9 h-9 rounded-lg bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center shrink-0">
                        <Pill
                          size={16}
                          className="text-brand-success-500"
                        />
                      </div>

                      {/* Medicine info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[13px] text-brand-neutral-900"
                          style={{ fontWeight: 500 }}
                        >
                          {med.name} {med.dosage}
                        </p>
                        <p
                          className="text-[11px] text-brand-neutral-400"
                          style={{ fontWeight: 400 }}
                        >
                          Qty: x{med.qty}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* ── No prescription ── */
              <div className="flex items-center gap-2.5 bg-brand-neutral-100 rounded-xl p-3">
                <Pill
                  size={14}
                  className="text-brand-neutral-400 shrink-0"
                />
                <p
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 400 }}
                >
                  No prescription on file for this visit.
                </p>
              </div>
            )}
          </div>

          {/* ──────────────────────────────────────
              Section C — Facility notes
          ────────────────────────────────────── */}
          <div className="bg-brand-neutral-100 border border-brand-neutral-200 rounded-2xl px-4 py-3 flex items-start gap-2.5 mb-4">
            <Info
              size={14}
              className="text-brand-neutral-400 shrink-0 mt-0.5"
            />
            <p
              className="text-[11px] text-brand-neutral-500"
              style={{ fontWeight: 400 }}
            >
              {data.facilityNotes || "No notes provided."}
            </p>
          </div>
        </div>
      </div>

      {/* ══ Fixed bottom CTA — only when prescription exists ══ */}
      {hasPrescription && (
        <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4">
          <button className="w-full h-11 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors">
            <Download size={14} />
            <span style={{ fontWeight: 500 }}>Download prescription</span>
          </button>
        </div>
      )}

    </div>
  );
}