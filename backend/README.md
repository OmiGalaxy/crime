# CrimeR Backend

FastAPI backend for the Crime Report Management System.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Initialize database:
```bash
python init_db.py
```

3. Run the server:
```bash
uvicorn main:app --reload
```

## Default Users

- **Admin**: admin@crime.gov / admin123
- **User**: user@example.com / user123  
- **Police**: police@crime.gov / police123

## API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.

## Key Features

- JWT Authentication with refresh tokens
- Role-based access control (user, police, admin)
- File upload for complaint evidence
- SQLite database with SQLAlchemy ORM
- CORS enabled for frontend integration