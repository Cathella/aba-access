import {
  Bell,
  Package,
  ClipboardList,
  Activity,
  Wallet,
  ChevronRight,
  MapPin,
  Stethoscope,
  FlaskConical,
  Pill,
  Users,
  Clock,
  Copy,
  Eye,
  EyeOff,
  CalendarPlus,
  CalendarCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useState } from "react";
import { BottomNav } from "../components/BottomNav";
import { getGreetingName } from "../profileStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

/* ══════════════════════════════════════════════
   Active packages data
   ══════════════════════════════════════════════ */

const activePackages = [
  {
    id: "pkg-1",
    name: "Care Bundle 50K",
    validDays: 30,
    benefits: [
      { label: "Consult 6", icon: Stethoscope },
      { label: "Lab 3", icon: FlaskConical },
      { label: "Pharmacy cap 30k", icon: Pill },
    ],
    isPrimary: true,
  },
  {
    id: "pkg-2",
    name: "Lab Plus 20K",
    remaining: "5 tests",
  },
  {
    id: "pkg-3",
    name: "Pharmacy Top-up",
    remaining: "Cap 20k",
  },
  {
    id: "pkg-4",
    name: "Family Dental",
    remaining: "2 visits",
  },
];

/* ══════════════════════════════════════════════
   Quick actions data
   ══════════════════════════════════════════════ */

const quickActions = [
  {
    icon: Package,
    label: "Buy package",
    route: "/pkg-01",
    bg: "bg-brand-primary-50",
    fg: "text-brand-primary-500",
  },
  {
    icon: CalendarPlus,
    label: "Book visit",
    route: "/book-01",
    bg: "bg-brand-secondary-50",
    fg: "text-brand-secondary-500",
  },
  {
    icon: Wallet,
    label: "Wallet",
    route: "/wal-01",
    bg: "bg-brand-neutral-200",
    fg: "text-brand-neutral-700",
  },
];

/* ══════════════════════════════════════════════
   Recent visits data
   ══════════════════════════════════════════════ */

const recentVisits = [
  {
    id: "v1",
    facility: "Mukono Family Clinic",
    service: "Consultation",
    date: "12 Feb 2026",
    icon: Stethoscope,
  },
  {
    id: "v2",
    facility: "Sunrise Diagnostics",
    service: "Lab",
    date: "8 Feb 2026",
    icon: FlaskConical,
  },
];

/* ═════════════════════════════════════════════
   Nearby partners data
   ══════════════════════════════════════════════ */

const nearbyPartners = [
  {
    id: "f1",
    name: "Mukono Family Clinic",
    type: "Clinic",
    distance: "1.2 km",
    icon: Stethoscope,
  },
  {
    id: "f2",
    name: "Sunrise Diagnostics",
    type: "Lab",
    distance: "2.1 km",
    icon: FlaskConical,
  },
  {
    id: "f3",
    name: "Divine Care Pharmacy",
    type: "Pharmacy",
    distance: "2.8 km",
    icon: Pill,
  },
];

/* ══════════════════════════════════════════════
   Visits chart data
   ══════════════════════════════════════════════ */

const visitsWeekData = [
  { name: "Catherine", visits: 3 },
  { name: "Ben", visits: 1 },
  { name: "Grace", visits: 2 },
];

const visitsMonthData = [
  { name: "Catherine", visits: 8 },
  { name: "Ben", visits: 4 },
  { name: "Grace", visits: 6 },
];

const BAR_COLORS = [
  "var(--brand-primary-400)",
  "var(--brand-secondary-400)",
  "var(--brand-warning-400)",
];

