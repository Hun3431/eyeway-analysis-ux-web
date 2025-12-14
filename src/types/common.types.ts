// API 에러 응답
export interface ApiError {
  statusCode: number
  message: string
  error: string
}

// 공통 메시지 응답
export interface MessageResponse {
  message: string
}
