"""
Authentication routes for CampusConnect.
Owned by: M2 (Gavesh)

Endpoints to be implemented by M2:
- POST /api/register
- POST /api/login
- GET  /api/me
"""

from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["Authentication"])


@router.get("/auth-health")
def auth_health_check():
    """Temporary test route to confirm auth router is connected."""
    return {"status": "auth router ready"}
