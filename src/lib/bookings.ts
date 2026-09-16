import { supabase } from './supabase'

// Lowercase-hyphenated, shared with aba-partner's StatusChip.tsx VisitStatus
// union (plus 'cancelled', which that union doesn't have but both apps need).
export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'reschedule-requested'
  | 'proposed'
  | 'declined'
  | 'cancelled'
  | 'completed'

export interface Booking {
  id: string
  facility_id: string
  facility_name: string
  patient_name: string
  service: string
  preferred_date: string
  preferred_time: string
  notes: string | null
  status: BookingStatus
  proposed_date: string | null
  proposed_time: string | null
  proposal_reason: string | null
  decline_reason: string | null
  decline_notes: string | null
}

const BOOKING_FIELDS =
  'id, facility_id, facility_name, patient_name, service, preferred_date, preferred_time, notes, status, proposed_date, proposed_time, proposal_reason, decline_reason, decline_notes'

export async function createBooking(input: {
  facilityId: string
  facilityName: string
  patientId: string // 'member' or a dependent's uuid
  patientName: string
  service: string
  preferredDate: string
  preferredTime: string
  notes?: string
  memberPhone?: string
  memberEmail?: string
}): Promise<string> {
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData?.session) throw new Error('No active session')

  const dependentId = input.patientId === 'member' ? null : input.patientId

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: sessionData.session.user.id,
      dependent_id: dependentId,
      facility_id: input.facilityId,
      facility_name: input.facilityName,
      patient_name: input.patientName,
      service: input.service,
      preferred_date: input.preferredDate,
      preferred_time: input.preferredTime,
      notes: input.notes?.trim() || null,
      member_phone: input.memberPhone || null,
      member_email: input.memberEmail || null,
      status: 'pending',
    })
    .select('id')
    .single()
  if (error) throw new Error(`Failed to create booking: ${error.message}`)
  return data.id
}

export async function fetchBooking(id: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select(BOOKING_FIELDS)
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error(`Failed to load booking: ${error.message}`)
  return data as Booking | null
}

export async function fetchMyBookings(): Promise<Booking[]> {
  // RLS already scopes rows to auth.uid() = user_id — no explicit filter needed.
  const { data, error } = await supabase
    .from('bookings')
    .select(BOOKING_FIELDS)
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Failed to load bookings: ${error.message}`)
  return (data ?? []) as Booking[]
}

export async function cancelBooking(id: string): Promise<void> {
  const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
  if (error) throw new Error(`Failed to cancel booking: ${error.message}`)
}

export async function requestReschedule(
  id: string,
  date: string,
  time: string,
  reason?: string
): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({
      status: 'reschedule-requested',
      proposed_date: date,
      proposed_time: time,
      proposal_reason: reason?.trim() || null,
    })
    .eq('id', id)
  if (error) throw new Error(`Failed to request reschedule: ${error.message}`)
}
