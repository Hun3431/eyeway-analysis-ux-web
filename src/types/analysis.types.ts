// 분석 상태
export type AnalysisStatus = 'processing' | 'completed' | 'failed'

// 분석 데이터
export interface Analysis {
  id: string
  userId: string
  filePath: string
  userIntent: string
  status: AnalysisStatus
  aiAnalysisResult?: string
  createdAt: string
}

// 분석 생성 요청
export interface CreateAnalysisRequest {
  file: File
  userIntent: string
}

// 분석 생성 응답 (처음 생성 시)
export interface CreateAnalysisResponse {
  id: string
  userId: string
  filePath: string
  userIntent: string
  status: AnalysisStatus
  createdAt: string
}
