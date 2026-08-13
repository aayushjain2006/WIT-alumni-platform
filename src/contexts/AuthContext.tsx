import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import api from '../lib/api'

export type UserRole = 'student' | 'alumni' | 'admin'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  profileImage?: string
  graduationYear?: number
  department?: string
  company?: string
  jobTitle?: string
  location?: string
  bio?: string
  skills?: string[]
  isProfileComplete: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<void>
  signup: (email: string, password: string, firstName: string, lastName: string, role: UserRole) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function normalizeUser(raw: any): User | null {
  if (!raw) return null
  return {
    id: raw._id || raw.id,
    email: raw.email,
    firstName: raw.firstName,
    lastName: raw.lastName,
    role: raw.role,
    profileImage: raw.profileImage,
    graduationYear: raw.graduationYear,
    department: raw.department,
    company: raw.company,
    jobTitle: raw.jobTitle,
    location: raw.location,
    bio: raw.bio,
    skills: raw.skills,
    isProfileComplete: raw.isProfileComplete ?? false,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const hasInitialized = useRef(false)

  // On mount: check if we have a stored token and try to fetch the current user
  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    const initAuth = async () => {
      const storedToken = localStorage.getItem('accessToken')
      const storedUser = localStorage.getItem('user')

      if (!storedToken) {
        // No token means not logged in, skip the API call entirely
        console.log('[Auth] No stored token, showing login screen')
        setIsLoading(false)
        return
      }

      try {
        console.log('[Auth] Found stored token, verifying with /auth/me...')
        const response = await api.get('/auth/me')
        const userData = response.data?.data?.user || response.data?.data
        const normalized = normalizeUser(userData)
        console.log('[Auth] /auth/me success:', normalized)
        setUser(normalized)
        localStorage.setItem('user', JSON.stringify(normalized))
      } catch (error: any) {
        console.warn('[Auth] /auth/me failed:', error.response?.status, error.message)
        // Token is invalid/expired and refresh also failed
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    try {
      console.log('[Auth] Attempting login for:', email)
      const response = await api.post('/auth/login', { email, password })

      console.log('[Auth] Login response:', JSON.stringify(response.data, null, 2))

      const responseData = response.data?.data
      const accessToken = responseData?.accessToken
      const rawUser = responseData?.user

      if (!accessToken) {
        console.error('[Auth] No accessToken in response!')
        throw new Error('Server did not return an access token')
      }

      if (!rawUser) {
        console.error('[Auth] No user object in response!')
        throw new Error('Server did not return user data')
      }

      // Save token FIRST so subsequent API calls are authenticated
      localStorage.setItem('accessToken', accessToken)

      const normalized = normalizeUser(rawUser)
      console.log('[Auth] Login success, user:', normalized)

      localStorage.setItem('user', JSON.stringify(normalized))
      setUser(normalized)
    } catch (error: any) {
      console.error('[Auth] Login error:', error.response?.data || error.message)
      const message = error.response?.data?.message || error.message || 'Login failed'
      throw new Error(message)
    }
  }, [])

  const signup = useCallback(async (email: string, password: string, firstName: string, lastName: string, role: UserRole) => {
    try {
      console.log('[Auth] Attempting signup for:', email)
      const response = await api.post('/auth/register', { email, password, firstName, lastName, role })

      console.log('[Auth] Signup response:', JSON.stringify(response.data, null, 2))

      const responseData = response.data?.data
      const accessToken = responseData?.accessToken
      const rawUser = responseData?.user

      if (!accessToken) {
        console.error('[Auth] No accessToken in signup response!')
        throw new Error('Server did not return an access token')
      }

      if (!rawUser) {
        console.error('[Auth] No user object in signup response!')
        throw new Error('Server did not return user data')
      }

      localStorage.setItem('accessToken', accessToken)

      const normalized = normalizeUser(rawUser)
      console.log('[Auth] Signup success, user:', normalized)

      localStorage.setItem('user', JSON.stringify(normalized))
      setUser(normalized)
    } catch (error: any) {
      console.error('[Auth] Signup error:', error.response?.data || error.message)
      const message = error.response?.data?.message || error.message || 'Signup failed'
      throw new Error(message)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch (e) {
      console.warn('[Auth] Logout API call failed (non-critical):', e)
    }
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    console.log('[Auth] Logged out, cleared all tokens')
  }, [])

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) throw new Error('Not logged in')
    const response = await api.put('/users/profile', updates)
    const updatedUser = normalizeUser(response.data?.data?.user || response.data?.data)
    if (!updatedUser) throw new Error('Failed to update profile')
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }, [user])

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateProfile,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}