/* ═════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function HOME01HomePage() {
  const navigate = useNavigate();

  /* Demo toggles — flip to see empty states */
  const [hasPackage] = useState(true);
  const [hasPending] = useState(true);
  const [hasVisits] = useState(true);
  const [visitsPeriod, setVisitsPeriod] = useState<"week" | "month">("week");
  const [abaIdHidden, setAbaIdHidden] = useState(false);

  const ABA_ID = "ABA-000183";
  const displayId = abaIdHidden ? "ABA-00•••" : ABA_ID;

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ═══════════════════════════════════════
          App bar (fixed)
         ═══════════════════════════════════════ */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-[22px] tracking-[-0.01em] text-brand-neutral-900"
              style={{ fontWeight: 600 }}
            >
              Hi {getGreetingName()}
            </h2>
            <p
              className="text-[12px] text-brand-neutral-900 mt-0.5"
              style={{ fontWeight: 500 }}
            >
              Member ID: {displayId}
            </p>
          </div>
          <button
            onClick={() => navigate("/home-02")}
            className="w-9 h-9 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
          >
            <Bell size={16} className="text-brand-neutral-700" />
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          Scrollable content
         ═══════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto pt-[108px] pb-24">
        {/* ─────────────────────────────────────
            1) Primary status card
           ───────────────────────────────────── */}
        <div className="px-5 pt-3 pb-4">
          {hasPackage ? (() => {
            const primary = activePackages.find((p) => p.isPrimary) ?? activePackages[0];

            return (
              <>
                {/* Section header */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <p
                    className="text-[12px] text-brand-neutral-500"
                    style={{ fontWeight: 500, letterSpacing: "0.02em" }}
                  >
                    ACTIVE PACKAGES
                  </p>
                  <button
                    onClick={() => navigate("/pkg-07")}
                    className="text-[12px] text-brand-primary-500"
                    style={{ fontWeight: 500 }}
                  >
                    View all
                  </button>
                </div>

                {/* Primary package card */}
                <div className="bg-brand-neutral-900 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p
                        className="text-[11px] tracking-[0.06em] uppercase text-brand-neutral-500"
                        style={{ fontWeight: 500 }}
                      >
                        Primary package
                      </p>
                    </div>
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-brand-success-50 text-brand-success-500 text-[11px]"
                      style={{ fontWeight: 500 }}
                    >
                      Active
                    </span>
                  </div>

                  <h3
                    className="text-[18px] text-brand-neutral-0 mb-1.5"
                    style={{ fontWeight: 600 }}
                  >
                    {primary.name}
                  </h3>

                  <p
                    className="text-[12px] text-brand-neutral-500 mb-3"
                    style={{ fontWeight: 400 }}
                  >
                    Valid for {primary.validDays} days
                  </p>

                  {/* Mini usage row */}
                  {primary.benefits && (
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      {primary.benefits.map((u) => (
                        <span
                          key={u.label}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-brand-neutral-800 text-[11px] text-brand-neutral-300"
                          style={{ fontWeight: 400 }}
                        >
                          <u.icon size={11} className="text-brand-neutral-500" />
                          {u.label}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => navigate("/pkg-05")}
                    className="w-full h-10 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center gap-1 transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    View package
                    <ChevronRight size={14} />
                  </button>

                  <p
                    className="text-[10px] text-brand-neutral-500 text-center mt-3"
                    style={{ fontWeight: 400, lineHeight: "14px" }}
                  >
                    Care Bundle or nearest expiry is shown first.
                  </p>
                </div>

                {/* Other active strip */}
                {/* ... remove this code ... */}
              </>
            );
          })() : (
            /* ── State A: No package ── */
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-neutral-100 flex items-center justify-center">
                  <Package size={20} className="text-brand-neutral-500" />
                </div>
                <h3
                  className="text-[16px] text-brand-neutral-900"
                  style={{ fontWeight: 600 }}
                >
                  No active package
                </h3>
              </div>
              <p
                className="text-[13px] text-brand-neutral-500 mb-4"
                style={{ fontWeight: 400, lineHeight: "19px" }}
              >
                Buy a package to start redeeming care at ABA Partner
                facilities.
              </p>
              <button
                onClick={() => navigate("/pkg-01")}
                className="w-full h-10 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-[6px] text-[13px] flex items-center justify-center gap-1 transition-colors"
                style={{ fontWeight: 500 }}
              >
                Browse packages
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────
            2) Quick action row
           ──────────────────────────────────── */}
        <div className="px-5 pb-4">
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.label}
                  onClick={() =>
                    a.route
                      ? navigate(a.route)
                      : toast("Wallet (WAL-01) coming soon.")
                  }
                  className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl py-3.5 px-2 flex flex-col items-center gap-2 hover:bg-brand-neutral-100 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center`}
                  >
                    <Icon size={18} className={a.fg} />
                  </div>
                  <span
                    className="text-[11px] text-brand-neutral-700 text-center"
                    style={{ fontWeight: 500, lineHeight: "14px" }}
                  >
                    {a.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ────────────────────────────────────
            3) Pending approvals card
           ───────────────────────────────────── */}
        <div className="px-5 pb-4">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            APPROVALS
          </p>

          {hasPending ? (
            /* ── State B: Has pending ── */
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-warning-50 flex items-center justify-center shrink-0">
                  <ClipboardList
                    size={18}
                    className="text-brand-warning-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p
                      className="text-[14px] text-brand-neutral-900 truncate"
                      style={{ fontWeight: 500 }}
                    >
                      Mukono Family Clinic
                    </p>
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-warning-50 text-brand-warning-500 text-[10px] shrink-0"
                      style={{ fontWeight: 500 }}
                    >
                      Requested
                    </span>
                  </div>
                  <p
                    className="text-[12px] text-brand-neutral-500"
                    style={{ fontWeight: 400 }}
                  >
                    Patient: Ben &middot; Consultation
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/apr-02")}
                className="w-full mt-3 pt-3 border-t border-brand-neutral-200 text-brand-primary-500 hover:text-brand-primary-600 text-[13px] flex items-center justify-center gap-1 transition-colors"
                style={{ fontWeight: 500 }}
              >
                Review
                <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            /* ── State A: Empty ── */
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
                <ClipboardList
                  size={18}
                  className="text-brand-neutral-500"
                />
              </div>
              <div>
                <p
                  className="text-[14px] text-brand-neutral-900"
                  style={{ fontWeight: 500 }}
                >
                  No pending approvals
                </p>
                <p
                  className="text-[12px] text-brand-neutral-500 mt-0.5"
                  style={{ fontWeight: 400 }}
                >
                  Requests from facilities will appear here.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────
            4) Wallet + Dependents (side-by-side)
           ───────────────────────────────────── */}
        <div className="px-5 pb-4">
          <div className="grid grid-cols-2 gap-2.5">
            {/* Wallet card */}
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-brand-neutral-100 flex items-center justify-center">
                  <Wallet size={15} className="text-brand-neutral-700" />
                </div>
                <p
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 500 }}
                >
                  Wallet
                </p>
              </div>
              <p
                className="text-[16px] text-brand-neutral-900 mb-3"
                style={{ fontWeight: 600 }}
              >
                UGX 0
              </p>
              <button
                onClick={() => navigate("/wal-01")}
                className="mt-auto w-full h-8 bg-brand-neutral-100 hover:bg-brand-neutral-200 text-brand-neutral-700 rounded-[6px] text-[12px] flex items-center justify-center gap-1 transition-colors"
                style={{ fontWeight: 500 }}
              >
                Open
                <ChevronRight size={12} />
              </button>
            </div>

            {/* Dependents card */}
            <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-brand-neutral-100 flex items-center justify-center">
                  <Users size={15} className="text-brand-neutral-700" />
                </div>
                <p
                  className="text-[12px] text-brand-neutral-500"
                  style={{ fontWeight: 500 }}
                >
                  Dependents
                </p>
              </div>
              <p
                className="text-[16px] text-brand-neutral-900 mb-3"
                style={{ fontWeight: 600 }}
              >
                0 / 3
              </p>
              <button
                onClick={() => navigate("/dep-01")}
                className="mt-auto w-full h-8 bg-brand-neutral-100 hover:bg-brand-neutral-200 text-brand-neutral-700 rounded-[6px] text-[12px] flex items-center justify-center gap-1 transition-colors"
                style={{ fontWeight: 500 }}
              >
                Manage
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────
            5) Visits chart
           ───────────────────────────────────── */}
        <div className="px-5 pb-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <p
              className="text-[12px] text-brand-neutral-500"
              style={{ fontWeight: 500, letterSpacing: "0.02em" }}
            >
              VISITS
            </p>
            <button
              onClick={() => navigate("/care-01")}
              className="text-[12px] text-brand-primary-500"
              style={{ fontWeight: 500 }}
            >
              View my care
            </button>
          </div>

          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4">
            {/* Timeline toggle */}
            <div className="flex items-center gap-1 mb-4 bg-brand-neutral-100 rounded-lg p-0.5 w-fit ml-auto">
              {(["week", "month"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setVisitsPeriod(period)}
                  className={`px-3 py-1.5 rounded-md text-[11px] transition-colors ${
                    visitsPeriod === period
                      ? "bg-brand-neutral-900 text-brand-neutral-0"
                      : "text-brand-neutral-500 hover:text-brand-neutral-700"
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {period === "week" ? "This week" : "This month"}
                </button>
              ))}
            </div>

            {/* Total summary */}
            <div className="mb-3 flex items-baseline gap-2">
              <p
                className="text-[22px] text-brand-neutral-900"
                style={{ fontWeight: 600 }}
              >
                {(visitsPeriod === "week" ? visitsWeekData : visitsMonthData).reduce(
                  (sum, d) => sum + d.visits,
                  0
                )}
              </p>
              <p
                className="text-[11px] text-brand-neutral-500"
                style={{ fontWeight: 400 }}
              >
                total visits {visitsPeriod === "week" ? "this week" : "this month"}
              </p>
            </div>

            {/* Bar chart */}
            <div className="h-[140px] -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={visitsPeriod === "week" ? visitsWeekData : visitsMonthData}
                  barCategoryGap="30%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--brand-neutral-200)"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "var(--brand-neutral-500)" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "var(--brand-neutral-400)" }}
                    width={24}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--brand-neutral-100)" }}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid var(--brand-neutral-200)",
                      fontSize: 12,
                      padding: "6px 10px",
                    }}
                    formatter={(value: number) => [`${value} visits`, ""]}
                    labelStyle={{ fontSize: 11, fontWeight: 500 }}
                  />
                  <Bar dataKey="visits" radius={[6, 6, 0, 0]}>
                    {(visitsPeriod === "week" ? visitsWeekData : visitsMonthData).map(
                      (_, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={BAR_COLORS[idx % BAR_COLORS.length]}
                        />
                      )
                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              {(visitsPeriod === "week" ? visitsWeekData : visitsMonthData).map(
                (d, idx) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: BAR_COLORS[idx % BAR_COLORS.length] }}
                    />
                    <span
                      className="text-[11px] text-brand-neutral-600"
                      style={{ fontWeight: 400 }}
                    >
                      {d.name}
                    </span>
                    <span
                      className="text-[11px] text-brand-neutral-400"
                      style={{ fontWeight: 500 }}
                    >
                      ({d.visits})
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────
            5b) Bookings shortcut
           ───────────────────────────────────── */}
        <div className="px-5 pb-4">
          <button
            onClick={() => navigate("/book-03")}
            className="w-full bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4 flex items-center gap-3 hover:bg-brand-neutral-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-secondary-50 flex items-center justify-center shrink-0">
              <CalendarCheck size={18} className="text-brand-secondary-500" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p
                className="text-[14px] text-brand-neutral-900"
                style={{ fontWeight: 500 }}
              >
                Bookings
              </p>
              <p
                className="text-[12px] text-brand-neutral-500 mt-0.5"
                style={{ fontWeight: 400 }}
              >
                2 upcoming visits
              </p>
            </div>
            <ChevronRight size={16} className="text-brand-neutral-400 shrink-0" />
          </button>
        </div>

        {/* ─────────────────────────────────────
            6) Nearby partners
           ───────────────────────────────────── */}
        <div className="px-5 pb-6">
          <div className="flex items-center justify-between mb-2 px-1">
            <p
              className="text-[12px] text-brand-neutral-500"
              style={{ fontWeight: 500, letterSpacing: "0.02em" }}
            >
              NEARBY PARTNERS
            </p>
            <button
              onClick={() => navigate("/fac-01")}
              className="text-[12px] text-brand-primary-500"
              style={{ fontWeight: 500 }}
            >
              See all
            </button>
          </div>

          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden">
            {nearbyPartners.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 px-4 py-3.5 ${
                    i < nearbyPartners.length - 1
                      ? "border-b border-brand-neutral-200"
                      : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-primary-50 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-brand-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[13px] text-brand-neutral-900 truncate"
                      style={{ fontWeight: 500 }}
                    >
                      {p.name}
                    </p>
                    <p
                      className="text-[11px] text-brand-neutral-500 mt-0.5"
                      style={{ fontWeight: 400 }}
                    >
                      {p.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <MapPin size={11} className="text-brand-neutral-300" />
                    <span
                      className="text-[11px] text-brand-neutral-500"
                      style={{ fontWeight: 400 }}
                    >
                      {p.distance}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          Bottom Navigation (fixed)
         ═══════════════════════════════════════ */}
      <BottomNav activeTab="home" />
    </div>
  );
}