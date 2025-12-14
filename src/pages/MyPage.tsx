import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, LogOut, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks'

export default function MyPage() {
  const navigate = useNavigate()
  const { user, logout, deleteAccount } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('정말로 회원탈퇴하시겠습니까? 모든 분석 데이터가 삭제됩니다.')) {
      return
    }

    try {
      setIsDeleting(true)
      await deleteAccount()
      navigate('/login')
    } catch (err: any) {
      alert(err.response?.data?.message || '회원탈퇴에 실패했습니다')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            마이페이지
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            계정 정보 및 설정
          </p>
        </div>

        {/* 사용자 정보 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              내 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">이름</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {user?.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">이메일</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {user?.email}
              </p>
            </div>
            {user?.age && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">나이</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {user.age}세
                </p>
              </div>
            )}
            {user?.createdAt && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">가입일</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 계정 관리 */}
        <Card>
          <CardHeader>
            <CardTitle>계정 관리</CardTitle>
            <CardDescription>
              로그아웃 또는 회원탈퇴
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              로그아웃
            </Button>
            <Button
              variant="destructive"
              className="w-full gap-2"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? '처리 중...' : '회원탈퇴'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
