from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from datetime import datetime
import json
import os
import shutil
from typing import List, Optional

from database import get_db, User, Complaint, Analytics, Notification, AuditLog
from auth import (
    verify_password, get_password_hash, create_access_token, 
    create_refresh_token, get_current_user, require_role, verify_token
)
from schemas import (
    UserCreate, UserLogin, UserResponse, UserUpdate, ComplaintCreate, 
    ComplaintResponse, ComplaintApprove, TokenResponse, RefreshToken
)

app = FastAPI(title="Crime Report Management API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.post("/auth/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        password=hashed_password,
        full_name=user.full_name,
        phone=user.phone,
        address=user.address
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/auth/login", response_model=TokenResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": db_user.email})
    refresh_token = create_refresh_token(data={"sub": db_user.email})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@app.post("/auth/refresh", response_model=TokenResponse)
def refresh_token(token_data: RefreshToken, db: Session = Depends(get_db)):
    from jose import jwt, JWTError
    try:
        payload = jwt.decode(token_data.refresh_token, "your-secret-key-change-in-production", algorithms=["HS256"])
        email = payload.get("sub")
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        access_token = create_access_token(data={"sub": email})
        refresh_token = create_refresh_token(data={"sub": email})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

@app.post("/complaints/register")
async def register_complaint(
    title: str = Form(...),
    description: str = Form(...),
    incident_date: str = Form(...),
    incident_location: str = Form(...),
    complaint_type: str = Form(...),
    priority: str = Form("medium"),
    witnesses: str = Form(""),
    images: List[UploadFile] = File([]),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print(f"Received complaint data: title={title}, description={description}, incident_date={incident_date}, location={incident_location}, type={complaint_type}, priority={priority}")
    
    image_paths = []
    for image in images:
        if image.filename:
            file_path = f"uploads/{datetime.now().strftime('%Y%m%d_%H%M%S')}_{image.filename}"
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            image_paths.append(file_path)
    
    # Parse incident date
    try:
        parsed_date = datetime.fromisoformat(incident_date.replace('Z', '+00:00'))
        print(f"Parsed date: {parsed_date}")
    except Exception as e:
        print(f"Date parsing error: {e}, using current time")
        parsed_date = datetime.now()
    
    complaint = Complaint(
        title=title,
        description=description,
        incident_date=parsed_date,
        incident_location=incident_location,
        complaint_type=complaint_type,
        priority=priority,
        witnesses=witnesses if witnesses else None,
        images=json.dumps(image_paths) if image_paths else None,
        user_id=current_user.id
    )
    
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    
    # Create notification
    notification = Notification(
        user_id=current_user.id,
        title="Complaint Submitted",
        message=f"Your complaint '{title}' has been submitted successfully.",
        type="success",
        category="complaint",
        action_url="/track-complaints"
    )
    db.add(notification)
    
    # Create audit log
    audit_log = AuditLog(
        user_id=current_user.id,
        user_name=current_user.full_name,
        action="CREATE_COMPLAINT",
        resource="complaint",
        resource_id=str(complaint.id),
        details=json.dumps({"category": complaint_type, "priority": priority})
    )
    db.add(audit_log)
    
    db.commit()
    
    # Update analytics
    update_analytics(db)
    
    return {"message": "Complaint registered successfully", "complaint_id": complaint.id}

@app.get("/complaints/", response_model=List[ComplaintResponse])
def get_complaints(
    status: Optional[str] = None,
    current_user: User = Depends(require_role(["police", "admin"])),
    db: Session = Depends(get_db)
):
    query = db.query(Complaint)
    if status:
        query = query.filter(Complaint.status == status)
    
    complaints = query.all()
    for complaint in complaints:
        if complaint.images:
            complaint.images = json.loads(complaint.images)
    
    return complaints

@app.get("/complaints/my", response_model=List[ComplaintResponse])
def get_my_complaints(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    complaints = db.query(Complaint).filter(Complaint.user_id == current_user.id).all()
    for complaint in complaints:
        if complaint.images:
            complaint.images = json.loads(complaint.images)
    
    return complaints

@app.get("/complaints/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(
    complaint_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    if current_user.role == "user" and complaint.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if complaint.images:
        complaint.images = json.loads(complaint.images)
    
    return complaint

@app.post("/complaints/{complaint_id}/approve")
def approve_complaint(
    complaint_id: int,
    approval_data: ComplaintApprove,
    current_user: User = Depends(require_role(["police", "admin"])),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    complaint.status = "approved"
    complaint.crime_type = approval_data.crime_type
    complaint.approved_by = current_user.id
    complaint.updated_at = datetime.utcnow()
    
    db.commit()
    return {"message": "Complaint approved successfully"}

@app.post("/complaints/{complaint_id}/reject")
def reject_complaint(
    complaint_id: int,
    current_user: User = Depends(require_role(["police", "admin"])),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    complaint.status = "rejected"
    complaint.approved_by = current_user.id
    complaint.updated_at = datetime.utcnow()
    
    db.commit()
    return {"message": "Complaint rejected successfully"}

@app.get("/users/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@app.put("/users/profile", response_model=UserResponse)
def update_profile(
    profile_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_data.full_name:
        current_user.full_name = profile_data.full_name
    if profile_data.phone:
        current_user.phone = profile_data.phone
    if profile_data.address:
        current_user.address = profile_data.address
    
    db.commit()
    db.refresh(current_user)
    return current_user

@app.get("/users/", response_model=List[UserResponse])
def get_users(
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    return db.query(User).all()

@app.post("/users/create")
def create_user(
    user_data: UserCreate,
    role: str = Form(...),
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        password=hashed_password,
        full_name=user_data.full_name,
        phone=user_data.phone,
        address=user_data.address,
        role=role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {"message": f"{role.title()} created successfully", "user_id": db_user.id}

# Analytics endpoints
@app.get("/analytics/")
def get_analytics(
    current_user: User = Depends(require_role(["police", "admin"])),
    db: Session = Depends(get_db)
):
    analytics = db.query(Analytics).first()
    if not analytics:
        return {"message": "No analytics data available"}
    
    return {
        "totalComplaints": analytics.total_complaints,
        "complaintsByStatus": json.loads(analytics.complaints_by_status or "{}"),
        "complaintsByCategory": json.loads(analytics.complaints_by_category or "{}"),
        "complaintsByPriority": json.loads(analytics.complaints_by_priority or "{}"),
        "monthlyTrends": json.loads(analytics.monthly_trends or "[]"),
        "userStats": json.loads(analytics.user_stats or "{}"),
        "responseTimeStats": json.loads(analytics.response_time_stats or "{}")
    }

# Notifications endpoints
@app.get("/notifications/")
def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).limit(50).all()
    
    return notifications

@app.post("/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.read = True
    db.commit()
    
    return {"message": "Notification marked as read"}

# Audit logs endpoint
@app.get("/audit-logs/")
def get_audit_logs(
    limit: int = 100,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return logs

# Categories and types endpoints
@app.get("/complaint-categories/")
def get_complaint_categories():
    return {
        "categories": [
            "Theft/Burglary", "Assault/Violence", "Vandalism/Property Damage",
            "Fraud/Scam", "Drug-related", "Traffic Violation", "Cybercrime",
            "Domestic Violence", "Public Disturbance", "Other"
        ],
        "crimeTypes": {
            "Theft/Burglary": ["Petty Theft", "Grand Theft", "Burglary", "Robbery", "Shoplifting"],
            "Assault/Violence": ["Simple Assault", "Aggravated Assault", "Battery", "Domestic Violence"],
            "Vandalism/Property Damage": ["Graffiti", "Property Destruction", "Trespassing"],
            "Fraud/Scam": ["Identity Theft", "Credit Card Fraud", "Online Scam", "Check Fraud"],
            "Drug-related": ["Possession", "Distribution", "Manufacturing", "Public Intoxication"],
            "Traffic Violation": ["Reckless Driving", "DUI", "Hit and Run", "Speeding"],
            "Cybercrime": ["Hacking", "Online Harassment", "Data Breach", "Phishing"],
            "Domestic Violence": ["Physical Abuse", "Emotional Abuse", "Stalking", "Harassment"],
            "Public Disturbance": ["Noise Complaint", "Public Intoxication", "Disorderly Conduct"],
            "Other": ["Other Crime"]
        }
    }

# Helper function to update analytics
def update_analytics(db: Session):
    complaints = db.query(Complaint).all()
    users = db.query(User).all()
    
    # Calculate statistics
    total_complaints = len(complaints)
    
    complaints_by_status = {}
    complaints_by_category = {}
    complaints_by_priority = {}
    
    for complaint in complaints:
        # Status
        status = complaint.status
        complaints_by_status[status] = complaints_by_status.get(status, 0) + 1
        
        # Category
        category = complaint.complaint_type
        complaints_by_category[category] = complaints_by_category.get(category, 0) + 1
        
        # Priority
        priority = complaint.priority
        complaints_by_priority[priority] = complaints_by_priority.get(priority, 0) + 1
    
    # Update or create analytics record
    analytics = db.query(Analytics).first()
    if not analytics:
        analytics = Analytics()
        db.add(analytics)
    
    analytics.total_complaints = total_complaints
    analytics.complaints_by_status = json.dumps(complaints_by_status)
    analytics.complaints_by_category = json.dumps(complaints_by_category)
    analytics.complaints_by_priority = json.dumps(complaints_by_priority)
    analytics.user_stats = json.dumps({
        "totalUsers": len(users),
        "activeUsers": len([u for u in users if u.is_active]),
        "newUsersThisMonth": len(users)  # Simplified for demo
    })
    analytics.updated_at = datetime.utcnow()
    
    db.commit()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)