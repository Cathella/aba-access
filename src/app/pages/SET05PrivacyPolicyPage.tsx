import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

/* ══════════════════════════════════════════════
   Section heading
   ══════════════════════════════════════════════ */

function SectionHeading({ number, title }: { number: number; title: string }) {
  return (
    <h3
      className="text-[15px] text-brand-neutral-900 mt-6 mb-2"
      style={{ fontWeight: 600 }}
    >
      {number}. {title}
    </h3>
  );
}

/* ══════════════════════════════════════════════
   Body paragraph
   ══════════════════════════════════════════════ */

function P({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[14px] text-brand-neutral-700 mb-3"
      style={{ fontWeight: 400, lineHeight: "20px" }}
    >
      {children}
    </p>
  );
}

/* ══════════════════════════════════════════════
   Key-line callout
   ══════════════════════════════════════════════ */

function KeyLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-brand-primary-50 border border-brand-primary-200 rounded-xl px-4 py-3 mb-3">
      <p
        className="text-[13px] text-brand-primary-700"
        style={{ fontWeight: 500, lineHeight: "18px" }}
      >
        {children}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function SET05PrivacyPolicyPage() {
  const navigate = useNavigate();

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
          Privacy policy
        </h2>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-10">
        <div className="px-5 pt-5">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl px-5 py-5">
            {/* Intro */}
            <P>
              AbaAccess ("we", "us", or "our") is committed to protecting your
              privacy. This policy explains how we collect, use, and safeguard
              your personal information when you use our mobile application and
              related services.
            </P>

            {/* 1 ─ What we collect */}
            <SectionHeading number={1} title="What we collect" />
            <P>
              We collect information you provide directly, such as your name,
              phone number, and details about your dependents. We also collect
              usage data including app interactions, device information, and
              approximate location to improve our services.
            </P>
            <P>
              When you purchase or manage coverage packages, we store
              transaction records, package selections, and payment references.
              Health-related data is limited to coverage verification results
              and visit receipts.
            </P>

            {/* 2 ─ How we use data */}
            <SectionHeading number={2} title="How we use data" />
            <P>
              Your information is used to operate the AbaAccess platform,
              including processing coverage approvals, managing packages, and
              delivering notifications. We may also use aggregated,
              de-identified data to improve our services and understand usage
              patterns.
            </P>
            <P>
              We do not sell your personal data to third parties. Promotional
              communications are optional and can be disabled in your
              notification settings at any time.
            </P>

            {/* 3 ─ Sharing with facilities */}
            <SectionHeading
              number={3}
              title="Sharing with facilities (ABA Partner)"
            />
            <P>
              To process care requests, we share limited information with
              healthcare facilities registered on the ABA Partner platform.
              This includes coverage eligibility status, approved service
              types, and relevant dependent identifiers needed to deliver care.
            </P>
            <KeyLine>
              Facilities only see coverage results needed to provide care.
            </KeyLine>
            <P>
              Facilities do not have access to your account balance, payment
              history, full profile details, or data about other dependents
              not involved in the current care request.
            </P>

            {/* 4 ─ Data security */}
            <SectionHeading number={4} title="Data security" />
            <P>
              We use industry-standard security measures to protect your data,
              including encryption in transit and at rest, secure PIN
              verification for approvals, and regular security audits. Access
              to personal data is restricted to authorised personnel on a
              need-to-know basis.
            </P>
            <P>
              While no system is completely secure, we continuously monitor
              for threats and promptly address any vulnerabilities discovered.
            </P>

            {/* 5 ─ Your choices */}
            <SectionHeading number={5} title="Your choices" />
            <P>
              You can update your profile information, manage notification
              preferences, and control which dependents are active on your
              account at any time through the Settings menu. You may request
              a copy of your data or ask us to delete your account by
              contacting our support team.
            </P>
            <P>
              Certain data may be retained as required by law or for
              legitimate record-keeping purposes, even after account deletion.
            </P>

            {/* 6 ─ Contact */}
            <SectionHeading number={6} title="Contact" />
            <P>
              If you have questions about this privacy policy or your personal
              data, please reach out to our support team through the Help &
              support section in Settings, or email us at{" "}
              <span
                className="text-brand-primary-500"
                style={{ fontWeight: 500 }}
              >
                privacy@abaaccess.com
              </span>
              .
            </P>
          </div>

          {/* Footer */}
          <p
            className="text-[11px] text-brand-neutral-400 text-center mt-4 pb-2"
            style={{ fontWeight: 400 }}
          >
            Last updated: Feb 2026
          </p>
        </div>
      </div>
    </div>
  );
}
