import { Stethoscope, FlaskConical, Pill } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type PackageBenefit = {
  label: string
  icon: LucideIcon
}

export type PackageCatalogItem = {
  name: string
  priceUgx: number
  highlights: string
  benefits: PackageBenefit[]
}

export const PACKAGE_CATALOG: Record<string, PackageCatalogItem> = {
  'care-bundle-50k': {
    name: 'Care Bundle 50K',
    priceUgx: 50_000,
    highlights: '6 consult visits • 3 lab tests • 10% pharmacy discount',
    benefits: [
      { label: 'Consult 6', icon: Stethoscope },
      { label: 'Lab 3', icon: FlaskConical },
      { label: 'Pharmacy cap 30k', icon: Pill },
    ],
  },
  'consultation-only-50k': {
    name: 'Consultation Only 50K',
    priceUgx: 50_000,
    highlights: '6 consultation visits',
    benefits: [{ label: 'Consult 6', icon: Stethoscope }],
  },
  'lab-only-30k': {
    name: 'Lab Only 30K',
    priceUgx: 30_000,
    highlights: '5 lab tests',
    benefits: [{ label: 'Lab 5', icon: FlaskConical }],
  },
  'pharmacy-only-20k': {
    name: 'Pharmacy Only 20K',
    priceUgx: 20_000,
    highlights: '10% pharmacy discount',
    benefits: [{ label: 'Pharmacy cap 20k', icon: Pill }],
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
