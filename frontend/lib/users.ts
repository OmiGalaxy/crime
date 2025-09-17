// User management utilities for admin
import { type User } from "@/lib/auth"
import apiClient from "@/lib/api-client"

export interface UserStats {
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
  usersByRole: {
    user: number
    police: number
    admin: number
  }
}

// Get users from API
let cachedUsers: User[] = []

export const getUserStats = async (): Promise<UserStats> => {
  const users = await getAllUsers()
  const totalUsers = users.length
  const activeUsers = users.length // Assume all users are active for demo
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const newUsersThisMonth = users.filter((user) => {
    const userDate = new Date(user.createdAt)
    return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear
  }).length

  const usersByRole = {
    user: users.filter((u) => u.role === "user").length,
    police: users.filter((u) => u.role === "police").length,
    admin: users.filter((u) => u.role === "admin").length,
  }

  return {
    totalUsers,
    activeUsers,
    newUsersThisMonth,
    usersByRole,
  }
}

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const users = await apiClient.getUsers()
    cachedUsers = users.map((user: any) => ({
      id: user.id.toString(),
      email: user.email,
      name: user.full_name,
      role: user.role as "user" | "police" | "admin",
      phone: user.phone,
      address: user.address,
      createdAt: user.created_at
    }))
    return cachedUsers
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return cachedUsers
  }
}

export const createUser = async (userData: Omit<User, "id" | "createdAt">): Promise<User> => {
  try {
    await apiClient.createUser({
      email: userData.email,
      password: "password123",
      full_name: userData.name,
      phone: userData.phone || "",
      address: userData.address || "",
      role: userData.role
    })
    
    // Refresh cached users
    await getAllUsers()
    
    return {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Failed to create user:', error)
    throw error
  }
}

export const updateUser = async (id: string, userData: Partial<User>): Promise<boolean> => {
  try {
    // Note: Backend doesn't have update user endpoint yet
    // This is a placeholder for future implementation
    console.log('Update user not implemented in backend yet')
    return true
  } catch (error) {
    console.error('Failed to update user:', error)
    return false
  }
}

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    // Note: Backend doesn't have delete user endpoint yet
    // This is a placeholder for future implementation
    console.log('Delete user not implemented in backend yet')
    return true
  } catch (error) {
    console.error('Failed to delete user:', error)
    return false
  }
}
