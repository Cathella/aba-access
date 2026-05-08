import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from './supabase'
import type { Session, User } from '@supabase/supabase-js'

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
    const { error } = await supabase.auth.signUp({
      phone,
      password: '',
    })
    if (error) throw error
  }

  const verifyOtp = async (phone: string, otp: string) => {
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    })
    if (error) throw error
  }

  const completeProfile = async ({ fullName, district, areaTown, pin }: { fullName: string; district: string; areaTown?: string; pin: string }) => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.phone) throw new Error('No authenticated user')
    
    // Store PIN hash and profile in users table
    const pinHash = btoa(pin) // Replace with bcrypt in production
    const memberId = `ABA${Math.floor(100000 + Math.random() * 900000)}`
    
    const { error } = await supabase.from('users').upsert({
      id: user.id,
      phone: user.phone,
      pin_hash: pinHash,
      member_id: memberId,
      full_name: fullName,
      district: district,
      area_town: areaTown || district,
    })
    if (error) throw error
  }

  const signInWithPin = async (phone: string, pin: string) => {
    const { error } = await supabase.rpc('verify_pin_and_login', {
      phone_input: phone,
      pin_input: pin,
    })
    if (error) throw error
  }

  const signOut = async () => {
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