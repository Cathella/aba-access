import { Stethoscope, FlaskConical, Pill } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type PackageBenefit = {
  label: string       // compact form for chips, e.g. "Consult 6"
  fullLabel: string   // full form, e.g. "Consultation visits"
  icon: LucideIcon
  value: string       // display value, e.g. "6" or "10% (cap UGX 30,000)"
  total: number       // numeric total — visit/test count, or a UGX cap
  unit: string        // "visits" | "tests" | "UGX"
  // Maps to approval_requests.service_type for real usage tracking.
  // Absent where usage isn't tracked yet (UGX-based pharmacy caps).
  serviceType?: 'Consultation' | 'Lab'
  note?: string
}

export type PackageCatalogItem = {
  name: string
  priceUgx: number
  highlights: string
  category: string
  tag: string | null
  note: string | null
  sharing: string | null
  benefits: PackageBenefit[]
}

export const PACKAGE_EXCLUSIONS = [
  'Admissions not covered',
  'Surgery not covered',
  'Beyond caps is out-of-pocket',
]

export const PACKAGE_CATALOG: Record<string, PackageCatalogItem> = {
  'care-bundle-50k': {
    name: 'Care Bundle 50K',
    priceUgx: 50_000,
    highlights: '6 consult visits • 3 lab tests • 10% pharmacy discount',
    category: 'Care Bundle',
    tag: 'Best value',
    note: 'Share with up to 3 dependents',
    sharing: 'Covers you + up to 3 dependents',
    benefits: [
      { label: 'Consult 6', fullLabel: 'Consultation visits', icon: Stethoscope, value: '6', total: 6, unit: 'visits', serviceType: 'Consultation' },
      { label: 'Lab 3', fullLabel: 'Lab tests', icon: FlaskConical, value: '3', total: 3, unit: 'tests', serviceType: 'Lab' },
      { label: 'Pharmacy cap 30k', fullLabel: 'Pharmacy discount', icon: Pill, value: '10% (cap UGX 30,000)', total: 30_000, unit: 'UGX', note: 'monthly' },
    ],
  },
  'consultation-only-50k': {
    name: 'Consultation Only 50K',
    priceUgx: 50_000,
    highlights: '6 consultation visits',
    category: 'Consultation',
    tag: null,
    note: 'Up to 3 dependents',
    sharing: 'Covers you + up to 3 dependents',
    benefits: [
      { label: 'Consult 6', fullLabel: 'Consultation visits', icon: Stethoscope, value: '6', total: 6, unit: 'visits', serviceType: 'Consultation' },
    ],
  },
  'lab-only-30k': {
    name: 'Lab Only 30K',
    priceUgx: 30_000,
    highlights: '5 lab tests',
    category: 'Lab',
    tag: null,
    note: null,
    sharing: null,
    benefits: [
      { label: 'Lab 5', fullLabel: 'Lab tests', icon: FlaskConical, value: '5', total: 5, unit: 'tests', serviceType: 'Lab' },
    ],
  },
  'pharmacy-only-20k': {
    name: 'Pharmacy Only 20K',
    priceUgx: 20_000,
    highlights: '10% pharmacy discount (cap UGX 20,000)',
    category: 'Pharmacy',
    tag: null,
    note: null,
    sharing: null,
    benefits: [
      { label: 'Pharmacy cap 20k', fullLabel: 'Pharmacy discount', icon: Pill, value: '10% (cap UGX 20,000)', total: 20_000, unit: 'UGX', note: 'monthly' },
    ],
  },
}

export function formatPackageDate(d: string | Date): string {
  return new Date(d).toLocaleDateString('en-UG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function daysRemaining(expiresAt: string): number {
  return Math.max(
    0,
    Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86_400_000)
  )
}
