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
   Bullet list
   ══════════════════════════════════════════════ */

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mb-3 space-y-1.5 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-neutral-400 mt-[7px] shrink-0" />
          <span
            className="text-[14px] text-brand-neutral-700"
            style={{ fontWeight: 400, lineHeight: "20px" }}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

export function SET06TermsOfServicePage() {
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
          Terms of service
        </h2>
      </div>

      {/* ══ Scrollable content ══ */}
      <div className="flex-1 overflow-y-auto pt-[72px] pb-10">
        <div className="px-5 pt-5">
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl px-5 py-5">
            {/* Intro */}
            <P>
              These Terms of Service ("Terms") govern your use of the
              AbaAccess mobile application and related services. By creating
              an account or using the app, you agree to be bound by these
              Terms. Please read them carefully.
            </P>

            {/* 1 ─ Eligibility */}
            <SectionHeading number={1} title="Eligibility" />
            <P>
              You must be at least 18 years of age to create an AbaAccess
              account. By registering, you confirm that the information you
              provide is accurate and that you are authorised to manage
              coverage for any dependents added to your account.
            </P>
            <P>
              Accounts are personal and non-transferable. You are responsible
              for maintaining the confidentiality of your PIN and account
              credentials.
            </P>

            {/* 2 ─ Package rules */}
            <SectionHeading number={2} title="Package rules" />
            <P>
              Coverage packages are subject to the following conditions:
            </P>
            <BulletList
              items={[
                "Each package has a defined validity period displayed at the time of purchase.",
                "Packages may specify a maximum number of covered dependents.",
                "Unused benefits do not roll over once a package expires unless explicitly stated.",
                "Packages cannot be transferred between accounts.",
              ]}
            />
            <KeyLine>
              Benefits are redeemed when you approve a facility request with
              your PIN.
            </KeyLine>
            <P>
              The specific services covered, visit limits, and monetary caps
              are detailed on each package's description page before purchase.
            </P>

            {/* 3 ─ Out-of-pocket payments */}
            <SectionHeading number={3} title="Out-of-pocket payments" />
            <P>
              If a service exceeds your package coverage or falls outside the
              covered benefit categories, you may be required to make an
              out-of-pocket payment directly to the facility. AbaAccess will
              clearly indicate when a co-pay or balance is expected before you
              approve a request.
            </P>

            {/* 4 ─ Refund policy */}
            <SectionHeading number={4} title="Refund policy" />
            <P>
              Refund eligibility depends on the package type and how much of
              the coverage has been used. Requests for refunds must be
              submitted within 14 days of purchase. Partially used packages
              may be eligible for pro-rated refunds at our discretion.
            </P>
            <P>
              Refund processing times vary by payment method. A detailed
              refund policy will be published as additional payment methods
              become available.
            </P>

            {/* 5 ─ Service availability */}
            <SectionHeading number={5} title="Service availability" />
            <P>
              AbaAccess strives to maintain continuous service availability
              but does not guarantee uninterrupted access. Scheduled
              maintenance, network outages, or force majeure events may
              temporarily affect the app's functionality.
            </P>
            <P>
              Facility availability and accepted package types are determined
              by each facility and may change without notice. Always confirm
              coverage eligibility before visiting a facility.
            </P>

            {/* 6 ─ Liability disclaimer */}
            <SectionHeading number={6} title="Liability disclaimer" />
            <P>
              AbaAccess acts as a platform connecting you with healthcare
              facilities. We are not a healthcare provider and do not deliver
              medical services. The quality, safety, and outcomes of care
              received at partner facilities are the sole responsibility of
              those facilities.
            </P>
            <P>
              To the maximum extent permitted by law, AbaAccess shall not be
              liable for indirect, incidental, or consequential damages
              arising from your use of the platform.
            </P>

            {/* 7 ─ Contact */}
            <SectionHeading number={7} title="Contact" />
            <P>
              For questions about these Terms, please contact us through the
              Help & support section in Settings, or email{" "}
              <span
                className="text-brand-primary-500"
                style={{ fontWeight: 500 }}
              >
                legal@abaaccess.com
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
