import { MobileFrame } from "../components/MobileFrame";
import { PageNav } from "../components/PageNav";
import { useNavigate } from "react-router";
import {
  Wallet,
  ChevronRight,
  Home as HomeIcon,
  ArrowDownLeft,
  CheckCircle,
  ReceiptText,
  FileText,
} from "lucide-react";

const screens = [
  {
    id: "WAL-01",
    label: "Wallet Home",
    desc: "Balance, transactions & quick actions",
    route: "/wal-01",
    icon: Wallet,
  },
  {
    id: "WAL-02",
    label: "Top Up",
    desc: "Amount, method & payment request",
    route: "/wal-02",
    icon: ArrowDownLeft,
  },
  {
    id: "WAL-02A",
    label: "Payment Sent",
    desc: "MoMo prompt confirmation",
    route: "/wal-02a",
    icon: CheckCircle,
  },
  {
    id: "WAL-03",
    label: "Transactions",
    desc: "Filtered list with search & status",
    route: "/wal-03",
    icon: ReceiptText,
  },
  {
    id: "WAL-04",
    label: "Transaction Detail",
    desc: "Receipt view with context links",
    route: "/wal-04/TX-00091",
    icon: FileText,
  },
];

export function FlowsWalletPage() {
  const navigate = useNavigate();

  return (
    <MobileFrame>
      <div className="px-5 pt-4 pb-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-[22px] tracking-[-0.01em] text-brand-neutral-900"
            style={{ fontWeight: 600 }}
          >
            Wallet Flow
          </h2>
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full bg-brand-primary-50 text-brand-primary-500 text-[11px]"
            style={{ fontWeight: 500 }}
          >
            MVP1
          </span>
        </div>

        {/* Flow summary */}
        <div className="bg-brand-neutral-900 rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary-500/20 flex items-center justify-center">
              <Wallet size={20} className="text-brand-primary-300" />
            </div>
            <div>
              <p
                className="text-[14px] text-brand-neutral-0"
                style={{ fontWeight: 500 }}
              >
                Wallet
              </p>
              <p
                className="text-[12px] text-brand-neutral-500"
                style={{ fontWeight: 400 }}
              >
                Balance &rarr; Top-up &rarr; Transactions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-neutral-800">
              <HomeIcon size={12} className="text-brand-neutral-400" />
              <span
                className="text-[11px] text-brand-neutral-300"
                style={{ fontWeight: 400 }}
              >
                In-app
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-neutral-800">
              <Wallet size={12} className="text-brand-neutral-400" />
              <span
                className="text-[11px] text-brand-neutral-300"
                style={{ fontWeight: 400 }}
              >
                Bottom nav shown
              </span>
            </div>
          </div>
        </div>

        {/* Entry points */}
        <p
          className="text-[11px] tracking-[0.08em] uppercase text-brand-neutral-500 mb-3 px-1"
          style={{ fontWeight: 500 }}
        >
          Entry Points
        </p>
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden mb-5">
          {[
            'HOME-01 Quick action "Wallet"',
            'HOME-01 Wallet card "Open"',
            'SET-04 Aba Wallet "View wallet"',
            'PKG-03 Checkout "View wallet" link',
          ].map((entry, i, arr) => (
            <div
              key={entry}
              className={`px-4 py-3 text-[12px] text-brand-neutral-700 ${
                i < arr.length - 1 ? "border-b border-brand-neutral-200" : ""
              }`}
              style={{ fontWeight: 400 }}
            >
              {entry}
            </div>
          ))}
        </div>

        {/* Screen index */}
        <p
          className="text-[11px] tracking-[0.08em] uppercase text-brand-neutral-500 mb-3 px-1"
          style={{ fontWeight: 500 }}
        >
          Screens
        </p>
        <div className="space-y-2">
          {screens.map((screen) => {
            const Icon = screen.icon;
            return (
              <button
                key={screen.id}
                onClick={() => navigate(screen.route)}
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl hover:bg-brand-neutral-100 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-primary-50 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-brand-primary-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[14px] text-brand-neutral-900"
                    style={{ fontWeight: 500 }}
                  >
                    {screen.id}
                  </p>
                  <p
                    className="text-[12px] text-brand-neutral-500"
                    style={{ fontWeight: 400 }}
                  >
                    {screen.desc}
                  </p>
                </div>
                <ChevronRight
                  size={14}
                  className="text-brand-neutral-300 shrink-0"
                />
              </button>
            );
          })}
        </div>

        {/* Note */}
        <div className="mt-5 bg-brand-neutral-100 border border-brand-neutral-200 rounded-xl px-4 py-3">
          <p
            className="text-[12px] text-brand-neutral-500"
            style={{ fontWeight: 400, lineHeight: 1.55 }}
          >
            Wallet screens show the bottom navigation bar. Entry points from
            HOME-01, SET-04, and PKG-03 all route to WAL-01.
          </p>
        </div>
      </div>

      <PageNav />
    </MobileFrame>
  );
}