import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, Bell } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { NOTIFICATION_TYPE_STYLES, timeAgo, type NotificationType } from "../../lib/notificationCatalog";

/* ══════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════ */

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  route: string | null;
  read: boolean;
  created_at: string;
};

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function HOME02NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("notifications")
      .select("id, type, title, body, route, read, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setNotifications(data ?? []);
        setLoading(false);
      });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpen = (n: Notification) => {
    if (!n.read) {
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      supabase.from("notifications").update({ read: true }).eq("id", n.id).then();
    }
    if (n.route) navigate(n.route);
  };

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
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-brand-primary-500 border-t-transparent animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-5 pt-16 flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-xl bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center mb-3">
              <Bell size={20} className="text-brand-neutral-400" />
            </div>
            <p className="text-[14px] text-brand-neutral-900" style={{ fontWeight: 500 }}>
              No notifications yet
            </p>
            <p className="text-[12px] text-brand-neutral-500 mt-1" style={{ fontWeight: 400, lineHeight: "18px" }}>
              Updates on bookings, approvals, and your wallet will show up here.
            </p>
          </div>
        ) : (
          <div className="px-5 pt-4 space-y-2.5">
            {notifications.map((n) => {
              const style = NOTIFICATION_TYPE_STYLES[n.type];
              const Icon = style.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => handleOpen(n)}
                  className={`w-full text-left rounded-2xl p-4 flex items-start gap-3 transition-colors border ${
                    n.read
                      ? "bg-brand-neutral-0 border-brand-neutral-200 opacity-80"
                      : "bg-brand-neutral-0 border-brand-neutral-200"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center shrink-0`}
                  >
                    <Icon size={18} className={style.iconColor} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p
                        className="text-[13px] text-brand-neutral-900 truncate"
                        style={{ fontWeight: n.read ? 500 : 600 }}
                      >
                        {n.title}
                      </p>
                      {!n.read && (
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
                      {timeAgo(n.created_at)}
                    </p>
                  </div>

                  {/* Chevron */}
                  {n.route && (
                    <ChevronRight
                      size={14}
                      className="text-brand-neutral-300 shrink-0 mt-3"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
