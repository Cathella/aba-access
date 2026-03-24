import { useNavigate } from "react-router";
import {
  Home,
  Package,
  ClipboardList,
  Activity,
  MoreHorizontal,
} from "lucide-react";

type TabKey = "home" | "packages" | "approvals" | "care" | "more";

interface BottomNavProps {
  activeTab?: TabKey;
}

const navItems: { key: TabKey; icon: typeof Home; label: string; path: string }[] = [
  { key: "home", icon: Home, label: "Home", path: "/home-01" },
  { key: "packages", icon: Package, label: "Packages", path: "/pkg-07" },
  { key: "approvals", icon: ClipboardList, label: "Approvals", path: "/apr-01" },
  { key: "care", icon: Activity, label: "Care", path: "/care-01" },
  { key: "more", icon: MoreHorizontal, label: "More", path: "/more" },
];

export function BottomNav({ activeTab = "home" }: BottomNavProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-2.5 pb-5 z-10">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.key === activeTab;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 ${
                isActive
                  ? "text-brand-primary-500"
                  : "text-brand-neutral-500"
              }`}
            >
              <Icon size={20} />
              <span
                className="text-[10px]"
                style={{ fontWeight: isActive ? 500 : 400 }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}