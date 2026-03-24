import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  ReceiptText,
  Package,
} from "lucide-react";
import { BottomNav } from "../components/BottomNav";

/* ══════════════════════════════════════════════
   Types & data
   ══════════════════════════════════════════════ */

type TxType = "package" | "topup" | "oop";
type TxStatus = "completed" | "pending" | "failed";

interface Transaction {
  id: string;
  type: TxType;
  title: string;
  subtitle: string;
  amount: string;
  amountSign: "credit" | "debit";
  status: TxStatus;
  date: string;
  time: string;
}

const transactions: Transaction[] = [
  {
    id: "TX-00091",
    type: "package",
    title: "Package purchase",
    subtitle: "Care Bundle 50K",
    amount: "- UGX 50,000",
    amountSign: "debit",
    status: "completed",
    date: "Today",
    time: "2:34 PM",
  },
  {
    id: "TX-00092",
    type: "topup",
    title: "Top up",
    subtitle: "Airtel Money",
    amount: "+ UGX 20,000",
    amountSign: "credit",
    status: "pending",
    date: "Today",
    time: "1:10 PM",
  },
  {
    id: "TX-00088",
    type: "topup",
    title: "Top up",
    subtitle: "MTN Mobile Money",
    amount: "+ UGX 100,000",
    amountSign: "credit",
    status: "completed",
    date: "Yesterday",
    time: "10:22 AM",
  },
  {
    id: "TX-00074",
    type: "oop",
    title: "Out-of-pocket",
    subtitle: "Sunrise Diagnostics",
    amount: "- UGX 15,000",
    amountSign: "debit",
    status: "completed",
    date: "12 Feb 2026",
    time: "3:45 PM",
  },
];

type FilterKey = "all" | "packages" | "topups" | "oop";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "packages", label: "Packages" },
  { key: "topups", label: "Top ups" },
  { key: "oop", label: "Out-of-pocket" },
];

/* ══════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════ */

function statusClasses(s: TxStatus) {
  switch (s) {
    case "completed":
      return "bg-brand-success-50 text-brand-success-500";
    case "pending":
      return "bg-brand-neutral-100 text-brand-neutral-500";
    case "failed":
      return "bg-brand-error-50 text-brand-error-500";
  }
}

