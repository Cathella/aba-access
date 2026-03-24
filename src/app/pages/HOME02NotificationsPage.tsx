import { useNavigate } from "react-router";
import {
  ArrowLeft,
  CalendarCheck,
  Clock,
  ShieldCheck,
  CreditCard,
  ChevronRight,
} from "lucide-react";

/* ══════════════════════════════════════════════
   Notification data
   ══════════════════════════════════════════════ */

interface Notification {
  id: string;
  icon: typeof Clock;
  iconBg: string;
  iconColor: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  route: string;
}

const notifications: Notification[] = [
  {
    id: "n-01",
    icon: CalendarCheck,
    iconBg: "bg-brand-success-50",
    iconColor: "text-brand-success-500",
    title: "Booking confirmed",
    body: "Sunrise Diagnostics (Lab) — your visit is confirmed.",
    time: "2h ago",
    unread: true,
    route: "/book-04?id=B-00019",
  },
  {
    id: "n-02",
    icon: Clock,
    iconBg: "bg-brand-neutral-100",
    iconColor: "text-brand-neutral-600",
    title: "Booking pending",
    body: "Mukono Family Clinic (Consultation) — awaiting confirmation.",
    time: "5h ago",
    unread: true,
    route: "/book-04?id=B-00021",
  },
  {
    id: "n-03",
    icon: ShieldCheck,
    iconBg: "bg-brand-primary-50",
    iconColor: "text-brand-primary-500",
    title: "Approval request",
    body: "Ben requested a consultation — tap to review.",
    time: "Yesterday",
    unread: false,
    route: "/apr-01",
  },
  {
    id: "n-04",
    icon: CreditCard,
    iconBg: "bg-brand-secondary-50",
    iconColor: "text-brand-secondary-500",
    title: "Wallet top-up",
    body: "UGX 50,000 has been added to your Aba Wallet.",
    time: "2 days ago",
    unread: false,
    route: "/wal-01",
  },
];

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function HOME02NotificationsPage() {
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ App bar (fixed) ══ */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-brand-neutral-100 px-5 pt-6 pb-3 flex items-center gap-3 border-b border-brand-neutral-200">
        <button
          onClick={() => navigate("/home-01")}
          className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
        >
          <ArrowLeft size={16} className="text-brand-neutral-900" />
        </button>
        <h2
          className="text-[17px] text-brand-neutral-900 flex-1"
          style={{ fontWeight: 600 }}
        >
          Notifications
        </h2>
        {unreadCount > 0 && (
          <span
            className="bg-brand-primary-50 text-brand-primary-500 text-[11px] px-2 py-0.5 rounded-full"
            style={{ fontWeight: 500 }}
          >
            {unreadCount} new
          </span>
        )}
      </div>

      {/* ══ Content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[80px]">
        <div className="px-5 pt-4 space-y-2.5">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <button
                key={n.id}
                onClick={() => navigate(n.route)}
                className={`w-full text-left rounded-2xl p-4 flex items-start gap-3 transition-colors border ${
                  n.unread
                    ? "bg-brand-neutral-0 border-brand-neutral-200"
                    : "bg-brand-neutral-0 border-brand-neutral-200 opacity-80"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl ${n.iconBg} flex items-center justify-center shrink-0`}
                >
                  <Icon size={18} className={n.iconColor} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p
                      className="text-[13px] text-brand-neutral-900 truncate"
                      style={{ fontWeight: n.unread ? 600 : 500 }}
                    >
                      {n.title}
                    </p>
                    {n.unread && (
                      <span className="w-2 h-2 rounded-full bg-brand-primary-500 shrink-0" />
                    )}
                  </div>
                  <p
                    className="text-[12px] text-brand-neutral-500 line-clamp-2"
                    style={{ fontWeight: 400, lineHeight: "17px" }}
                  >
                    {n.body}
                  </p>
                  <p
                    className="text-[11px] text-brand-neutral-400 mt-1.5"
                    style={{ fontWeight: 400 }}
                  >
                    {n.time}
                  </p>
                </div>

                {/* Chevron */}
                <ChevronRight
                  size={14}
                  className="text-brand-neutral-300 shrink-0 mt-3"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}