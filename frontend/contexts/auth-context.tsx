"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, type AuthState, getCurrentUser } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: Omit<User, "id" | "createdAt">) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const user = getCurrentUser()
    setAuthState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    })
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    const { login: authLogin } = await import("@/lib/auth")
    const user = await authLogin(email, password)

    if (user) {
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
      return true
    }

    setAuthState((prev) => ({ ...prev, isLoading: false }))
    return false
  }

  const register = async (userData: Omit<User, "id" | "createdAt">): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    const { register: authRegister } = await import("@/lib/auth")
    const user = await authRegister(userData)

    if (user) {
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
      return true
    }

    setAuthState((prev) => ({ ...prev, isLoading: false }))
    return false
  }

  const logout = () => {
    const { logout: authLogout } = require("@/lib/auth")
    authLogout()
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData }
      setAuthState((prev) => ({ ...prev, user: updatedUser }))
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
