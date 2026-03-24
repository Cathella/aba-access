import { MobileFrame } from "../components/MobileFrame";
import { PageNav } from "../components/PageNav";
import { SectionLabel } from "../components/SectionLabel";
import { CheckCircle2, AlertTriangle, XCircle, ExternalLink } from "lucide-react";

/* ── Color style definitions ── */

interface ColorSwatch {
  token: string;
  hex: string;
  twClass: string; // Tailwind bg class
}

interface ColorGroup {
  group: string;
  swatches: ColorSwatch[];
}

const colorStyles: ColorGroup[] = [
  {
    group: "Brand / Primary",
    swatches: [
      { token: "Primary/500", hex: "#32C28A", twClass: "bg-brand-primary-500" },
      { token: "Primary/400", hex: "#3ACD93", twClass: "bg-brand-primary-400" },
      { token: "Primary/300", hex: "#56D8A8", twClass: "bg-brand-primary-300" },
      { token: "Primary/100", hex: "#C2F0DE", twClass: "bg-brand-primary-100" },
      { token: "Primary/50",  hex: "#DFF7EE", twClass: "bg-brand-primary-50" },
    ],
  },
  {
    group: "Brand / Secondary",
    swatches: [
      { token: "Secondary/500", hex: "#3A8DFF", twClass: "bg-brand-secondary-500" },
      { token: "Secondary/50",  hex: "#E8F2FF", twClass: "bg-brand-secondary-50" },
    ],
  },
  {
    group: "Neutral",
    swatches: [
      { token: "Neutral/900", hex: "#1A1A1A", twClass: "bg-brand-neutral-900" },
      { token: "Neutral/800", hex: "#2E2E2E", twClass: "bg-brand-neutral-800" },
      { token: "Neutral/700", hex: "#4A4F55", twClass: "bg-brand-neutral-700" },
      { token: "Neutral/500", hex: "#8F9AA1", twClass: "bg-brand-neutral-500" },
      { token: "Neutral/300", hex: "#C9D0DB", twClass: "bg-brand-neutral-300" },
      { token: "Neutral/200", hex: "#E5E8EC", twClass: "bg-brand-neutral-200" },
      { token: "Neutral/100", hex: "#F7F9FC", twClass: "bg-brand-neutral-100" },
      { token: "Neutral/0",   hex: "#FFFFFF", twClass: "bg-brand-neutral-0" },
    ],
  },
  {
    group: "Status / Success",
    swatches: [
      { token: "Success/500", hex: "#38C172", twClass: "bg-brand-success-500" },
      { token: "Success/50",  hex: "#E9F8F0", twClass: "bg-brand-success-50" },
    ],
  },
  {
    group: "Status / Warning",
    swatches: [
      { token: "Warning/500", hex: "#FFB649", twClass: "bg-brand-warning-500" },
      { token: "Warning/50",  hex: "#FFF3DC", twClass: "bg-brand-warning-50" },
    ],
  },
  {
    group: "Status / Error",
    swatches: [
      { token: "Error/500", hex: "#E44F4F", twClass: "bg-brand-error-500" },
      { token: "Error/50",  hex: "#FDECEC", twClass: "bg-brand-error-50" },
    ],
  },
];

const spacingValues = [4, 8, 12, 16, 20, 24, 32, 40];

/* ── Helper: is the swatch light enough to need a border? ── */
function needsBorder(hex: string) {
  return ["#FFFFFF", "#F7F9FC", "#E5E8EC", "#E8F2FF", "#DFF7EE", "#C2F0DE", "#E9F8F0", "#FFF3DC", "#FDECEC", "#C9D0DB"].includes(hex);
}

/* ── Helper: is the swatch dark enough to show white text? ── */
function isLightText(hex: string) {
  return ["#1A1A1A", "#2E2E2E", "#4A4F55", "#32C28A", "#3ACD93", "#3A8DFF", "#38C172", "#E44F4F"].includes(hex);
}

