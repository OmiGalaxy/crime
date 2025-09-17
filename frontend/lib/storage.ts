// Comprehensive data storage system for CrimeWatch
import type { User } from "./auth"
import type { Complaint } from "./complaints"

// Storage keys
export const STORAGE_KEYS = {
  USERS: "crimewatch_users",
  COMPLAINTS: "crimewatch_complaints",
  ANALYTICS: "crimewatch_analytics",
  SETTINGS: "crimewatch_settings",
  NOTIFICATIONS: "crimewatch_notifications",
  AUDIT_LOG: "crimewatch_audit_log",
  CACHE: "crimewatch_cache",
} as const

// Data interfaces
export interface Analytics {
  id: string
  totalComplaints: number
  complaintsByStatus: Record<string, number>
  complaintsByCategory: Record<string, number>
  complaintsByPriority: Record<string, number>
  monthlyTrends: Array<{
    month: string
    count: number
    approved: number
    rejected: number
  }>
  userStats: {
    totalUsers: number
    activeUsers: number
    newUsersThisMonth: number
  }
  responseTimeStats: {
    average: number
    median: number
    fastest: number
    slowest: number
  }
  createdAt: string
  updatedAt: string
}

export interface SystemSettings {
  id: string
  maintenanceMode: boolean
  allowRegistration: boolean
  requireEmailVerification: boolean
  maxFileUploadSize: number
  supportedFileTypes: string[]
  autoAssignOfficers: boolean
  notificationSettings: {
    emailEnabled: boolean
    smsEnabled: boolean
    pushEnabled: boolean
  }
  securitySettings: {
    passwordMinLength: number
    requireTwoFactor: boolean
    sessionTimeout: number
  }
  updatedAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  category: "complaint" | "system" | "security" | "general"
  read: boolean
  actionUrl?: string
  metadata?: Record<string, any>
  createdAt: string
  expiresAt?: string
}

export interface AuditLogEntry {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: string
}

export interface CacheEntry<T = any> {
  key: string
  data: T
  expiresAt: number
  createdAt: number
}

// Storage utilities
class DataStorage {
  private isClient = typeof window !== "undefined"

