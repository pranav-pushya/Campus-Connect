from pydantic import BaseModel

# 1. Pydantic schema for user data
class User(BaseModel):
    id: int
    name: str
    email: str

# 2. The Stub Guard 
def get_current_user() -> User:
    # TODO: Baad mein yahan real JWT verification aur SQLite query aayegi.
    # This is a dummy user.
    return User(
        id=1,
        name="Test User",
        email="test@campusconnect.com"
    )
