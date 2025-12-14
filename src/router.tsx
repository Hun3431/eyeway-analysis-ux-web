import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute, PublicRoute } from '@/components/RouteGuards'
import RootRedirect from '@/pages/RootRedirect'
import LoginPage from '@/pages/LoginPage'
import AnalysisPage from '@/pages/AnalysisPage'
import AnalysisListPage from '@/pages/AnalysisListPage'
import AnalysisDetailPage from '@/pages/AnalysisDetailPage'
import MyPage from '@/pages/MyPage'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 루트 경로 - 자동 리다이렉트 */}
        <Route path="/" element={<RootRedirect />} />

        {/* 비로그인 전용 페이지 */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* 로그인 필요한 페이지 */}
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <AnalysisPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis/list"
          element={
            <ProtectedRoute>
              <AnalysisListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis/:id"
          element={
            <ProtectedRoute>
              <AnalysisDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mypage"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
