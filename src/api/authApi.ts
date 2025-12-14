import apiClient from './client'
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  CheckEmailResponse,
  MessageResponse,
} from '@/types'

// 회원가입
export const signup = async (data: SignupRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/signup', data)
  return response.data
}

// 로그인
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data)
  return response.data
}

// 이메일 중복 확인
export const checkEmail = async (email: string): Promise<CheckEmailResponse> => {
  const response = await apiClient.get<CheckEmailResponse>(`/auth/check-email/${email}`)
  return response.data
}

// 로그아웃
export const logout = async (): Promise<MessageResponse> => {
  const response = await apiClient.post<MessageResponse>('/auth/logout')
  return response.data
}

// 회원탈퇴
export const deleteAccount = async (): Promise<MessageResponse> => {
  const response = await apiClient.delete<MessageResponse>('/auth/account')
  return response.data
}
