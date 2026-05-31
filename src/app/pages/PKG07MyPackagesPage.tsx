import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, Package } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { supabase } from "../../lib/supabase";
import { PACKAGE_CATALOG, formatPackageDate } from "../../lib/packageCatalog";

type UserPackage = {
  id: string;
  package_id: string;
  package_name: string;
  purchased_at: string;
  expires_at: string;
};

const tabs = ["Active", "Expired"] as const;
type Tab = (typeof tabs)[number];

export function PKG07MyPackagesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("Active");
  const [activePackages, setActivePackages] = useState<UserPackage[]>([]);
  const [expiredPackages, setExpiredPackages] = useState<UserPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date().toISOString();
    Promise.all([
      supabase
        .from("user_packages")
        .select("id, package_id, package_name, purchased_at, expires_at")
        .gt("expires_at", now)
        .order("purchased_at", { ascending: false }),
      supabase
        .from("user_packages")
        .select("id, package_id, package_name, purchased_at, expires_at")
        .lte("expires_at", now)
        .order("expires_at", { ascending: false }),
    ]).then(([{ data: active }, { data: expired }]) => {
      setActivePackages(active ?? []);
      setExpiredPackages(expired ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ── App Bar (fixed top) ── */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <h2
          className="text-[22px] tracking-[-0.01em] text-brand-neutral-900"
          style={{ fontWeight: 600 }}
        >
          My Packages
        </h2>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[80px] px-5">
        {/* ── Tabs ── */}
        <div className="flex mt-3 mb-1 gap-2">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-[13px] text-center transition-colors rounded-full ${
                  isActive
                    ? "bg-brand-neutral-900 text-brand-neutral-0"
                    : "text-brand-neutral-500"
                }`}
                style={{ fontWeight: isActive ? 600 : 400 }}
              >
                {tab} packages
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="mt-8 flex justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-brand-primary-500 border-t-transparent animate-spin" />
          </div>
        ) : activeTab === "Active" ? (
          <div className="mt-4 space-y-3">
            {activePackages.length === 0 ? (
              <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-6 flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-neutral-100 flex items-center justify-center">
                  <Package size={20} className="text-brand-neutral-400" />
                </div>
                <p
                  className="text-[14px] text-brand-neutral-900 text-center"
                  style={{ fontWeight: 500 }}
                >
                  No active packages
                </p>
                <p
                  className="text-[13px] text-brand-neutral-500 text-center"
                  style={{ fontWeight: 400 }}
                >
                  Buy a package to start redeeming care.
                </p>
                <button
                  onClick={() => navigate("/pkg-01")}
                  className="mt-1 h-10 px-5 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  Browse packages
                </button>
              </div>
            ) : (
              activePackages.map((pkg) => {
                const catalog = PACKAGE_CATALOG[pkg.package_id];
                return (
                  <div
                    key={pkg.id}
                    className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <h3
                        className="text-[15px] text-brand-neutral-900"
                        style={{ fontWeight: 600 }}
                      >
                        {catalog?.name ?? pkg.package_name}
                      </h3>
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] bg-brand-success-50 text-brand-success-500 shrink-0"
                        style={{ fontWeight: 500 }}
                      >
                        Active
                      </span>
                    </div>

                    {catalog && (
                      <p
                        className="text-[12px] text-brand-neutral-500 mb-1"
                        style={{ fontWeight: 400 }}
                      >
                        {catalog.highlights}
                      </p>
                    )}

                    <p
                      className="text-[12px] text-brand-neutral-500 mb-3"
                      style={{ fontWeight: 400 }}
                    >
                      Valid {formatPackageDate(pkg.purchased_at)} –{" "}
                      {formatPackageDate(pkg.expires_at)}
                    </p>

                    <button
                      onClick={() =>
                        navigate(`/pkg-05?package=${pkg.package_id}`)
                      }
                      className="w-full mt-1 pt-3 border-t border-brand-neutral-200 text-brand-primary-500 hover:text-brand-primary-600 text-[13px] flex items-center justify-center gap-1 transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      View usage
                      <ChevronRight size={14} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {expiredPackages.length === 0 ? (
              <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-6">
                <p
                  className="text-[14px] text-brand-neutral-500 text-center"
                  style={{ fontWeight: 400 }}
                >
                  No expired packages yet.
                </p>
              </div>
            ) : (
              expiredPackages.map((pkg) => {
                const catalog = PACKAGE_CATALOG[pkg.package_id];
                return (
                  <div
                    key={pkg.id}
                    className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <h3
                        className="text-[15px] text-brand-neutral-900"
                        style={{ fontWeight: 600 }}
                      >
                        {catalog?.name ?? pkg.package_name}
                      </h3>
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] bg-brand-neutral-200 text-brand-neutral-500 shrink-0"
                        style={{ fontWeight: 500 }}
                      >
                        Expired
                      </span>
                    </div>

                    {catalog && (
                      <p
                        className="text-[12px] text-brand-neutral-500 mb-1"
                        style={{ fontWeight: 400 }}
                      >
                        {catalog.highlights}
                      </p>
                    )}

                    <p
                      className="text-[12px] text-brand-neutral-500 mb-3"
                      style={{ fontWeight: 400 }}
                    >
                      Expired {formatPackageDate(pkg.expires_at)}
                    </p>

                    <div className="border-t border-brand-neutral-200 pt-3">
                      <button
                        onClick={() =>
                          navigate(`/pkg-03?package=${pkg.package_id}`)
                        }
                        className="w-full text-[13px] text-brand-primary-500 hover:text-brand-primary-400 flex items-center justify-center gap-1 transition-colors"
                        style={{ fontWeight: 500 }}
                      >
                        Renew
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ── Bottom Navigation (fixed) ── */}
      <BottomNav activeTab="packages" />
    </div>
  );
}
