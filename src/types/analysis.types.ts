// 분석 상태
export type AnalysisStatus = 'processing' | 'completed' | 'failed'

// 심각도
export type HighlightSeverity = 'high' | 'medium' | 'low'

// 하이라이트 좌표
export interface HighlightCoordinates {
  x: number
  y: number
  width: number
  height: number
}

// 이슈 하이라이트
export interface Highlight {
  id: number
  element: string
  issue: string
  severity: HighlightSeverity
  coordinates: HighlightCoordinates
}

// 분석 데이터
export interface Analysis {
  id: string
  userId: string
  filePath: string
  userIntent: string
  imageWidth: number // 원본 이미지 너비
  imageHeight: number // 원본 이미지 높이
  status: AnalysisStatus
  aiAnalysisResult?: string
  highlights?: Highlight[]
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
