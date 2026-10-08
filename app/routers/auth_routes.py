""import sqlite3

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field

from app.auth import User, create_token, get_current_user, hash_password, verify_password
from app.database import get_db

router = APIRouter(prefix="/api", tags=["Authentication"])

class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)  # bcrypt 72 bytes se zyada nahi leta

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(max_length=72)

@router.post("/register", status_code=201)
def register(data: RegisterRequest, db=Depends(get_db)):
    email = data.email.lower()
    try:
        cur = db.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            (data.name.strip(), email, hash_password(data.password)),
        )
        db.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered")
    return {"id": cur.lastrowid, "name": data.name.strip(), "email": email}

@router.post("/login")
def login(data: LoginRequest, db=Depends(get_db)):
    row = db.execute(
        "SELECT id, password_hash FROM users WHERE email = ?", (data.email.lower(),)
    ).fetchone()
    if row is None or not verify_password(data.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"access_token": create_token(row["id"]), "token_type": "bearer"}

@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return user
