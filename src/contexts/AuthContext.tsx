import React, { createContext, useContext, useState, useEffect } from 'react'
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/me')
        setUser(response.data.data)
        localStorage.setItem('user', JSON.stringify(response.data.data))
      } catch (error) {
        // Not logged in or token expired
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          localStorage.removeItem('user')
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true)
    try {
      // In this backend, role is not strictly needed for login, but we pass it anyway
      const response = await api.post('/auth/login', { email, password })
      const loggedInUser = response.data.data
      
      setUser(loggedInUser)
      localStorage.setItem('user', JSON.stringify(loggedInUser))
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, firstName: string, lastName: string, role: UserRole) => {
    setIsLoading(true)
    try {
      const response = await api.post('/auth/register', { email, password, firstName, lastName, role })
      const newUser = response.data.data
      
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
    } catch (error: any) {
      const message = error.response?.data?.message || 'Signup failed'
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.get('/auth/logout')
    } catch (e) {
      console.error('Logout error', e)
    }
    setUser(null)
    localStorage.removeItem('user')
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (user) {
      try {
        const response = await api.put('/users/profile', updates)
        const updatedUser = response.data.data
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
      } catch (error) {
        console.error('Failed to update profile:', error)
      }
    }
  }

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