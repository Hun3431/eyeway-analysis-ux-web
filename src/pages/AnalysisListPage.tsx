import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAnalysisList } from '@/api'
import type { Analysis } from '@/types'

export default function AnalysisListPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAnalyses()
  }, [])

  const loadAnalyses = async () => {
    try {
      setIsLoading(true)
      const data = await getAnalysisList()
      setAnalyses(data)
    } catch (err: any) {
      setError(err.response?.data?.message || '분석 목록을 불러오는데 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: Analysis['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded-full">
            <CheckCircle className="h-3 w-3" />
            완료
          </span>
        )
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
            <Loader2 className="h-3 w-3 animate-spin" />
            처리중
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-full">
            <XCircle className="h-3 w-3" />
            실패
          </span>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              분석 목록
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              총 {analyses.length}개의 분석
            </p>
          </div>
          <Link to="/analysis">
            <Button>새 분석 만들기</Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {analyses.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                분석 내역이 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                첫 번째 UX/UI 분석을 시작해보세요
              </p>
              <Link to="/analysis">
                <Button>분석 시작하기</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {analyses.map((analysis) => (
              <Link key={analysis.id} to={`/analysis/${analysis.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">
                        {analysis.userIntent}
                      </CardTitle>
                      {getStatusBadge(analysis.status)}
                    </div>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {new Date(analysis.createdAt).toLocaleString('ko-KR')}
                    </CardDescription>
                  </CardHeader>
                  {analysis.filePath && (
                    <CardContent>
                      <img
                        src={`http://localhost:8080/${analysis.filePath}`}
                        alt="분석 이미지"
                        className="w-full h-40 object-cover rounded-md"
                      />
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