export function FoundationsPage() {
  return (
    <MobileFrame>
      <div className="px-5 pt-4 pb-2">
        <h2 className="text-[22px] tracking-[-0.01em] text-brand-neutral-900 mb-1" style={{ fontWeight: 600 }}>
          01 Foundations
        </h2>
        <p className="text-[14px] text-brand-neutral-500 mb-6" style={{ fontWeight: 400 }}>
          Design tokens, colors & type scale
        </p>
      </div>

      {/* ── Typography ── */}
      <SectionLabel label="Typography — Geist" className="mb-3" />
      <div className="px-5 mb-6">
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5 space-y-4">
          <div>
            <div className="text-[11px] text-brand-neutral-500 mb-1" style={{ fontWeight: 400 }}>Display / 28px / 600</div>
            <div className="text-[28px] tracking-[-0.02em] text-brand-neutral-900" style={{ fontWeight: 600, lineHeight: 1.15 }}>
              AbaAccess
            </div>
          </div>
          <div className="border-t border-brand-neutral-200 pt-4">
            <div className="text-[11px] text-brand-neutral-500 mb-1" style={{ fontWeight: 400 }}>Heading / 20px / 600</div>
            <div className="text-[20px] tracking-[-0.01em] text-brand-neutral-900" style={{ fontWeight: 600, lineHeight: 1.3 }}>
              Section Heading
            </div>
          </div>
          <div className="border-t border-brand-neutral-200 pt-4">
            <div className="text-[11px] text-brand-neutral-500 mb-1" style={{ fontWeight: 400 }}>Subhead / 16px / 500</div>
            <div className="text-[16px] text-brand-neutral-800" style={{ fontWeight: 500, lineHeight: 1.4 }}>
              Card or List Subhead
            </div>
          </div>
          <div className="border-t border-brand-neutral-200 pt-4">
            <div className="text-[11px] text-brand-neutral-500 mb-1" style={{ fontWeight: 400 }}>Body / 14px / 400</div>
            <div className="text-[14px] text-brand-neutral-700" style={{ fontWeight: 400, lineHeight: 1.5 }}>
              Regular body text for descriptions and content. Optimized for mobile readability.
            </div>
          </div>
          <div className="border-t border-brand-neutral-200 pt-4">
            <div className="text-[11px] text-brand-neutral-500 mb-1" style={{ fontWeight: 400 }}>Caption / 12px / 400</div>
            <div className="text-[12px] text-brand-neutral-500" style={{ fontWeight: 400, lineHeight: 1.4 }}>
              Helper text, timestamps, meta
            </div>
          </div>
          <div className="border-t border-brand-neutral-200 pt-4">
            <div className="text-[11px] text-brand-neutral-500 mb-1" style={{ fontWeight: 400 }}>Label / 11px / 500 / Uppercase</div>
            <div className="text-[11px] tracking-[0.08em] uppercase text-brand-neutral-700" style={{ fontWeight: 500 }}>
              Section Label
            </div>
          </div>
        </div>
      </div>

      {/* ── Color Styles ── */}
      <SectionLabel label="Color Styles" className="mb-3" />
      <div className="px-5 mb-6 space-y-3">
        {colorStyles.map((group) => (
          <div
            key={group.group}
            className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-4"
          >
            <div className="text-[11px] tracking-[0.06em] uppercase text-brand-neutral-500 mb-3" style={{ fontWeight: 500 }}>
              {group.group}
            </div>
            <div className="space-y-2">
              {group.swatches.map((swatch) => (
                <div key={swatch.token} className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg shrink-0 ${swatch.twClass} ${
                      needsBorder(swatch.hex) ? "border border-brand-neutral-200" : ""
                    } flex items-center justify-center`}
                  >
                    {/* Tiny label inside dark swatches for visual interest */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-brand-neutral-900" style={{ fontWeight: 500 }}>
                      {swatch.token}
                    </div>
                  </div>
                  <code className="text-[11px] text-brand-neutral-500 shrink-0 tabular-nums" style={{ fontWeight: 400 }}>
                    {swatch.hex}
                  </code>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Semantic Mapping Preview ── */}
      <SectionLabel label="Semantic Usage" className="mb-3" />
      <div className="px-5 mb-6">
        <div className="bg-brand-neutral-100 border border-brand-neutral-200 rounded-2xl p-4 space-y-3">
          {/* Surface card */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-xl p-4">
            <div className="text-[12px] text-brand-neutral-500 mb-2" style={{ fontWeight: 500 }}>
              Card Surface · Neutral/0 + Neutral/200 border
            </div>
            <div className="text-[14px] text-brand-neutral-900" style={{ fontWeight: 400 }}>
              Primary text on Neutral/100 background
            </div>
            <div className="text-[13px] text-brand-neutral-500 mt-1" style={{ fontWeight: 400 }}>
              Secondary text uses Neutral/500
            </div>
          </div>

          {/* Primary button */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-xl p-4">
            <div className="text-[12px] text-brand-neutral-500 mb-3" style={{ fontWeight: 500 }}>
              Primary Button · bg Primary/300 · Neutral/900 text · 1.5px border
            </div>
            <button className="w-full h-11 bg-brand-primary-300 hover:bg-brand-primary-400 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[14px] transition-colors" style={{ fontWeight: 500 }}>
              Confirm Package
            </button>
          </div>

          {/* Secondary button */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-xl p-4">
            <div className="text-[12px] text-brand-neutral-500 mb-3" style={{ fontWeight: 500 }}>
              Secondary Button · bg Primary/100 · Neutral/900 text · 1.5px border
            </div>
            <button className="w-full h-11 bg-brand-primary-100 text-brand-neutral-900 border-[1.5px] border-brand-neutral-900 rounded-xl text-[14px] transition-colors" style={{ fontWeight: 500 }}>
              View Details
            </button>
          </div>

          {/* Tertiary link */}
          <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-xl p-4">
            <div className="text-[12px] text-brand-neutral-500 mb-3" style={{ fontWeight: 500 }}>
              Tertiary Link · text Secondary/500
            </div>
            <button className="flex items-center gap-1.5 text-brand-secondary-500 text-[14px] bg-transparent" style={{ fontWeight: 500 }}>
              <ExternalLink size={14} />
              View in ABA Partner
            </button>
          </div>
        </div>
      </div>

      {/* ── Status Banners ── */}
      <SectionLabel label="Status Banners" className="mb-3" />
      <div className="px-5 mb-6 space-y-2.5">
        {/* Success */}
        <div className="bg-brand-success-50 border border-brand-success-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-brand-success-500 shrink-0" />
          <div>
            <div className="text-[13px] text-brand-success-500" style={{ fontWeight: 500 }}>
              Package approved
            </div>
            <div className="text-[12px] text-brand-neutral-700" style={{ fontWeight: 400 }}>
              All goals validated by BCBA
            </div>
          </div>
        </div>
        {/* Warning */}
        <div className="bg-brand-warning-50 border border-brand-warning-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle size={18} className="text-brand-warning-500 shrink-0" />
          <div>
            <div className="text-[13px] text-brand-warning-500" style={{ fontWeight: 500 }}>
              Pending review
            </div>
            <div className="text-[12px] text-brand-neutral-700" style={{ fontWeight: 400 }}>
              Awaiting supervisor sign-off
            </div>
          </div>
        </div>
        {/* Error */}
        <div className="bg-brand-error-50 border border-brand-error-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <XCircle size={18} className="text-brand-error-500 shrink-0" />
          <div>
            <div className="text-[13px] text-brand-error-500" style={{ fontWeight: 500 }}>
              Submission failed
            </div>
            <div className="text-[12px] text-brand-neutral-700" style={{ fontWeight: 400 }}>
              Missing required authorization
            </div>
          </div>
        </div>
      </div>

      {/* ── Spacing ── */}
      <SectionLabel label="Spacing Scale" className="mb-3" />
      <div className="px-5 mb-6">
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5 space-y-2.5">
          {spacingValues.map((val) => (
            <div key={val} className="flex items-center gap-3">
              <span className="text-[12px] text-brand-neutral-500 w-8 text-right shrink-0 tabular-nums" style={{ fontWeight: 400 }}>
                {val}
              </span>
              <div
                className="h-3 bg-brand-primary-50 border border-brand-primary-300/30 rounded-sm"
                style={{ width: val * 2.5 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Border Radius ── */}
      <SectionLabel label="Border Radius" className="mb-3" />
      <div className="px-5 mb-2">
        <div className="bg-brand-neutral-0 border border-brand-neutral-200 rounded-2xl p-5">
          <div className="flex items-end gap-4 justify-center">
            {[
              { label: "sm", value: "6px", radius: "rounded-[6px]" },
              { label: "md", value: "8px", radius: "rounded-[8px]" },
              { label: "lg", value: "10px", radius: "rounded-[10px]" },
              { label: "xl", value: "14px", radius: "rounded-[14px]" },
              { label: "2xl", value: "16px", radius: "rounded-[16px]" },
            ].map((r) => (
              <div key={r.label} className="flex flex-col items-center gap-2">
                <div
                  className={`w-12 h-12 border-2 border-brand-neutral-300 ${r.radius}`}
                />
                <div className="text-[11px] text-brand-neutral-700" style={{ fontWeight: 500 }}>
                  {r.label}
                </div>
                <div className="text-[10px] text-brand-neutral-500" style={{ fontWeight: 400 }}>
                  {r.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PageNav />
    </MobileFrame>
  );
}