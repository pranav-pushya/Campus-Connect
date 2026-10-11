import os
import secrets
from datetime import datetime, timedelta, timezone
from pathlib import Path

import bcrypt
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from app.database import get_db

ALGORITHM = "HS256"
TOKEN_HOURS = 24
bearer = HTTPBearer(auto_error=False)

class User(BaseModel):
    id: int
    name: str
    email: str
    created_at: str

def _load_secret_key() -> str:
    key = os.getenv("SECRET_KEY")
    if key:
        return key
    key_file = Path(__file__).resolve().parent.parent / ".secret_key"
    if key_file.exists():
        return key_file.read_text().strip()
    key = secrets.token_hex(32)
    key_file.write_text(key)
    return key

SECRET_KEY = _load_secret_key()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode(), hashed.encode())
    except ValueError:  # hash hi invalid ho toh 500 nahi, bas login fail
        return False

def create_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=TOKEN_HOURS)
    return jwt.encode({"sub": str(user_id), "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
    db=Depends(get_db),
) -> User:
    if creds is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(creds.credentials, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    row = db.execute(
        "SELECT id, name, email, strftime('%Y-%m-%dT%H:%M:%SZ', created_at) AS created_at FROM users WHERE id = ?",
        (int(payload["sub"]),),
    ).fetchone()
    if row is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**dict(row))
