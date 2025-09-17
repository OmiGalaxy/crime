from database import SessionLocal, User, Complaint, Analytics, Notification, AuditLog
from auth import get_password_hash
from datetime import datetime, timedelta
import json
import random

def create_initial_data():
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(User).count() > 0:
        print("Initial data already exists!")
        db.close()
        return
    
    # Create users
    users_data = [
        {
            "email": "admin@crimewatch.com",
            "password": get_password_hash("password123"),
            "full_name": "System Administrator",
            "phone": "+1-555-0100",
            "address": "123 Admin Street, City, State",
            "role": "admin"
        },
        {
            "email": "officer@police.gov",
            "password": get_password_hash("password123"),
            "full_name": "Officer John Smith",
            "phone": "+1-555-0200",
            "address": "456 Police Station Rd, City, State",
            "role": "police"
        },
        {
            "email": "officer2@police.gov",
            "password": get_password_hash("password123"),
            "full_name": "Officer Sarah Johnson",
            "phone": "+1-555-0201",
            "address": "456 Police Station Rd, City, State",
            "role": "police"
        },
        {
            "email": "citizen@email.com",
            "password": get_password_hash("password123"),
            "full_name": "Jane Doe",
            "phone": "+1-555-0300",
            "address": "789 Citizen Ave, City, State",
            "role": "user"
        },
        {
            "email": "citizen2@email.com",
            "password": get_password_hash("password123"),
            "full_name": "Mike Wilson",
            "phone": "+1-555-0301",
            "address": "321 Oak Street, City, State",
            "role": "user"
        },
        {
            "email": "citizen3@email.com",
            "password": get_password_hash("password123"),
            "full_name": "Emily Davis",
            "phone": "+1-555-0302",
            "address": "654 Pine Avenue, City, State",
            "role": "user"
        }
    ]
    
    created_users = []
    for user_data in users_data:
        user = User(**user_data)
        db.add(user)
        db.flush()  # Get the ID
        created_users.append(user)
    
    # Create sample complaints
    complaint_categories = [
        "Theft/Burglary", "Assault/Violence", "Vandalism/Property Damage", 
        "Fraud/Scam", "Drug-related", "Traffic Violation", "Cybercrime", 
        "Domestic Violence", "Public Disturbance", "Other"
    ]
    
    crime_types = {
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
    
    priorities = ["low", "medium", "high", "urgent"]
    statuses = ["pending", "approved", "rejected", "under_review"]
    
    sample_complaints = [
        {
            "title": "Bicycle Theft from Downtown Area",
            "description": "My bicycle was stolen from the bike rack outside the downtown library. It was a red mountain bike with distinctive white stripes. I had it locked with a chain lock, but the lock was cut. There were no witnesses that I'm aware of, but there might be security cameras in the area.",
            "complaint_type": "Theft/Burglary",
            "incident_location": "Downtown Library, 123 Main St",
            "priority": "medium",
            "status": "approved",
            "crime_type": "Petty Theft",
            "witnesses": "No witnesses observed",
            "images": json.dumps(["/bicycle-theft-evidence.jpg"]),
            "user_id": 4  # Jane Doe
        },
        {
            "title": "Graffiti Vandalism on Building Wall",
            "description": "Large graffiti tags appeared overnight on the side wall of our office building. The graffiti covers approximately 20 square feet and appears to be spray painted. This is the third incident this month in our area. We have security footage that might have captured the perpetrators.",
            "complaint_type": "Vandalism/Property Damage",
            "incident_location": "Office Building, 456 Business Ave",
            "priority": "low",
            "status": "pending",
            "witnesses": "Security cameras may have footage",
            "images": json.dumps(["/graffiti-vandalism-evidence.jpg"]),
            "user_id": 5  # Mike Wilson
        },
        {
            "title": "Suspicious Online Activity - Potential Fraud",
            "description": "I received multiple suspicious emails claiming to be from my bank, asking for personal information. The emails look legitimate but contain subtle differences from official bank communications. I did not provide any information, but I'm concerned others might fall victim to this scam.",
            "complaint_type": "Cybercrime",
            "incident_location": "Online/Email",
            "priority": "high",
            "status": "under_review",
            "witnesses": "Email evidence available",
            "user_id": 6  # Emily Davis
        }
    ]
    
    created_complaints = []
    for i, complaint_data in enumerate(sample_complaints):
        # Set incident date to random time in the last 30 days
        days_ago = random.randint(1, 30)
        incident_date = datetime.now() - timedelta(days=days_ago)
        
        complaint = Complaint(
            **complaint_data,
            incident_date=incident_date,
            created_at=incident_date,
            updated_at=incident_date
        )
        db.add(complaint)
        db.flush()
        created_complaints.append(complaint)
    
    # Create sample notifications
    notifications_data = [
        {
            "user_id": 4,
            "title": "Complaint Status Updated",
            "message": "Your complaint 'Bicycle Theft from Downtown Area' has been approved and assigned to Officer John Smith.",
            "type": "success",
            "category": "complaint",
            "action_url": "/track-complaints"
        },
        {
            "user_id": 5,
            "title": "Complaint Under Review",
            "message": "Your complaint 'Graffiti Vandalism on Building Wall' is currently under review by our team.",
            "type": "info",
            "category": "complaint",
            "action_url": "/track-complaints"
        },
        {
            "user_id": 6,
            "title": "Welcome to CrimeWatch",
            "message": "Your account has been created successfully. You can now file crime reports and track their status.",
            "type": "success",
            "category": "system"
        }
    ]
    
    for notif_data in notifications_data:
        notification = Notification(**notif_data)
        db.add(notification)
    
    # Create sample audit logs
    audit_logs_data = [
        {
            "user_id": 1,
            "user_name": "System Administrator",
            "action": "LOGIN",
            "resource": "auth",
            "details": json.dumps({"email": "admin@crimewatch.com", "timestamp": datetime.now().isoformat()})
        },
        {
            "user_id": 4,
            "user_name": "Jane Doe",
            "action": "CREATE_COMPLAINT",
            "resource": "complaint",
            "resource_id": "1",
            "details": json.dumps({"category": "Theft/Burglary", "priority": "medium"})
        },
        {
            "user_id": 2,
            "user_name": "Officer John Smith",
            "action": "UPDATE_COMPLAINT_STATUS",
            "resource": "complaint",
            "resource_id": "1",
            "details": json.dumps({"status": "approved", "crime_type": "Petty Theft"})
        }
    ]
    
    for log_data in audit_logs_data:
        audit_log = AuditLog(**log_data)
        db.add(audit_log)
    
    # Create analytics data
    analytics_data = {
        "total_complaints": len(created_complaints),
        "complaints_by_status": json.dumps({
            "pending": 1,
            "approved": 1,
            "under_review": 1,
            "rejected": 0
        }),
        "complaints_by_category": json.dumps({
            "Theft/Burglary": 1,
            "Vandalism/Property Damage": 1,
            "Cybercrime": 1
        }),
        "complaints_by_priority": json.dumps({
            "low": 1,
            "medium": 1,
            "high": 1,
            "urgent": 0
        }),
        "monthly_trends": json.dumps([
            {"month": "2024-12", "count": 3, "approved": 1, "rejected": 0}
        ]),
        "user_stats": json.dumps({
            "totalUsers": len(created_users),
            "activeUsers": 3,
            "newUsersThisMonth": 6
        }),
        "response_time_stats": json.dumps({
            "average": 24.5,
            "median": 24.0,
            "fastest": 12.0,
            "slowest": 48.0
        })
    }
    
    analytics = Analytics(**analytics_data)
    db.add(analytics)
    
    # Commit all changes
    db.commit()
    
    print("Initial data created successfully!")
    print("Users created:")
    for user in created_users:
        print(f"  - {user.full_name} ({user.email}) - Role: {user.role}")
    
    print(f"\nComplaints created: {len(created_complaints)}")
    print(f"Notifications created: {len(notifications_data)}")
    print(f"Audit logs created: {len(audit_logs_data)}")
    print("\nLogin credentials: password123 for all users")
    
    db.close()

if __name__ == "__main__":
    create_initial_data()