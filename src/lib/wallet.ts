export type WalletTxType = 'package_purchase' | 'topup' | 'oop'
export type WalletTxDirection = 'credit' | 'debit'
export type WalletTxStatus = 'completed' | 'pending' | 'failed'

export type WalletTransaction = {
  id: string
  type: WalletTxType
  title: string
  subtitle: string
  amount_ugx: number
  direction: WalletTxDirection
  status: WalletTxStatus
  created_at: string
}

export function computeBalance(rows: Pick<WalletTransaction, 'amount_ugx' | 'direction' | 'status'>[]): number {
  return rows.reduce((sum, tx) => {
    if (tx.status !== 'completed') return sum
    return sum + (tx.direction === 'credit' ? tx.amount_ugx : -tx.amount_ugx)
  }, 0)
}

export function formatUgx(amount: number): string {
  return `UGX ${amount.toLocaleString('en-UG')}`
}

export function formatTxDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

  if (isSameDay(d, now)) return 'Today'
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (isSameDay(d, yesterday)) return 'Yesterday'
  return d.toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatTxTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-UG', { hour: 'numeric', minute: '2-digit' })
}
