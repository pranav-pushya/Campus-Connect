import bcrypt
from pydantic import BaseModel

# 1. Pydantic schema for user data
class User(BaseModel):
    id: int
    name: str
    email: str
    created_at: str

# 2. The Stub Guard 
def get_current_user() -> User:
    # TODO: Baad mein yahan real JWT verification aur SQLite query aayegi.
    # This is a dummy user.
    return User(
        id=1,
        name="Test User",
        email="test@campusconnect.com",
        created_at="01/01/2026"
    )

# 3. Password Hashing Utility
def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pwd_bytes, salt)
    return hashed_password.decode('utf-8')
