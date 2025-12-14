import apiClient from './client'
import type {
  Analysis,
  CreateAnalysisResponse,
  MessageResponse,
} from '@/types'

// 분석 생성 (이미지 업로드)
export const createAnalysis = async (
  file: File,
  userIntent: string
): Promise<CreateAnalysisResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('userIntent', userIntent)

  const response = await apiClient.post<CreateAnalysisResponse>('/analysis', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  
  return response.data
}

// 내 분석 목록 조회
export const getAnalysisList = async (): Promise<Analysis[]> => {
  const response = await apiClient.get<Analysis[]>('/analysis')
  return response.data
}

// 분석 상세 조회
export const getAnalysis = async (id: string): Promise<Analysis> => {
  const response = await apiClient.get<Analysis>(`/analysis/${id}`)
  return response.data
}

// 분석 삭제
export const deleteAnalysis = async (id: string): Promise<MessageResponse> => {
  const response = await apiClient.delete<MessageResponse>(`/analysis/${id}`)
  return response.data
}

// 분석 완료 대기 (폴링)
export const waitForAnalysisComplete = async (
  id: string,
  intervalMs: number = 5000,
  maxAttempts: number = 60 // 5분
): Promise<Analysis> => {
  let attempts = 0

  const poll = async (): Promise<Analysis> => {
    const analysis = await getAnalysis(id)

    if (analysis.status === 'completed') {
      return analysis
    } else if (analysis.status === 'failed') {
      throw new Error('분석이 실패했습니다')
    }

    attempts++
    if (attempts >= maxAttempts) {
      throw new Error('분석 시간이 초과되었습니다')
    }

    // 대기 후 재시도
    await new Promise((resolve) => setTimeout(resolve, intervalMs))
    return poll()
  }

  return poll()
}
