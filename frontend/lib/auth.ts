// Authentication utilities and types
export interface User {
  id: string
  email: string
  name: string
  role: "user" | "police" | "admin"
  phone?: string
  address?: string
  profileImage?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Real API authentication functions
import apiClient from "./api-client"

const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@crimewatch.com",
    name: "System Administrator",
    role: "admin",
    phone: "+1-555-0100",
    address: "123 Admin Street, City, State",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "officer@police.gov",
    name: "Officer John Smith",
    role: "police",
    phone: "+1-555-0200",
    address: "456 Police Station Rd, City, State",
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    email: "citizen@email.com",
    name: "Jane Doe",
    role: "user",
    phone: "+1-555-0300",
    address: "789 Citizen Ave, City, State",
    createdAt: "2024-01-03T00:00:00Z",
  },
]

export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    const response = await apiClient.login(email, password)
    const userProfile = await apiClient.getCurrentUser()
    
    // Transform backend user to frontend user format
    const user: User = {
      id: userProfile.id.toString(),
      email: userProfile.email,
      name: userProfile.full_name,
      role: userProfile.role as "user" | "police" | "admin",
      phone: userProfile.phone,
      address: userProfile.address,
      createdAt: userProfile.created_at
    }
    
    localStorage.setItem("user", JSON.stringify(user))
    return user
  } catch (error) {
    console.error('Login failed:', error)
    return null
  }
}

export const register = async (userData: Omit<User, "id" | "createdAt">): Promise<User | null> => {
  try {
    await apiClient.register({
      email: userData.email,
      password: "password123", // This should come from the form
      full_name: userData.name,
      phone: userData.phone || "",
      address: userData.address || ""
    })
    
    // Auto-login after registration
    return await login(userData.email, "password123")
  } catch (error) {
    console.error('Registration failed:', error)
    return null
  }
}

export const logout = () => {
  apiClient.clearToken()
  localStorage.removeItem("user")
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }
  return null
}

// Initialize users from backend
export const initializeUsers = async () => {
  // Users are now managed by the backend
  return true
}
