import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks'

// 루트 경로 자동 리다이렉트
export default function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  // 로그인 여부에 따라 리다이렉트
  return <Navigate to={isAuthenticated ? '/analysis' : '/login'} replace />
}
