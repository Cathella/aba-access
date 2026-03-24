import { useNavigate, useLocation } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

const pages = [
  { path: "/cover", label: "00 Cover" },
  { path: "/foundations", label: "01 Foundations" },
  { path: "/components", label: "02 Components" },
  { path: "/flows-packages", label: "03 Packages" },
  { path: "/pkg-01", label: "PKG-01 Home" },
  { path: "/pkg-02/care-bundle-50k", label: "PKG-02 Detail" },
  { path: "/flows-dependents", label: "04 Dependents" },
  { path: "/flows-approvals", label: "05 Approvals" },
  { path: "/flows-care-tracking", label: "06 Care Tracking" },
  { path: "/flows-auth", label: "07 Auth" },
  { path: "/flows-wallet", label: "08 Wallet" },
];

export function PageNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentIndex = pages.findIndex((p) =>
    p.path.includes("/pkg-02/")
      ? location.pathname.startsWith("/pkg-02/")
      : p.path === location.pathname
  );

  const prev = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const next = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  return (
    <div className="px-5 pt-6 pb-4">
      <div className="flex items-center justify-between gap-2">
        {prev ? (
          <button
            onClick={() => navigate(prev.path)}
            className="flex items-center gap-1 text-[13px] text-brand-neutral-500 hover:text-brand-neutral-900 transition-colors bg-transparent"
          >
            <ChevronLeft size={14} />
            <span>{prev.label}</span>
          </button>
        ) : (
          <div />
        )}
        {next ? (
          <button
            onClick={() => navigate(next.path)}
            className="flex items-center gap-1 text-[13px] text-brand-neutral-500 hover:text-brand-neutral-900 transition-colors bg-transparent"
          >
            <span>{next.label}</span>
            <ChevronRight size={14} />
          </button>
        ) : (
          <div />
        )}
      </div>

      {/* Page dots */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {pages.map((page, i) => (
          <button
            key={page.path}
            onClick={() => navigate(page.path)}
            className={`rounded-full transition-all bg-transparent ${
              i === currentIndex
                ? "w-6 h-2 bg-brand-primary-500!"
                : "w-2 h-2 bg-brand-neutral-300! hover:bg-brand-neutral-500!"
            }`}
            aria-label={page.label}
          />
        ))}
      </div>
    </div>
  );
}