  // Generic storage methods
  private getItem<T>(key: string): T | null {
    if (!this.isClient) return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error reading from storage (${key}):`, error)
      return null
    }
  }

  private setItem<T>(key: string, value: T): boolean {
    if (!this.isClient) return false
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing to storage (${key}):`, error)
      return false
    }
  }

  private removeItem(key: string): boolean {
    if (!this.isClient) return false
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing from storage (${key}):`, error)
      return false
    }
  }

  // User management
  getAllUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS) || []
  }

  saveUsers(users: User[]): boolean {
    return this.setItem(STORAGE_KEYS.USERS, users)
  }

  getUserById(id: string): User | null {
    const users = this.getAllUsers()
    return users.find((user) => user.id === id) || null
  }

  updateUser(id: string, updates: Partial<User>): boolean {
    const users = this.getAllUsers()
    const userIndex = users.findIndex((user) => user.id === id)

    if (userIndex === -1) return false

    users[userIndex] = { ...users[userIndex], ...updates }
    return this.saveUsers(users)
  }

  deleteUser(id: string): boolean {
    const users = this.getAllUsers()
    const filteredUsers = users.filter((user) => user.id !== id)
    return this.saveUsers(filteredUsers)
  }

  // Complaint management
  getAllComplaints(): Complaint[] {
    return this.getItem<Complaint[]>(STORAGE_KEYS.COMPLAINTS) || []
  }

  saveComplaints(complaints: Complaint[]): boolean {
    return this.setItem(STORAGE_KEYS.COMPLAINTS, complaints)
  }

  getComplaintById(id: string): Complaint | null {
    const complaints = this.getAllComplaints()
    return complaints.find((complaint) => complaint.id === id) || null
  }

  updateComplaint(id: string, updates: Partial<Complaint>): boolean {
    const complaints = this.getAllComplaints()
    const complaintIndex = complaints.findIndex((complaint) => complaint.id === id)

    if (complaintIndex === -1) return false

    complaints[complaintIndex] = {
      ...complaints[complaintIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return this.saveComplaints(complaints)
  }

  deleteComplaint(id: string): boolean {
    const complaints = this.getAllComplaints()
    const filteredComplaints = complaints.filter((complaint) => complaint.id !== id)
    return this.saveComplaints(filteredComplaints)
  }

  // Analytics
  getAnalytics(): Analytics | null {
    return this.getItem<Analytics>(STORAGE_KEYS.ANALYTICS)
  }

  updateAnalytics(): boolean {
    const complaints = this.getAllComplaints()
    const users = this.getAllUsers()

    const analytics: Analytics = {
      id: "main",
      totalComplaints: complaints.length,
      complaintsByStatus: this.groupBy(complaints, "status"),
      complaintsByCategory: this.groupBy(complaints, "category"),
      complaintsByPriority: this.groupBy(complaints, "priority"),
      monthlyTrends: this.calculateMonthlyTrends(complaints),
      userStats: {
        totalUsers: users.length,
        activeUsers: users.filter((u) => this.isActiveUser(u)).length,
        newUsersThisMonth: users.filter((u) => this.isNewThisMonth(u)).length,
      },
      responseTimeStats: this.calculateResponseTimes(complaints),
      createdAt: this.getAnalytics()?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return this.setItem(STORAGE_KEYS.ANALYTICS, analytics)
  }

  // System settings
  getSettings(): SystemSettings {
    const defaultSettings: SystemSettings = {
      id: "main",
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: false,
      maxFileUploadSize: 10 * 1024 * 1024, // 10MB
      supportedFileTypes: ["image/*", "video/*", ".pdf", ".doc", ".docx"],
      autoAssignOfficers: true,
      notificationSettings: {
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true,
      },
      securitySettings: {
        passwordMinLength: 8,
        requireTwoFactor: false,
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
      },
      updatedAt: new Date().toISOString(),
    }

    return this.getItem<SystemSettings>(STORAGE_KEYS.SETTINGS) || defaultSettings
  }

  updateSettings(updates: Partial<SystemSettings>): boolean {
    const currentSettings = this.getSettings()
    const newSettings = {
      ...currentSettings,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return this.setItem(STORAGE_KEYS.SETTINGS, newSettings)
  }

  // Notifications
  getAllNotifications(): Notification[] {
    return this.getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS) || []
  }

  getNotificationsByUser(userId: string): Notification[] {
    const notifications = this.getAllNotifications()
    return notifications.filter((n) => n.userId === userId || n.userId === "all")
  }

  addNotification(notification: Omit<Notification, "id" | "createdAt">): boolean {
    const notifications = this.getAllNotifications()
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }

    notifications.unshift(newNotification)

    // Keep only last 100 notifications per user
    const userNotifications = notifications.filter((n) => n.userId === notification.userId)
    if (userNotifications.length > 100) {
      const toRemove = userNotifications.slice(100)
      const filteredNotifications = notifications.filter((n) => !toRemove.some((r) => r.id === n.id))
      return this.setItem(STORAGE_KEYS.NOTIFICATIONS, filteredNotifications)
    }

    return this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications)
  }

  markNotificationAsRead(id: string): boolean {
    const notifications = this.getAllNotifications()
    const notificationIndex = notifications.findIndex((n) => n.id === id)

    if (notificationIndex === -1) return false

    notifications[notificationIndex].read = true
    return this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications)
  }

  deleteNotification(id: string): boolean {
    const notifications = this.getAllNotifications()
    const filteredNotifications = notifications.filter((n) => n.id !== id)
    return this.setItem(STORAGE_KEYS.NOTIFICATIONS, filteredNotifications)
  }

  // Audit logging
  addAuditLog(entry: Omit<AuditLogEntry, "id" | "timestamp">): boolean {
    const logs = this.getItem<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOG) || []
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    logs.unshift(newEntry)

    // Keep only last 1000 entries
    if (logs.length > 1000) {
      logs.splice(1000)
    }

    return this.setItem(STORAGE_KEYS.AUDIT_LOG, logs)
  }

  getAuditLogs(limit = 100): AuditLogEntry[] {
    const logs = this.getItem<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOG) || []
    return logs.slice(0, limit)
  }

  // Cache management
  setCache<T>(key: string, data: T, ttlMinutes = 60): boolean {
    const cache = this.getItem<Record<string, CacheEntry>>(STORAGE_KEYS.CACHE) || {}
    const now = Date.now()

    cache[key] = {
      key,
      data,
      expiresAt: now + ttlMinutes * 60 * 1000,
      createdAt: now,
    }

    return this.setItem(STORAGE_KEYS.CACHE, cache)
  }

  getCache<T>(key: string): T | null {
    const cache = this.getItem<Record<string, CacheEntry>>(STORAGE_KEYS.CACHE) || {}
    const entry = cache[key]

    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      delete cache[key]
      this.setItem(STORAGE_KEYS.CACHE, cache)
      return null
    }

    return entry.data as T
  }

  clearCache(): boolean {
    return this.setItem(STORAGE_KEYS.CACHE, {})
  }

  // Data export/import
  exportData(): string {
    const data = {
      users: this.getAllUsers(),
      complaints: this.getAllComplaints(),
      analytics: this.getAnalytics(),
      settings: this.getSettings(),
      notifications: this.getAllNotifications(),
      auditLogs: this.getAuditLogs(500),
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
    }

    return JSON.stringify(data, null, 2)
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)

      if (data.users) this.saveUsers(data.users)
      if (data.complaints) this.saveComplaints(data.complaints)
      if (data.analytics) this.setItem(STORAGE_KEYS.ANALYTICS, data.analytics)
      if (data.settings) this.setItem(STORAGE_KEYS.SETTINGS, data.settings)
      if (data.notifications) this.setItem(STORAGE_KEYS.NOTIFICATIONS, data.notifications)
      if (data.auditLogs) this.setItem(STORAGE_KEYS.AUDIT_LOG, data.auditLogs)

      return true
    } catch (error) {
      console.error("Error importing data:", error)
      return false
    }
  }

  // Clear all data
  clearAllData(): boolean {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        this.removeItem(key)
      })
      return true
    } catch (error) {
      console.error("Error clearing data:", error)
      return false
    }
  }

  // Utility methods
  private groupBy<T>(array: T[], key: keyof T): Record<string, number> {
    return array.reduce(
      (acc, item) => {
        const value = String(item[key])
        acc[value] = (acc[value] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }

  private calculateMonthlyTrends(complaints: Complaint[]) {
    const monthlyData: Record<string, { count: number; approved: number; rejected: number }> = {}

    complaints.forEach((complaint) => {
      const month = new Date(complaint.createdAt).toISOString().slice(0, 7) // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { count: 0, approved: 0, rejected: 0 }
      }

      monthlyData[month].count++
      if (complaint.status === "approved") monthlyData[month].approved++
      if (complaint.status === "rejected") monthlyData[month].rejected++
    })

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12) // Last 12 months
      .map(([month, data]) => ({ month, ...data }))
  }

  private calculateResponseTimes(complaints: Complaint[]) {
    const responseTimes = complaints
      .filter((c) => c.status === "approved" || c.status === "rejected")
      .map((c) => {
        const created = new Date(c.createdAt).getTime()
        const updated = new Date(c.updatedAt).getTime()
        return (updated - created) / (1000 * 60 * 60) // Hours
      })

    if (responseTimes.length === 0) {
      return { average: 0, median: 0, fastest: 0, slowest: 0 }
    }

    const sorted = responseTimes.sort((a, b) => a - b)
    const average = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    const median = sorted[Math.floor(sorted.length / 2)]

    return {
      average: Math.round(average * 100) / 100,
      median: Math.round(median * 100) / 100,
      fastest: Math.round(sorted[0] * 100) / 100,
      slowest: Math.round(sorted[sorted.length - 1] * 100) / 100,
    }
  }

  private isActiveUser(user: User): boolean {
    // Consider user active if they have any complaints in the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const complaints = this.getAllComplaints()
    return complaints.some((c) => c.userId === user.id && new Date(c.createdAt) > thirtyDaysAgo)
  }

  private isNewThisMonth(user: User): boolean {
    const thisMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const userMonth = new Date(user.createdAt).toISOString().slice(0, 7)
    return thisMonth === userMonth
  }
}

// Export singleton instance
export const dataStorage = new DataStorage()

// Convenience functions
export const initializeStorage = () => {
  // Initialize analytics if not exists
  if (!dataStorage.getAnalytics()) {
    dataStorage.updateAnalytics()
  }

  // Initialize settings if not exists
  dataStorage.getSettings()
}

export const logUserAction = (
  userId: string,
  userName: string,
  action: string,
  resource: string,
  resourceId?: string,
  details: Record<string, any> = {},
) => {
  dataStorage.addAuditLog({
    userId,
    userName,
    action,
    resource,
    resourceId,
    details,
  })
}

export const createNotification = (
  userId: string,
  title: string,
  message: string,
  type: Notification["type"] = "info",
  category: Notification["category"] = "general",
  actionUrl?: string,
) => {
  dataStorage.addNotification({
    userId,
    title,
    message,
    type,
    category,
    read: false,
    actionUrl,
  })
}

// Data validation
export const validateDataIntegrity = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  try {
    const users = dataStorage.getAllUsers()
    const complaints = dataStorage.getAllComplaints()

    // Check for orphaned complaints
    complaints.forEach((complaint) => {
      if (!users.find((user) => user.id === complaint.userId)) {
        errors.push(`Complaint ${complaint.id} references non-existent user ${complaint.userId}`)
      }
    })

    // Check for duplicate IDs
    const userIds = users.map((u) => u.id)
    const complaintIds = complaints.map((c) => c.id)

    if (new Set(userIds).size !== userIds.length) {
      errors.push("Duplicate user IDs found")
    }

    if (new Set(complaintIds).size !== complaintIds.length) {
      errors.push("Duplicate complaint IDs found")
    }
  } catch (error) {
    errors.push(`Data validation error: ${error}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
