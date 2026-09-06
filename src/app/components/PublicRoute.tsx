import { Navigate, Outlet } from "react-router"
import { useAuth } from "../../lib/auth-context"

export function PublicRoute() {
  const { user, loading, profile, verifyingPin } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-neutral-100 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-primary-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  // Only redirect when signup is fully complete.
  // A session alone is not enough — the user must have finished the onboarding flow.
  // This prevents the race condition where onAuthStateChange fires mid-signup
  // (after signUp creates the session) and redirects before the profile steps run.
  // verifyingPin guards the equivalent race on /auth-07: signInWithPin creates
  // a session before it has actually confirmed the PIN is correct.
  if (user && profile.profileComplete && !verifyingPin) {
    return <Navigate to="/home-01" replace />
  }

  return <Outlet />
}
