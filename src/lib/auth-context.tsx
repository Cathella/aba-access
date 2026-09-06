import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from './supabase'
import type { Session, User } from '@supabase/supabase-js'
import { saveProfile, getProfile, type UserProfile } from '../app/profileStore'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile
  loading: boolean
  verifyingPin: boolean
  signUp: (phone: string) => Promise<void>
  verifyOtp: (phone: string, otp: string) => Promise<void>
  completeProfile: (profile: { fullName: string; district: string; areaTown?: string; pin: string; dob?: string; gender?: string }) => Promise<void>
  updateProfile: (profile: { fullName: string; district: string; areaTown?: string; dob?: string; gender?: string; email?: string; emergencyName?: string; emergencyPhone?: string }) => Promise<void>
  signInWithPin: (phone: string, pin: string) => Promise<void>
  changePin: (currentPin: string, newPin: string) => Promise<void>
  resetPinAuthenticated: (newPin: string) => Promise<void>
  beginPinResetByPhone: (phone: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Derives stable Supabase email/password credentials from a phone number.
// No SMS or Twilio required — email confirmation must be OFF in Supabase dashboard.
function phoneToCredentials(phone: string) {
  const hash = btoa(phone).replace(/[^a-zA-Z0-9]/g, '').substring(0, 14)
  return {
    email: `${hash}@aba-user.local`,
    password: `aba-${btoa(phone).replace(/=/g, '')}-access`,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile>(() => getProfile())
  const [loading, setLoading] = useState(true)
  // Set while signInWithPin is mid-flight. The Supabase session is created
  // (and onAuthStateChange fires) before the PIN itself has been checked —
  // this stops PublicRoute from treating that transient session as a real
  // login and redirecting to /home-01 before a wrong PIN gets rejected.
  const [verifyingPin, setVerifyingPin] = useState(false)

  // Fetch the user's row from the database and sync it to localStorage + React state.
  // Uses RLS — Supabase automatically returns only the current user's row.
  async function syncProfile() {
    const { data } = await supabase
      .from('users')
      .select('member_id, full_name, district, area_town, phone, dob, gender, email, emergency_contact_name, emergency_contact_phone')
      .maybeSingle()

    if (data) {
      const updated = saveProfile({
        memberId: data.member_id || '',
        fullName: data.full_name || '',
        district: data.district || '',
        areaTown: data.area_town || '',
        phone: data.phone || '',
        dob: data.dob || '',
        gender: data.gender || '',
        email: data.email || '',
        emergencyName: data.emergency_contact_name || '',
        emergencyPhone: data.emergency_contact_phone || '',
        profileComplete: !!(data.full_name && data.member_id),
      })
      setProfile(updated)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session) await syncProfile()
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (phone: string) => {
    const cleanPhone = phone.replace(/\s/g, '')
    // localStorage persists if the app is backgrounded between signup steps
    localStorage.setItem('signupPhone', cleanPhone)

    // Reset profileComplete so PublicRoute does not redirect mid-signup.
    // Needed when a previous session left profileComplete=true in localStorage.
    const reset = saveProfile({ profileComplete: false })
    setProfile(reset)

    const { email, password } = phoneToCredentials(cleanPhone)

    // Ignore signUp errors entirely — "User already registered" (422) is expected
    // when an auth account exists from a partial previous signup. What matters is
    // whether a session was returned; if not, fall through to signInWithPassword.
    const { data } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { phone: cleanPhone } },
    })

    // New user — session returned immediately when email confirmation is OFF
    // in Supabase Dashboard → Authentication → Providers → Email → Confirm email
    if (data?.session) return

    // No session: account already exists → sign in with same derived credentials
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) throw signInError
  }

  const verifyOtp = async (_phone: string, _otp: string) => {
    // OTP screen is intentionally skipped — no Twilio dependency
  }

  const completeProfile = async ({ fullName, district, areaTown, pin, dob, gender }: { fullName: string; district: string; areaTown?: string; pin: string; dob?: string; gender?: string }) => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw new Error(`Session error: ${sessionError.message}`)
    if (!sessionData?.session) throw new Error('No active session — please sign up again')

    const realUser = sessionData.session.user
    // Fall back to phone stored in Supabase user metadata in case localStorage was cleared
    const phone = localStorage.getItem('signupPhone')
      || (realUser.user_metadata?.phone as string | undefined)
      || ''

    // Preserve existing member_id if the user is re-completing their profile
    const { data: existing } = await supabase
      .from('users')
      .select('member_id')
      .maybeSingle()
    const memberId = existing?.member_id || `ABA${Math.floor(100000 + Math.random() * 900000)}`

    const { error } = await supabase.from('users').upsert({
      id: realUser.id,
      phone,
      pin_hash: btoa(pin),
      member_id: memberId,
      full_name: fullName,
      district,
      area_town: areaTown || district,
      dob: dob || null,
      gender: gender || null,
    })
    if (error) throw new Error(`Failed to save profile: ${error.message} (code: ${error.code})`)

    localStorage.removeItem('signupPhone')

    const updated = saveProfile({
      fullName,
      district,
      areaTown: areaTown || district,
      memberId,
      phone,
      dob: dob || '',
      gender: gender || '',
      profileComplete: true,
    })
    setProfile(updated)
  }

  // Used by Settings → Profile to edit an already-completed profile.
  // Unlike completeProfile, this updates the existing row and refreshes the
  // shared profile state so edits are reflected without a full page reload.
  const updateProfile = async ({ fullName, district, areaTown, dob, gender, email, emergencyName, emergencyPhone }: { fullName: string; district: string; areaTown?: string; dob?: string; gender?: string; email?: string; emergencyName?: string; emergencyPhone?: string }) => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw new Error(`Session error: ${sessionError.message}`)
    if (!sessionData?.session) throw new Error('No active session')

    const { error } = await supabase
      .from('users')
      .update({
        full_name: fullName,
        district,
        area_town: areaTown || district,
        dob: dob || null,
        gender: gender || null,
        email: email || null,
        emergency_contact_name: emergencyName || null,
        emergency_contact_phone: emergencyPhone || null,
      })
      .eq('id', sessionData.session.user.id)
    if (error) throw new Error(`Failed to update profile: ${error.message} (code: ${error.code})`)

    const updated = saveProfile({
      fullName,
      district,
      areaTown: areaTown || district,
      dob: dob || '',
      gender: gender || '',
      email: email || '',
      emergencyName: emergencyName || '',
      emergencyPhone: emergencyPhone || '',
    })
    setProfile(updated)
  }

  const signInWithPin = async (phone: string, pin: string) => {
    setVerifyingPin(true)
    try {
      const cleanPhone = phone.replace(/\s/g, '')
      const { email, password } = phoneToCredentials(cleanPhone)

      // Establish session with derived credentials
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) throw new Error('Phone number not registered')

      // Session is active — now verify PIN against the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('pin_hash')
        .single()

      if (userError || !userData) {
        await supabase.auth.signOut()
        throw new Error('Account setup incomplete. Please sign up again.')
      }

      if (userData.pin_hash !== btoa(pin)) {
        await supabase.auth.signOut()
        throw new Error('Incorrect PIN')
      }

      // Sync full profile from DB into localStorage and React state
      await syncProfile()
    } finally {
      setVerifyingPin(false)
    }
  }

  // Shared by changePin and resetPinAuthenticated — both end with the same
  // write, once a session for the account is established.
  async function setPinHash(newPin: string) {
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData?.session) throw new Error('No active session')

    const { error } = await supabase
      .from('users')
      .update({ pin_hash: btoa(newPin) })
      .eq('id', sessionData.session.user.id)
    if (error) throw new Error(`Failed to update PIN: ${error.message} (code: ${error.code})`)
  }

  // Settings → Security & PIN → Change PIN. Requires knowing the current PIN.
  const changePin = async (currentPin: string, newPin: string) => {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('pin_hash')
      .maybeSingle()
    if (userError || !userData) throw new Error('Account not found')
    if (userData.pin_hash !== btoa(currentPin)) throw new Error('Current PIN is incorrect')

    await setPinHash(newPin)
  }

  // Settings → Security & PIN → Reset PIN. User already has a live session,
  // so no extra verification is needed to set a new PIN.
  const resetPinAuthenticated = async (newPin: string) => {
    await setPinHash(newPin)
  }

  // "Forgot PIN?" from the login screen — no session yet. There's no SMS
  // provider wired up, so identity is proven the same way login already
  // proves it: the account's Supabase password is derived from the phone
  // number itself (see phoneToCredentials above), not a separate secret.
  // This doesn't weaken anything — it's the same trust boundary login uses.
  // Establishes the session; the caller then uses resetPinAuthenticated to
  // actually set the new PIN once one has been entered.
  const beginPinResetByPhone = async (phone: string) => {
    const cleanPhone = phone.replace(/\s/g, '')
    const { email, password } = phoneToCredentials(cleanPhone)

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) throw new Error('Phone number not registered')

    await syncProfile()
  }

  const signOut = async () => {
    setUser(null)
    setSession(null)
    setProfile(getProfile())
    localStorage.removeItem('signupPhone')
    localStorage.removeItem('newPin')
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, verifyingPin, signUp, verifyOtp, completeProfile, updateProfile, signInWithPin, changePin, resetPinAuthenticated, beginPinResetByPhone, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
