import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ImageWithHighlights from '@/components/ImageWithHighlights'
import { getAnalysis, deleteAnalysis, waitForAnalysisComplete } from '@/api'
import type { Analysis } from '@/types'

export default function AnalysisDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!id) return
    loadAnalysis()
  }, [id])

  const loadAnalysis = async () => {
    if (!id) return

    try {
      setIsLoading(true)
      const data = await getAnalysis(id)
      setAnalysis(data)

      // 분석이 처리 중이면 완료될 때까지 대기
      if (data.status === 'processing') {
        const completed = await waitForAnalysisComplete(id)
        setAnalysis(completed)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '분석을 불러오는데 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!id || !confirm('정말로 이 분석을 삭제하시겠습니까?')) return

    try {
      setIsDeleting(true)
      await deleteAnalysis(id)
      navigate('/analysis/list')
    } catch (err: any) {
      alert(err.response?.data?.message || '삭제에 실패했습니다')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-dark-background">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {analysis?.status === 'processing' ? '분석 중입니다...' : '로딩 중...'}
        </p>
      </div>
    )
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-16 text-center">
            <p className="text-red-600 dark:text-red-400 mb-6">{error || '분석을 찾을 수 없습니다'}</p>
            <Link to="/analysis/list">
              <Button>목록으로 돌아가기</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/analysis/list">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              목록으로
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-1">
          {/* 이미지 + 하이라이트 */}
          <Card>
            <CardHeader>
              <CardTitle>분석 이미지 및 이슈</CardTitle>
              <CardDescription>
                이미지 위의 박스를 클릭하면 상세한 이슈 내용을 확인할 수 있습니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageWithHighlights
                imageUrl={`${import.meta.env.VITE_API_BASE_URL}/${analysis.filePath}`}
                highlights={analysis.highlights}
                imageAlt="분석 이미지"
                originalWidth={analysis.imageWidth}
                originalHeight={analysis.imageHeight}
              />
            </CardContent>
          </Card>

          {/* 사용자 의도 */}
          <Card>
            <CardHeader>
              <CardTitle>사용자 의도</CardTitle>
              <CardDescription>
                {new Date(analysis.createdAt).toLocaleString('ko-KR')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {analysis.userIntent}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI 분석 결과 */}
        {analysis.status === 'completed' && analysis.aiAnalysisResult && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>AI 분석 결과</CardTitle>
              <CardDescription>
                눈길 UX/UI 분석 리포트
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{analysis.aiAnalysisResult}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {analysis.status === 'failed' && (
          <Card className="mt-6">
            <CardContent className="py-8 text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">
                분석에 실패했습니다
              </p>
              <Button onClick={() => navigate('/analysis')}>
                새로운 분석 시작하기
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
