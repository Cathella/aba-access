import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from './supabase'
import type { Session, User } from '@supabase/supabase-js'
import { saveProfile } from '../app/profileStore'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (phone: string) => Promise<void>
  verifyOtp: (phone: string, otp: string) => Promise<void>
  completeProfile: (profile: { fullName: string; district: string; areaTown?: string; pin: string }) => Promise<void>
  signInWithPin: (phone: string, pin: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEV_MODE = import.meta.env.DEV

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
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
    sessionStorage.setItem('signupPhone', cleanPhone)

    if (DEV_MODE) {
      // In dev mode, create a mock user without Supabase auth
      const mockUser = {
        id: `dev-${Date.now()}`,
        phone: cleanPhone,
        email: null,
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User
      setUser(mockUser)
      setSession({ access_token: 'dev', refresh_token: 'dev', user: mockUser } as Session)
      return
    }

    const { error } = await supabase.auth.signInWithOtp({ phone: cleanPhone })
    if (error) throw error
  }

  const verifyOtp = async (phone: string, otp: string) => {
    // In dev mode, user is already signed up from signUp
    // This step just confirms the UI flow
    if (!DEV_MODE) {
      const { error } = await supabase.auth.verifyOtp({
        phone: phone.replace(/\s/g, ''),
        token: otp,
        type: 'sms',
      })
      if (error) throw error
    }
  }

  const completeProfile = async ({ fullName, district, areaTown, pin }: { fullName: string; district: string; areaTown?: string; pin: string }) => {
    if (DEV_MODE) {
      // In dev, save to localStorage
      const mockUser = {
        id: `dev-${Date.now()}`,
        phone: sessionStorage.getItem('signupPhone'),
        pin_hash: btoa(pin),
        member_id: `ABA${Math.floor(100000 + Math.random() * 900000)}`,
        full_name: fullName,
        district: district,
        area_town: areaTown || district,
      }
      localStorage.setItem('dev_user', JSON.stringify(mockUser))
      saveProfile({
        fullName,
        district,
        areaTown: areaTown || district,
        profileComplete: true,
      })
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const pinHash = btoa(pin)
    const memberId = `ABA${Math.floor(100000 + Math.random() * 900000)}`

    const { error } = await supabase.from('users').upsert({
      id: user.id,
      phone: sessionStorage.getItem('signupPhone') || user.phone,
      pin_hash: pinHash,
      member_id: memberId,
      full_name: fullName,
      district: district,
      area_town: areaTown || district,
    })
    if (error) throw error
  }

  const signInWithPin = async (phone: string, pin: string) => {
    if (DEV_MODE) {
      // In dev, auto-authenticate
      const mockUser = {
        id: `dev-${Date.now()}`,
        phone: phone.replace(/\s/g, ''),
        email: null,
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User
      setUser(mockUser)
      setSession({ access_token: 'dev', refresh_token: 'dev', user: mockUser } as Session)
      return
    }

    const { error } = await supabase.rpc('verify_pin_and_login', {
      phone_input: phone.replace(/\s/g, ''),
      pin_input: pin,
    })
    if (error) throw error
  }

  const signOut = async () => {
    setUser(null)
    setSession(null)
    localStorage.removeItem('dev_user')
    sessionStorage.removeItem('signupPhone')
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, verifyOtp, completeProfile, signInWithPin, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}