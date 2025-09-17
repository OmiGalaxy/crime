// Complaint types and utilities
export interface Complaint {
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhone?: string
  title: string
  description: string
  category: string
  crimeType?: string
  location: string
  dateOfIncident: string
  timeOfIncident: string
  witnesses?: string
  evidenceFiles: (string | File)[]
  status: "pending" | "approved" | "rejected" | "under_review"
  priority: "low" | "medium" | "high" | "urgent"
  assignedOfficer?: string
  reviewNotes?: string
  createdAt: string
  updatedAt: string
}

export const crimeCategories = [
  "Theft/Burglary",
  "Assault/Violence",
  "Vandalism/Property Damage",
  "Fraud/Scam",
  "Drug-related",
  "Traffic Violation",
  "Cybercrime",
  "Domestic Violence",
  "Public Disturbance",
  "Other",
]

export const crimeTypes = {
  "Theft/Burglary": ["Petty Theft", "Grand Theft", "Burglary", "Robbery", "Shoplifting"],
  "Assault/Violence": ["Simple Assault", "Aggravated Assault", "Battery", "Domestic Violence"],
  "Vandalism/Property Damage": ["Graffiti", "Property Destruction", "Trespassing"],
  "Fraud/Scam": ["Identity Theft", "Credit Card Fraud", "Online Scam", "Check Fraud"],
  "Drug-related": ["Possession", "Distribution", "Manufacturing", "Public Intoxication"],
  "Traffic Violation": ["Reckless Driving", "DUI", "Hit and Run", "Speeding"],
  Cybercrime: ["Hacking", "Online Harassment", "Data Breach", "Phishing"],
  "Domestic Violence": ["Physical Abuse", "Emotional Abuse", "Stalking", "Harassment"],
  "Public Disturbance": ["Noise Complaint", "Public Intoxication", "Disorderly Conduct"],
  Other: ["Other Crime"],
}

// Real API complaints functions
import apiClient from "./api-client"

export const createComplaint = async (
  complaintData: Omit<Complaint, "id" | "createdAt" | "updatedAt">,
): Promise<Complaint> => {
  const formData = new FormData()
  
  // Combine date and time into ISO format
  const incidentDateTime = `${complaintData.dateOfIncident}T${complaintData.timeOfIncident}`
  
  formData.append('title', complaintData.title)
  formData.append('description', complaintData.description)
  formData.append('incident_date', incidentDateTime)
  formData.append('incident_location', complaintData.location)
  formData.append('complaint_type', complaintData.category)
  formData.append('priority', complaintData.priority)
  formData.append('witnesses', complaintData.witnesses || '')
  
  // Add evidence files - only actual File objects
  if (Array.isArray(complaintData.evidenceFiles)) {
    complaintData.evidenceFiles.forEach((file) => {
      if (file instanceof File) {
        formData.append('images', file)
      }
    })
  }
  
  const response = await apiClient.createComplaint(formData)
  
  return {
    ...complaintData,
    id: response.complaint_id.toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export const getComplaintsByUser = async (userId: string): Promise<Complaint[]> => {
  const complaints = await apiClient.getMyComplaints()
  return complaints.map(transformBackendComplaint)
}

export const getAllComplaints = async (): Promise<Complaint[]> => {
  const complaints = await apiClient.getComplaints()
  return complaints.map(transformBackendComplaint)
}

export const getComplaintById = async (id: string): Promise<Complaint | undefined> => {
  try {
    const complaint = await apiClient.getComplaint(id)
    return transformBackendComplaint(complaint)
  } catch {
    return undefined
  }
}

export const updateComplaintStatus = async (
  id: string,
  status: Complaint["status"],
  reviewNotes?: string,
  crimeType?: string,
): Promise<boolean> => {
  try {
    if (status === "approved" && crimeType) {
      await apiClient.approveComplaint(id, crimeType)
    } else if (status === "rejected") {
      await apiClient.rejectComplaint(id)
    }
    return true
  } catch {
    return false
  }
}

// Helper function to transform backend complaint to frontend format
function transformBackendComplaint(backendComplaint: any): Complaint {
  return {
    id: backendComplaint.id.toString(),
    userId: backendComplaint.user_id.toString(),
    userName: backendComplaint.user.full_name,
    userEmail: backendComplaint.user.email,
    userPhone: backendComplaint.user.phone,
    title: backendComplaint.title,
    description: backendComplaint.description,
    category: backendComplaint.complaint_type,
    crimeType: backendComplaint.crime_type,
    location: backendComplaint.incident_location,
    dateOfIncident: backendComplaint.incident_date.split('T')[0],
    timeOfIncident: backendComplaint.incident_date.split('T')[1]?.split('.')[0] || '00:00:00',
    witnesses: backendComplaint.witnesses,
    evidenceFiles: (() => {
      try {
        return backendComplaint.images ? JSON.parse(backendComplaint.images) : []
      } catch {
        return []
      }
    })(),
    status: backendComplaint.status,
    priority: backendComplaint.priority,
    assignedOfficer: backendComplaint.assigned_officer,
    reviewNotes: backendComplaint.review_notes,
    createdAt: backendComplaint.created_at,
    updatedAt: backendComplaint.updated_at,
  }
}
