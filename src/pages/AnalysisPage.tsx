import { useState, useRef, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createAnalysis } from '@/api'
import { validateImageFile, formatFileSize } from '@/utils/fileValidation'

export default function AnalysisPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [userIntent, setUserIntent] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleFileSelect = (file: File) => {
    const validationError = validateImageFile(file)
    
    if (validationError) {
      setError(validationError)
      return
    }

    setSelectedFile(file)
    setError('')
    
    // 미리보기 생성
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      setError('이미지를 선택해주세요')
      return
    }

    if (!userIntent.trim()) {
      setError('사용자 의도를 입력해주세요')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const analysis = await createAnalysis(selectedFile, userIntent)
      // 분석 상세 페이지로 이동
      navigate(`/analysis/${analysis.id}`)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || '분석 생성에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            UX/UI 분석하기
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            이미지를 업로드하고 분석 목적을 입력하세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이미지 업로드 */}
          <Card>
            <CardHeader>
              <CardTitle>이미지 업로드</CardTitle>
              <CardDescription>
                PNG, JPG, GIF, WebP 형식 (최대 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {!selectedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    클릭하거나 파일을 드래그하세요
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF, WebP (최대 10MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={previewUrl!}
                      alt="Preview"
                      className="w-full h-auto max-h-96 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ImageIcon className="h-4 w-4" />
                    <span>{selectedFile.name}</span>
                    <span>({formatFileSize(selectedFile.size)})</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 사용자 의도 입력 */}
          <Card>
            <CardHeader>
              <CardTitle>분석 목적</CardTitle>
              <CardDescription>
                어떤 목적으로 이 UI/UX를 분석하고 싶으신가요?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="userIntent">사용자 의도</Label>
                <Textarea
                  id="userIntent"
                  placeholder="예: 사용자가 3단계 이내로 회원가입을 완료할 수 있도록"
                  value={userIntent}
                  onChange={(e) => setUserIntent(e.target.value)}
                  rows={4}
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  구체적으로 작성할수록 더 정확한 분석 결과를 받을 수 있습니다
                </p>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/analysis/list')}
              className="flex-1"
            >
              분석 목록
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !selectedFile}
              className="flex-1"
            >
              {isLoading ? '분석 중...' : '분석 시작'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
