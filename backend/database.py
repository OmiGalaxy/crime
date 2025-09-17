from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Boolean, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import json

SQLALCHEMY_DATABASE_URL = "sqlite:///./crime_reports.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    full_name = Column(String)
    phone = Column(String)
    address = Column(Text)
    role = Column(String, default="user")  # user, police, admin
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    complaints = relationship("Complaint", back_populates="user", foreign_keys="Complaint.user_id")

class Complaint(Base):
    __tablename__ = "complaints"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    incident_date = Column(DateTime)
    incident_location = Column(String)
    complaint_type = Column(String)  # category
    status = Column(String, default="pending")  # pending, approved, rejected, under_review
    crime_type = Column(String, nullable=True)
    priority = Column(String, default="medium")  # low, medium, high, urgent
    images = Column(Text, nullable=True)  # JSON string of image paths
    witnesses = Column(Text, nullable=True)
    assigned_officer = Column(String, nullable=True)
    review_notes = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="complaints", foreign_keys=[user_id])
    approver = relationship("User", foreign_keys=[approved_by], overlaps="user")

class Analytics(Base):
    __tablename__ = "analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    total_complaints = Column(Integer, default=0)
    complaints_by_status = Column(Text)  # JSON
    complaints_by_category = Column(Text)  # JSON
    complaints_by_priority = Column(Text)  # JSON
    monthly_trends = Column(Text)  # JSON
    user_stats = Column(Text)  # JSON
    response_time_stats = Column(Text)  # JSON
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    message = Column(Text)
    type = Column(String)  # info, success, warning, error
    category = Column(String)  # complaint, system, security, general
    read = Column(Boolean, default=False)
    action_url = Column(String, nullable=True)
    meta_data = Column(Text, nullable=True)  # JSON
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    
    user = relationship("User", foreign_keys=[user_id])

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    user_name = Column(String)
    action = Column(String)
    resource = Column(String)
    resource_id = Column(String, nullable=True)
    details = Column(Text)  # JSON
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", foreign_keys=[user_id])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create all tables
Base.metadata.create_all(bind=engine)