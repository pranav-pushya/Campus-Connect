"""
Issues routes for CampusConnect.
Owned by: M1 (Pranav)

Endpoints to be implemented by M1:
- GET  /api/categories
- GET  /api/issues
- POST /api/issues
- GET  /api/issues/{id}
"""

from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["Issues"])


@router.get("/issues-health")
def issues_health_check():
    """Temporary test route to confirm issues router is connected."""
    return {"status": "issues router ready"}