function statusLabel(s: TxStatus) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function WAL03TransactionsPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = transactions;
    if (activeFilter !== "all") {
      const typeMap: Record<FilterKey, TxType | null> = {
        all: null,
        packages: "package",
        topups: "topup",
        oop: "oop",
      };
      const t = typeMap[activeFilter];
      if (t) list = list.filter((tx) => tx.type === t);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (tx) =>
          tx.title.toLowerCase().includes(q) ||
          tx.subtitle.toLowerCase().includes(q) ||
          tx.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeFilter, query]);

  const isEmpty = filtered.length === 0;
  const isEmptyAll =
    activeFilter === "all" && !query.trim() && transactions.length === 0;

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ═══════════════════════════════════════
          App bar (fixed)
         ═══════════════════════════════════════ */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 flex items-center gap-3 border-b border-brand-neutral-200">
        <button
          onClick={() => navigate("/wal-01")}
          className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
        >
          <ArrowLeft size={16} className="text-brand-neutral-900" />
        </button>
        <h2
          className="text-[17px] text-brand-neutral-900"
          style={{ fontWeight: 600 }}
        >
          Transactions
        </h2>
      </div>

      {/* ═══════════════════════════════════════
          Scrollable content
         ═══════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto pt-[80px] pb-24">
        {/* ─────────────────────────────────────
            Search
           ───────────────────────────────────── */}
        <div className="px-5 pt-4 pb-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-neutral-400"
            />
            <input
              type="text"
              placeholder="Search transactions"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-brand-neutral-0 border border-brand-neutral-200 rounded-xl text-[13px] text-brand-neutral-900 placeholder:text-brand-neutral-300"
              style={{ fontWeight: 400 }}
            />
          </div>
        </div>

        {/* ─────────────────────────────────────
            Filter chips
           ───────────────────────────────────── */}
        <div className="px-5 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {filters.map((f) => {
              const isActive = activeFilter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`shrink-0 h-8 px-3.5 rounded-full text-[12px] border-[1.5px] transition-colors ${
                    isActive
                      ? "bg-brand-neutral-900 border-brand-neutral-900 text-brand-neutral-0"
                      : "bg-brand-neutral-0 border-brand-neutral-200 text-brand-neutral-700 hover:border-brand-neutral-300"
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─────────────────────────────────────
            Empty state (absolute empty)
           ───────────────────────────────────── */}
        {isEmptyAll && (
          <div className="px-5 pb-4">
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5 flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-xl bg-brand-neutral-100 flex items-center justify-center mb-3">
                <ReceiptText size={20} className="text-brand-neutral-500" />
              </div>
              <p
                className="text-[14px] text-brand-neutral-900 mb-1"
                style={{ fontWeight: 500 }}
              >
                No transactions yet
              </p>
              <p
                className="text-[12px] text-brand-neutral-500 mb-4"
                style={{ fontWeight: 400, lineHeight: "18px" }}
              >
                Top up your wallet or buy a package to see activity here.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/wal-02")}
                  className="h-9 px-4 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  <ArrowDownLeft size={13} />
                  Top up
                </button>
                <button
                  onClick={() => navigate("/pkg-01")}
                  className="h-9 px-4 bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  <Package size={13} />
                  Browse packages
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────
            Filtered empty state
           ───────────────────────────────────── */}
        {isEmpty && !isEmptyAll && (
          <div className="px-5 pb-4">
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5 flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-xl bg-brand-neutral-100 flex items-center justify-center mb-3">
                <Search size={20} className="text-brand-neutral-500" />
              </div>
              <p
                className="text-[14px] text-brand-neutral-900 mb-1"
                style={{ fontWeight: 500 }}
              >
                No results
              </p>
              <p
                className="text-[12px] text-brand-neutral-500"
                style={{ fontWeight: 400, lineHeight: "18px" }}
              >
                Try adjusting your filter or search query.
              </p>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────
            Transaction list
           ───────────────────────────────────── */}
        {!isEmpty && (
          <div className="px-5 pb-4">
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden">
              {filtered.map((tx, i) => (
                <button
                  key={tx.id}
                  onClick={() => navigate(`/wal-04/${tx.id}`)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-brand-neutral-100 transition-colors ${
                    i < filtered.length - 1
                      ? "border-b border-brand-neutral-200"
                      : ""
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.amountSign === "credit"
                        ? "bg-brand-success-50"
                        : "bg-brand-neutral-100"
                    }`}
                  >
                    {tx.amountSign === "credit" ? (
                      <ArrowDownLeft
                        size={16}
                        className="text-brand-success-500"
                      />
                    ) : (
                      <ArrowUpRight
                        size={16}
                        className="text-brand-neutral-700"
                      />
                    )}
                  </div>

                  {/* Title / subtitle */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p
                        className="text-[13px] text-brand-neutral-900 truncate"
                        style={{ fontWeight: 500 }}
                      >
                        {tx.title}
                      </p>
                      <span
                        className={`shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] ${statusClasses(
                          tx.status
                        )}`}
                        style={{ fontWeight: 500 }}
                      >
                        {statusLabel(tx.status)}
                      </span>
                    </div>
                    <p
                      className="text-[11px] text-brand-neutral-500"
                      style={{ fontWeight: 400 }}
                    >
                      {tx.subtitle}
                    </p>
                  </div>

                  {/* Amount / date */}
                  <div className="text-right shrink-0">
                    <p
                      className={`text-[13px] ${
                        tx.amountSign === "credit"
                          ? "text-brand-success-500"
                          : "text-brand-neutral-900"
                      }`}
                      style={{ fontWeight: 500 }}
                    >
                      {tx.amount}
                    </p>
                    <p
                      className="text-[11px] text-brand-neutral-500 mt-0.5"
                      style={{ fontWeight: 400 }}
                    >
                      {tx.date}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════
          Bottom Navigation (fixed)
         ═══════════════════════════════════════ */}
    </div>
  );
}