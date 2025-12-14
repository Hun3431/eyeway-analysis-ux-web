import React, { createContext, useState, useEffect, useCallback } from 'react'
import type { User, LoginRequest, SignupRequest, AuthResponse } from '@/types'
import * as authApi from '@/api/authApi'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginRequest) => Promise<void>
  signup: (data: SignupRequest) => Promise<void>
  logout: () => Promise<void>
  deleteAccount: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 초기 로드 시 localStorage에서 사용자 정보 복원
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('accessToken')

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse user data:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')
      }
    }

    setIsLoading(false)
  }, [])

  // 로그인
  const login = useCallback(async (data: LoginRequest) => {
    const response: AuthResponse = await authApi.login(data)
    
    localStorage.setItem('accessToken', response.accessToken)
    localStorage.setItem('user', JSON.stringify(response.user))
    setUser(response.user)
  }, [])

  // 회원가입
  const signup = useCallback(async (data: SignupRequest) => {
    const response: AuthResponse = await authApi.signup(data)
    
    localStorage.setItem('accessToken', response.accessToken)
    localStorage.setItem('user', JSON.stringify(response.user))
    setUser(response.user)
  }, [])

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      setUser(null)
    }
  }, [])

  // 회원탈퇴
  const deleteAccount = useCallback(async () => {
    await authApi.deleteAccount()
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    deleteAccount,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
