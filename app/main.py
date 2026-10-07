"""
Main application entry point for CampusConnect.
Owned by: M1 (Pranav)

Responsibilities:
- Initializes the FastAPI app.
- Runs database table initialization on startup.
- Registers routers for authentication, issues, and status.
- Mounts static files (HTML/CSS/JS) so the frontend is served directly.
"""

from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.database import init_db
from app.routers import auth_routes, issues, status

# Directory path for static frontend files
BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs when the FastAPI server starts up
    print("Starting CampusConnect server...")
    init_db()
    yield
    # Runs when the server shuts down
    print("Stopping CampusConnect server...")


# Create FastAPI application
app = FastAPI(
    title="CampusConnect",
    description="Campus issue tracking application for students.",
    version="1.0.0",
    lifespan=lifespan,
)

# 1. Register API routers first so /api routes take priority
app.include_router(auth_routes.router)
app.include_router(issues.router)
app.include_router(status.router)

# 2. Mount static frontend directory at "/"
# Setting html=True automatically serves index.html for the root "/" URL
app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
