import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Copy,
  CheckCheck,
  QrCode,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const VALIDITY_SECONDS = 10 * 60; // 10 minutes from when the request was approved

export function APR08ApprovalCodePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("id") || "";

  const [code, setCode] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase
      .from("approval_requests")
      .select("approval_code, responded_at")
      .eq("id", requestId)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.approval_code && data.responded_at) {
          setCode(data.approval_code);
          const elapsedMs = Date.now() - new Date(data.responded_at).getTime();
          const remaining = VALIDITY_SECONDS - Math.floor(elapsedMs / 1000);
          setSecondsLeft(Math.max(0, remaining));
        }
        setLoading(false);
      });
  }, [requestId]);

  /* ── Countdown timer ── */
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isExpired = secondsLeft <= 0;

  /* ── Copy handler ── */
  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // clipboard may not be available in sandbox
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ App Bar ══ */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-brand-neutral-100 px-5 pt-6 pb-3 border-b border-brand-neutral-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/apr-04?id=" + requestId)}
            className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-brand-neutral-900" />
          </button>
          <h2
            className="text-[17px] text-brand-neutral-900"
            style={{ fontWeight: 600 }}
          >
            Approval code
          </h2>
        </div>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-[80px]">
        <div className="px-5 pt-8 flex flex-col items-center">
          {/* ── Title ── */}
          <h3
            className="text-[17px] text-brand-neutral-900 mb-1 text-center"
            style={{ fontWeight: 600 }}
          >
            Show this code to the facility
          </h3>
          <p
            className="text-[13px] text-brand-neutral-500 text-center max-w-[260px] mb-6"
            style={{ fontWeight: 400 }}
          >
            The facility staff can use this code to confirm your approval.
          </p>

          {/* ── Code card ── */}
          <div className="w-full bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-6 flex flex-col items-center mb-3">
            {loading ? (
              <div className="h-[36px] flex items-center justify-center mb-3">
                <div className="w-5 h-5 rounded-full border-2 border-brand-primary-500 border-t-transparent animate-spin" />
              </div>
            ) : !code ? (
              <p
                className="text-[14px] text-brand-neutral-500 text-center mb-3"
                style={{ fontWeight: 400 }}
              >
                No approval code found for this request.
              </p>
            ) : (
              <>
                {/* Large code */}
                <p
                  className={`text-[32px] tracking-[0.1em] mb-3 text-center transition-colors ${
                    isExpired ? "text-brand-neutral-300" : "text-brand-neutral-900"
                  }`}
                  style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
                >
                  {code}
                </p>

                {/* Timer */}
                <div className="flex items-center gap-1.5 mb-5">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isExpired
                        ? "bg-brand-error-500"
                        : secondsLeft <= 60
                          ? "bg-brand-warning-500 animate-pulse"
                          : "bg-brand-success-500"
                    }`}
                  />
                  <span
                    className={`text-[12px] ${
                      isExpired
                        ? "text-brand-error-500"
                        : "text-brand-neutral-500"
                    }`}
                    style={{ fontWeight: 450, fontVariantNumeric: "tabular-nums" }}
                  >
                    {isExpired
                      ? "Code expired"
                      : `Valid for ${formatTime(secondsLeft)}`}
                  </span>
                </div>

                {/* QR code placeholder */}
                <div className="w-[120px] h-[120px] rounded-2xl bg-brand-neutral-100 border border-brand-neutral-200 border-dashed flex flex-col items-center justify-center mb-5">
                  <QrCode size={32} className="text-brand-neutral-300 mb-1.5" />
                  <span
                    className="text-[10px] text-brand-neutral-400"
                    style={{ fontWeight: 400 }}
                  >
                    QR code
                  </span>
                </div>

                {/* Copy code button */}
                <button
                  onClick={handleCopy}
                  disabled={isExpired}
                  className={`w-full h-11 rounded-xl text-[13px] flex items-center justify-center gap-2 border-[1.5px] transition-colors ${
                    isExpired
                      ? "bg-brand-neutral-100 text-brand-neutral-300 border-brand-neutral-200 cursor-not-allowed"
                      : copied
                        ? "bg-brand-success-50 text-brand-success-500 border-brand-success-500"
                        : "bg-brand-neutral-0 hover:bg-brand-neutral-100 text-brand-neutral-900 border-brand-neutral-900"
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {copied ? (
                    <>
                      <CheckCheck size={15} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                      Copy code
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* ── Warning note ── */}
          <div className="w-full bg-brand-warning-50 border border-brand-warning-500/20 rounded-2xl px-4 py-3 flex items-start gap-2.5 mb-8">
            <AlertTriangle
              size={14}
              className="text-brand-warning-500 shrink-0 mt-0.5"
            />
            <p
              className="text-[11px] text-brand-warning-500"
              style={{ fontWeight: 450 }}
            >
              Only share this with ABA Partner staff at the facility.
            </p>
          </div>

        </div>
      </div>

      {/* ══ Fixed bottom action bar ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-brand-neutral-0 border-t border-brand-neutral-200 px-5 pt-3 pb-4">
        <button
          onClick={() => navigate("/apr-04?id=" + requestId)}
          className="w-full h-11 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[13px] flex items-center justify-center transition-colors"
          style={{ fontWeight: 500 }}
        >
          Back to Approved
        </button>
      </div>
    </div>
  );
}
