import { Info, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-6 p-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Info className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            프로젝트 정보
          </h1>
        </div>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          모든 라이브러리가 성공적으로 설치되고 작동합니다!
        </p>
        
        <div className="flex gap-4 justify-center mt-8">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              홈으로
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
