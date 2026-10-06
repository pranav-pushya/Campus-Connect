"""
Authentication module for CampusConnect.
Owned by: M2 (Authentication)

NOTE: This is currently a Phase 0 STUB function.
It returns a fake authenticated user so the team (M1, M3, M4) can build
and test protected routes without waiting for real JWT token verification.

M2 will replace the body of get_current_user() with real JWT validation later.
"""


def get_current_user():
    """
    Dependency stub that simulates a logged-in user.
    Returns a dictionary matching the users table format.
    """
    return {
        "id": 1,
        "name": "Demo Student",
        "email": "demo@campus.edu",
        "created_at": "2026-01-01 00:00:00"
    }
