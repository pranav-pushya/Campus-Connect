"""
Issues API endpoints for CampusConnect.
Owned by: M1 (Pranav)

Endpoints:
- GET  /api/categories
- GET  /api/issues
- POST /api/issues
- GET  /api/issues/{issue_id}
"""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, StringConstraints, field_validator

from app.auth import User, get_current_user
from app.database import get_db

router = APIRouter(prefix="/api", tags=["Issues"])

# Exact 5 allowed categories
CATEGORIES = ["Classroom", "Campus", "Lost & Found", "Digital IT Services", "General"]

# created_at is formatted as ISO 8601 (UTC with 'Z') so client-side JavaScript date parsing works without timezone drift
ISSUE_SELECT = """
    SELECT i.id, i.title, i.description, i.category, i.status, i.created_by,
           u.name AS created_by_name,
           strftime('%Y-%m-%dT%H:%M:%SZ', i.created_at) AS created_at
    FROM issues i JOIN users u ON u.id = i.created_by
"""


class IssueCreate(BaseModel):
    title: Annotated[str, StringConstraints(strip_whitespace=True, min_length=3, max_length=100)]
    description: Annotated[str, StringConstraints(strip_whitespace=True, min_length=5, max_length=1000)]
    category: str

    @field_validator("category")
    @classmethod
    def category_must_be_valid(cls, v: str) -> str:
        if v not in CATEGORIES:
            raise ValueError("Invalid category")
        return v


@router.get("/categories")
def list_categories():
    """Returns the list of allowed issue categories."""
    return CATEGORIES


@router.get("/issues")
def list_issues(user: User = Depends(get_current_user), db=Depends(get_db)):
    """Returns all issues ordered newest first."""
    rows = db.execute(ISSUE_SELECT + " ORDER BY i.id DESC").fetchall()
    return [dict(r) for r in rows]


@router.post("/issues", status_code=201)
def create_issue(data: IssueCreate, user: User = Depends(get_current_user), db=Depends(get_db)):
    """Creates a new campus issue for the authenticated student."""
    cur = db.execute(
        "INSERT INTO issues (title, description, category, created_by) VALUES (?, ?, ?, ?)",
        (data.title, data.description, data.category, user.id),
    )
    db.commit()
    row = db.execute(ISSUE_SELECT + " WHERE i.id = ?", (cur.lastrowid,)).fetchone()
    return dict(row)


@router.get("/issues/{issue_id}")
def get_issue(issue_id: int, user: User = Depends(get_current_user), db=Depends(get_db)):
    """Returns details for a specific issue ID or 404 if not found."""
    row = db.execute(ISSUE_SELECT + " WHERE i.id = ?", (issue_id,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Issue not found")
    return dict(row)
