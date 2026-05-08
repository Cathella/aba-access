import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, LogIn, AlertCircle, UserRound } from "lucide-react";
import { useAuth } from "../../lib/auth-context";

const PIN_LENGTH = 4;

export function AUTH07EnterPINPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get("phone") ?? "+256 7XX XXX XXX";

  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { signInWithPin } = useAuth();

  /* ── Digit-box handlers ── */
  function handleChange(index: number, value: string) {
    const d = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = d;
    setDigits(next);
    setError(false);
    if (d && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const next = [...digits];
      next[index - 1] = "";
      setDigits(next);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, PIN_LENGTH);
    if (!pasted) return;
    const next = Array(PIN_LENGTH).fill("");
    for (let i = 0; i < PIN_LENGTH; i++) {
      next[i] = pasted[i] ?? "";
    }
    setDigits(next);
    setError(false);
    inputRefs.current[Math.min(pasted.length, PIN_LENGTH - 1)]?.focus();
  }

  /* ── Validation ── */
  const code = digits.join("");
  const isFilled = code.length === PIN_LENGTH;

  async function handleLogin() {
    if (!isFilled) return;
    setLoading(true);
    try {
      await signInWithPin(phone, code);
      navigate("/home-01");
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col items-center justify-center">
      {/* ── Back link ── */}
      <div className="absolute top-0 left-0 px-5 pt-[56px] pb-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-transparent"
        >
          <ArrowLeft size={16} className="text-brand-neutral-900" />
          <span
            className="text-[14px] text-brand-neutral-900"
            style={{ fontWeight: 500 }}
          >
            Back
          </span>
        </button>
      </div>

      {/* ── Card ── */}
      <div className="mx-5 w-full flex justify-center">
        <div className="w-full max-w-[390px] bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl px-6 py-8 flex flex-col items-center">
          {/* User icon */}
          <div className="w-16 h-16 rounded-full bg-brand-primary-500 flex items-center justify-center mb-5">
            <UserRound size={28} className="text-brand-neutral-0" />
          </div>

          {/* Heading */}
          <h1
            className="text-[22px] tracking-[-0.01em] text-brand-neutral-900 mb-6 text-center"
            style={{ fontWeight: 600, lineHeight: 1.25 }}
          >
            Enter your PIN
          </h1>

          {/* ── PIN digit boxes (masked) ── */}
          <div className="w-full flex items-center justify-center gap-3 mb-4">
            {digits.map((digit, i) => (
              <div
                key={i}
                className={`relative w-[60px] h-[60px] rounded-xl border-[1.5px] transition-colors bg-brand-neutral-0 ${
                  error
                    ? "border-brand-error-500"
                    : digit
                      ? "border-brand-primary-500"
                      : "border-brand-neutral-200"
                } focus-within:border-brand-neutral-900 flex items-center justify-center`}
              >
                {/* Dot mask */}
                {digit && (
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-neutral-900 pointer-events-none" />
                )}
                <input
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  style={{ caretColor: "transparent" }}
                  autoFocus={i === 0}
                />
              </div>
            ))}
          </div>

          {/* ── Inline error ── */}
          {error && (
            <div className="w-full flex items-center gap-2.5 bg-brand-error-50 border border-brand-error-500/20 rounded-[10px] px-4 py-3 mb-4">
              <AlertCircle size={16} className="text-brand-error-500 shrink-0" />
              <p
                className="text-[13px] text-brand-error-500"
                style={{ fontWeight: 450, lineHeight: 1.4 }}
              >
                Incorrect PIN. Try again.
              </p>
            </div>
          )}

          {/* ── Forgot PIN link ── */}
          <button
            onClick={() =>
              navigate(`/auth-08?phone=${encodeURIComponent(phone)}`)
            }
            className="text-[13px] text-brand-secondary-500 hover:underline bg-transparent min-h-[44px] mb-4"
            style={{ fontWeight: 500 }}
          >
            Forgot PIN?
          </button>

{/* ── Sign In button ── */}
           <button
             onClick={handleLogin}
             disabled={!isFilled || loading}
             className={`w-full min-h-[48px] rounded-xl flex items-center justify-center gap-2 border-[1.5px] transition-colors text-[15px] ${
               isFilled && !loading
                 ? "bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-brand-neutral-900"
                 : "bg-brand-primary-300/40 text-brand-neutral-900/40 border-transparent cursor-not-allowed"
             }`}
             style={{ fontWeight: 500 }}
           >
             {loading ? "Logging in..." : "Log in"}
             {!loading && <LogIn size={16} />}
           </button>
        </div>
      </div>
    </div>
  );
}
