// 사용자 관련 타입
export interface User {
  id: string
  email: string
  name: string
  age?: number
  createdAt?: string
}

// 로그인 요청
export interface LoginRequest {
  email: string
  password: string
}

// 회원가입 요청
export interface SignupRequest {
  email: string
  password: string
  name: string
  age?: number
}

// 인증 응답
export interface AuthResponse {
  user: User
  accessToken: string
}

// 이메일 중복 확인 응답
export interface CheckEmailResponse {
  available: boolean
}
