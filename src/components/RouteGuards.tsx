import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks'

interface ProtectedRouteProps {
  children: React.ReactNode
}

// 로그인 필요한 페이지 보호
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// 비로그인 전용 페이지 (로그인 시 리다이렉트)
export const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/analysis" replace />
  }

  return <>{children}</>
}
