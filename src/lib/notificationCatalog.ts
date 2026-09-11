import { CalendarCheck, Clock, ShieldCheck, CreditCard } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NotificationType = 'booking_confirmed' | 'booking_pending' | 'approval_request' | 'wallet_topup'

export type NotificationTypeStyle = {
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

export const NOTIFICATION_TYPE_STYLES: Record<NotificationType, NotificationTypeStyle> = {
  booking_confirmed: {
    icon: CalendarCheck,
    iconBg: 'bg-brand-success-50',
    iconColor: 'text-brand-success-500',
  },
  booking_pending: {
    icon: Clock,
    iconBg: 'bg-brand-neutral-100',
    iconColor: 'text-brand-neutral-600',
  },
  approval_request: {
    icon: ShieldCheck,
    iconBg: 'bg-brand-primary-50',
    iconColor: 'text-brand-primary-500',
  },
  wallet_topup: {
    icon: CreditCard,
    iconBg: 'bg-brand-secondary-50',
    iconColor: 'text-brand-secondary-500',
  },
}

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return new Date(iso).toLocaleDateString('en-UG', { day: 'numeric', month: 'short' })
}
