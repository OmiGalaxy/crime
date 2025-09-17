from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str
    address: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    phone: str
    address: str
    role: str
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class ComplaintCreate(BaseModel):
    title: str
    description: str
    incident_date: datetime
    incident_location: str
    complaint_type: str
    priority: Optional[str] = "medium"
    witnesses: Optional[str] = None

class ComplaintResponse(BaseModel):
    id: int
    title: str
    description: str
    incident_date: datetime
    incident_location: str
    complaint_type: str
    status: str
    priority: str
    crime_type: Optional[str]
    witnesses: Optional[str]
    assigned_officer: Optional[str]
    review_notes: Optional[str]
    images: Optional[List[str]]
    user_id: int
    created_at: datetime
    updated_at: datetime
    user: UserResponse
    
    class Config:
        from_attributes = True

class ComplaintApprove(BaseModel):
    crime_type: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshToken(BaseModel):
    refresh_token: str

class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    type: str
    category: str
    read: bool
    action_url: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class AnalyticsResponse(BaseModel):
    totalComplaints: int
    complaintsByStatus: dict
    complaintsByCategory: dict
    complaintsByPriority: dict
    monthlyTrends: List[dict]
    userStats: dict
    responseTimeStats: dict