import { Navigate, Outlet } from "react-router"
import { useAuth } from "../../lib/auth-context"

export function PublicRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-neutral-100 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-primary-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/home-01" replace />
  }

  return <Outlet />
}
