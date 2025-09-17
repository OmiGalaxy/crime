// API client for backend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        let errorMessage = `HTTP ${response.status}`
        
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((err: any) => err.msg || err).join(', ')
          } else {
            errorMessage = errorData.detail
          }
        }
        
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<{
      access_token: string
      refresh_token: string
      token_type: string
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    this.setToken(response.access_token)
    return response
  }

  async register(userData: {
    email: string
    password: string
    full_name: string
    phone: string
    address: string
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getCurrentUser() {
    return this.request('/users/profile')
  }

  // Complaints endpoints
  async createComplaint(formData: FormData) {
    const url = `${this.baseURL}/complaints/register`
    
    const headers: HeadersInit = {}
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }
    // Don't set Content-Type for FormData - let browser handle it

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      let errorMessage = `HTTP ${response.status}`
      
      if (errorData.detail) {
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map((err: any) => err.msg || err).join(', ')
        } else {
          errorMessage = errorData.detail
        }
      }
      
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  async getComplaints() {
    return this.request('/complaints/')
  }

  async getMyComplaints() {
    return this.request('/complaints/my')
  }

  async getComplaint(id: string) {
    return this.request(`/complaints/${id}`)
  }

  async approveComplaint(id: string, crimeType: string) {
    return this.request(`/complaints/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ crime_type: crimeType }),
    })
  }

  async rejectComplaint(id: string) {
    return this.request(`/complaints/${id}/reject`, {
      method: 'POST',
    })
  }

  // Analytics endpoints
  async getAnalytics() {
    return this.request('/analytics/')
  }

  // Notifications endpoints
  async getNotifications() {
    return this.request('/notifications/')
  }

  async markNotificationRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'POST',
    })
  }

  // Categories endpoints
  async getComplaintCategories() {
    return this.request('/complaint-categories/')
  }

  // Users endpoints (admin only)
  async getUsers() {
    return this.request('/users/')
  }

  async createUser(userData: any) {
    const formData = new FormData()
    Object.entries(userData).forEach(([key, value]) => {
      formData.append(key, value as string)
    })
    
    return this.request('/users/create', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    })
  }

  // Audit logs (admin only)
  async getAuditLogs(limit = 100) {
    return this.request(`/audit-logs/?limit=${limit}`)
  }
}

export const apiClient = new ApiClient()
export default apiClient