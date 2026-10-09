from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from enum import Enum
import sqlite3

from app.database import get_db
from app.auth import get_current_user

router = APIRouter(prefix="/api", tags=["Status & Stats"])


class IssueStatus(str, Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"


class StatusUpdate(BaseModel):
    status: IssueStatus


@router.patch("/issues/{issue_id}/status")
def update_issue_status(
    issue_id: int,
    status_data: StatusUpdate,
    db: sqlite3.Connection = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    cursor = db.cursor()

    cursor.execute(
        "SELECT id FROM issues WHERE id = ?",
        (issue_id,)
    )

    issue = cursor.fetchone()

    if issue is None:
        raise HTTPException(
            status_code=404,
            detail="Issue not found"
        )

    cursor.execute(
        "UPDATE issues SET status = ? WHERE id = ?",
        (status_data.status.value, issue_id)
    )

    db.commit()

    return {
        "id": issue_id,
        "status": status_data.status.value
    }

@router.get("/stats")
def get_stats(
    db: sqlite3.Connection = Depends(get_db),
    user: dict = Depends(get_current_user)
):

    cursor = db.cursor()
    cursor.execute("""
        SELECT status, COUNT(*) AS count
        FROM issues
        GROUP BY status
    """)

    rows = cursor.fetchall()

    stats = {
        "open": 0,
        "in_progress": 0,
        "resolved": 0
    }

    for row in rows:
        if row["status"] == "Open":
            stats["open"] = row["count"]
        elif row["status"] == "In Progress":
            stats["in_progress"] = row["count"]
        elif row["status"] == "Resolved":
            stats["resolved"] = row["count"]

    return stats