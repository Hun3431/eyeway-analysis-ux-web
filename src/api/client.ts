import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosInstance } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30초
})

// 요청 인터셉터: JWT 토큰 자동 첨부
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken')
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터: 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    // 401 에러 처리
    if (error.response?.status === 401) {
      const message = error.response.data?.message || ''
      
      // 승인 대기 상태 체크
      if (message.includes('승인 대기') || message.includes('승인') || message.includes('approved')) {
        // 승인 대기 상태인 경우 - 알림 표시 후 로그아웃 처리
        if (window.location.pathname !== '/login') {
          alert('계정이 아직 승인되지 않았습니다.\n관리자 승인을 기다려주세요.')
          localStorage.removeItem('accessToken')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      } else {
        // 일반적인 인증 실패 (토큰 만료 등)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        
        // 로그인 페이지가 아닌 경우에만 리다이렉트
        if (window.location.pathname !== '/login') {
          alert('로그인이 만료되었습니다.')
          window.location.href = '/login'
        }
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
