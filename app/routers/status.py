"""
Status update and statistics routes for CampusConnect.
Owned by: M4 (Aastha)

Endpoints to be implemented by M4:
- PATCH /api/issues/{id}/status
- GET   /api/stats
"""

from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["Status & Stats"])


@router.get("/status-health")
def status_health_check():
    """Temporary test route to confirm status router is connected."""
    return {"status": "status router ready"}
