import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  AlertTriangle,
  Send,
  Info,
} from "lucide-react";
import { toast } from "sonner";

/* ══════════════════════════════════════════════
   FAQ data
   ══════════════════════════════════════════════ */

const faqs = [
  {
    id: "approvals",
    question: "How do approvals work?",
    answer:
      "When a facility submits a care request for your dependent, you'll receive a notification asking you to approve or decline. Enter your PIN to confirm the approval. The facility is then notified in real time and can proceed with the service.",
  },
  {
    id: "dependents",
    question: "How do I add dependents?",
    answer:
      'Go to Settings → Dependents, then tap "Add dependent." Fill in their details — name, date of birth, and relationship — and save. Once added, they can be linked to your active packages for coverage.',
  },
  {
    id: "no-package",
    question: "What if I don't have a package?",
    answer:
      "Without an active package, you can still browse available plans in the Packages tab. Any care requests from facilities will show as out-of-pocket. Purchase a package to start using covered benefits.",
  },
];

/* ══════════════════════════════════════════════
   FAQ accordion item
   ══════════════════════════════════════════════ */

function FAQItem({
  question,
  answer,
  open,
  onToggle,
  isLast,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  return (
    <div className={!isLast ? "border-b border-brand-neutral-200" : ""}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left hover:bg-brand-neutral-100 transition-colors"
      >
        <div className="w-9 h-9 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
          <HelpCircle size={18} className="text-brand-neutral-700" />
        </div>
        <p
          className="flex-1 min-w-0 text-[14px] text-brand-neutral-900"
          style={{ fontWeight: 500 }}
        >
          {question}
        </p>
        {open ? (
          <ChevronDown size={16} className="text-brand-neutral-400 shrink-0" />
        ) : (
          <ChevronRight size={16} className="text-brand-neutral-300 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-3.5 pl-[68px]">
          <p
            className="text-[13px] text-brand-neutral-600"
            style={{ fontWeight: 400, lineHeight: "19px" }}
          >
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   Contact row
   ══════════════════════════════════════════════ */

function ContactRow({
  icon: Icon,
  label,
  caption,
  isLast = false,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  caption: string;
  isLast?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left hover:bg-brand-neutral-100 transition-colors ${
        !isLast ? "border-b border-brand-neutral-200" : ""
      }`}
    >
      <div className="w-9 h-9 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-brand-neutral-700" />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[14px] text-brand-neutral-900"
          style={{ fontWeight: 500 }}
        >
          {label}
        </p>
        <p
          className="text-[11px] text-brand-neutral-500 mt-0.5"
          style={{ fontWeight: 400 }}
        >
          {caption}
        </p>
      </div>
      <ChevronRight size={16} className="text-brand-neutral-300 shrink-0" />
    </button>
  );
}

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function SET07HelpSupportPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  function toggleFaq(id: string) {
    setOpenFaq((prev) => (prev === id ? null : id));
  }

  return (
    <div className="min-h-screen bg-brand-neutral-100 flex flex-col">
      {/* ══ App Bar (fixed) ══ */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-brand-neutral-100 px-5 pt-6 pb-3 flex items-center gap-3 border-b border-brand-neutral-200">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-brand-neutral-0 border border-brand-neutral-200 flex items-center justify-center"
        >
          <ArrowLeft size={16} className="text-brand-neutral-900" />
        </button>
        <h2
          className="text-[17px] text-brand-neutral-900"
          style={{ fontWeight: 600 }}
        >
          Help & support
        </h2>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-10">
        {/* ── 1) FAQs ── */}
        <div className="px-5 pt-4">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            FREQUENTLY ASKED QUESTIONS
          </p>
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden">
            {faqs.map((faq, i) => (
              <FAQItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                open={openFaq === faq.id}
                onToggle={() => toggleFaq(faq.id)}
                isLast={i === faqs.length - 1}
              />
            ))}
          </div>
        </div>

        {/* ── 2) Contact ── */}
        <div className="px-5 pt-5">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            CONTACT US
          </p>
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden">
            <ContactRow
              icon={MessageCircle}
              label="WhatsApp"
              caption="Chat with our support team"
              onClick={() => toast("WhatsApp support is a placeholder.")}
            />
            <ContactRow
              icon={Phone}
              label="Call support"
              caption="Mon–Fri, 8 AM – 6 PM"
              onClick={() => toast("Call support is a placeholder.")}
            />
            <ContactRow
              icon={Mail}
              label="Email support"
              caption="support@abaaccess.com"
              onClick={() => toast("Email support is a placeholder.")}
              isLast
            />
          </div>
        </div>

        {/* ── 3) Report a problem ── */}
        <div className="px-5 pt-5">
          <p
            className="text-[12px] text-brand-neutral-500 mb-2 px-1"
            style={{ fontWeight: 500, letterSpacing: "0.02em" }}
          >
            REPORT A PROBLEM
          </p>
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => toast("Feedback form is a placeholder.")}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left hover:bg-brand-neutral-100 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-neutral-100 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-brand-neutral-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[14px] text-brand-neutral-900"
                  style={{ fontWeight: 500 }}
                >
                  Send feedback
                </p>
                <p
                  className="text-[11px] text-brand-neutral-500 mt-0.5"
                  style={{ fontWeight: 400 }}
                >
                  Report bugs or suggest improvements
                </p>
              </div>
              <Send size={16} className="text-brand-neutral-300 shrink-0" />
            </button>
          </div>
        </div>

        {/* ── Helper note ── */}
        <div className="px-5 pt-4 pb-6">
          <div className="bg-brand-warning-50 border border-brand-warning-200 rounded-xl px-4 py-3">
            <div className="flex items-start gap-2">
              <Info
                size={14}
                className="text-brand-warning-500 mt-0.5 shrink-0"
              />
              <p
                className="text-[12px] text-brand-warning-700"
                style={{ fontWeight: 400, lineHeight: "17px" }}
              >
                If you are at a facility and approval isn't syncing, use
                "Show approval code" as a fallback.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}