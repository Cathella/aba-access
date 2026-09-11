import { MobileFrame } from "../components/MobileFrame";
import { PageNav } from "../components/PageNav";
import { useNavigate } from "react-router";
import {
  Shield,
  ChevronRight,
  LogIn,
  UserPlus,
  Smartphone,
  KeyRound,
  FileCheck,
  Lock,
  PartyPopper,
  LockKeyhole,
  ShieldAlert,
  LockOpen,
  CircleCheckBig,
  LogOut,
  UserCheck,
} from "lucide-react";

const screens = [
  {
    id: "AUTH-01",
    label: "Welcome",
    desc: "Landing screen with Sign Up / Log In",
    route: "/auth-01",
    icon: Shield,
  },
  {
    id: "AUTH-02",
    label: "Enter Phone",
    desc: "Phone input — Sign Up or Login mode",
    route: "/auth-02",
    icon: Smartphone,
  },
  {
    id: "AUTH-03",
    label: "Verify OTP",
    desc: "6-digit code verification",
    route: "/auth-03",
    icon: KeyRound,
  },
  {
    id: "AUTH-04",
    label: "Consent",
    desc: "Privacy & terms acceptance",
    route: "/auth-04",
    icon: FileCheck,
  },
  {
    id: "AUTH-05",
    label: "Create PIN",
    desc: "Set 4-digit security PIN",
    route: "/auth-05",
    icon: Lock,
  },
  {
    id: "AUTH-06",
    label: "Success",
    desc: "Account ready + ABA Member ID",
    route: "/auth-06",
    icon: PartyPopper,
  },
  {
    id: "AUTH-06B",
    label: "Complete Profile",
    desc: "Name, district, area — progressive profiling",
    route: "/auth-06b",
    icon: UserCheck,
  },
  {
    id: "AUTH-07",
    label: "Enter PIN",
    desc: "Login PIN entry",
    route: "/auth-07",
    icon: LockKeyhole,
  },
  {
    id: "AUTH-08A",
    label: "Reset PIN",
    desc: "Intro — confirm phone number",
    route: "/auth-08",
    icon: ShieldAlert,
  },
  {
    id: "AUTH-08C",
    label: "Set New PIN",
    desc: "New PIN + confirm PIN",
    route: "/auth-08c",
    icon: LockOpen,
  },
  {
    id: "AUTH-08D",
    label: "Done",
    desc: "PIN updated confirmation",
    route: "/auth-08d",
    icon: CircleCheckBig,
  },
  {
    id: "AUTH-09",
    label: "Logout Confirm",
    desc: "Confirm log out modal",
    route: "/auth-09",
    icon: LogOut,
  },
];

export function FlowsAuthPage() {
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
            Auth Flow
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
              <Shield size={20} className="text-brand-primary-300" />
            </div>
            <div>
              <p
                className="text-[14px] text-brand-neutral-0"
                style={{ fontWeight: 500 }}
              >
                Authentication
              </p>
              <p
                className="text-[12px] text-brand-neutral-500"
                style={{ fontWeight: 400 }}
              >
                Welcome &rarr; Phone &rarr; OTP &rarr; Consent &rarr; PIN &rarr; Home
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-neutral-800">
              <UserPlus size={12} className="text-brand-neutral-400" />
              <span
                className="text-[11px] text-brand-neutral-300"
                style={{ fontWeight: 400 }}
              >
                Sign Up
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-neutral-800">
              <LogIn size={12} className="text-brand-neutral-400" />
              <span
                className="text-[11px] text-brand-neutral-300"
                style={{ fontWeight: 400 }}
              >
                Log In
              </span>
            </div>
          </div>
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
            Auth screens do not show the bottom navigation. After successful
            sign up or login, users are routed to HOME-01.
          </p>
        </div>
      </div>

      <PageNav />
    </MobileFrame>
  );
}