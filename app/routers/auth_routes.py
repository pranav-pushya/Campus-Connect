"""
Authentication routes for CampusConnect.
Owned by: M2 (Gavesh)

Endpoints to be implemented by M2:
- POST /api/register
- POST /api/login
- GET  /api/me
"""

import sqlite3
from fastapi import APIRouter, status, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from app.database import get_db
from app.auth import get_password_hash

router = APIRouter(prefix="/api", tags=["Authentication"])

@router.get("/auth-health")
def auth_health_check():
    """Temporary test route to confirm auth router is connected."""
    return {"status": "auth router ready"}


# --- 1. PYDANTIC MODELS (Data Checkers) ---

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# --- 2. API ENDPOINTS ---
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user_data: RegisterRequest, db: sqlite3.Connection = Depends(get_db)):
    hashed_pw = get_password_hash(user_data.password)
    
    cursor = db.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            (user_data.name, user_data.email, hashed_pw)
        )
        db.commit()
        new_user_id = cursor.lastrowid 
        
    except sqlite3.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already registered"
        )
    
    return {
        "id": new_user_id,
        "name": user_data.name,
        "email": user_data.email
    }

@router.post("/login", status_code=status.HTTP_200_OK)
def login_user(user_data: LoginRequest):
    # TODO: Aage yahan DB verification aur JWT banana aayega
    return {
        "access_token": "dummy_jwt_token_123"
    }

@router.get("/me", status_code=status.HTTP_200_OK)
def get_profile():
    # TODO: Yahan par Depends(get_current_user) wala guard lagega
    return {
        "id": 1,
        "name": "Test User",
        "email": "test@campusconnect.com",
        "created_at": "2026-10-08 10:00:00"
    }
