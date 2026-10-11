# CampusConnect — Comprehensive Project Documentation & Viva Preparation Guide

> **Project Name:** CampusConnect  
> **Course / Hackathon:** Code2Chill — Weekly Project 01  
> **Tech Stack:** Python 3 (FastAPI), SQLite 3, Pydantic v2, PyJWT, Bcrypt, Vanilla HTML5, CSS3, JavaScript (ES6+)  
> **Author & Lead:** Pranav Pushya (Team Lead, Backend Core, Issues API)  
> **Repository:** `campusconnect`

---

## Table of Contents
1. [Project Overview & System Architecture](#1-project-overview--system-architecture)
2. [Project File Structure](#2-project-file-structure)
3. [All Commands Reference (Terminal, Setup & Execution)](#3-all-commands-reference-terminal-setup--execution)
4. [Complete Git Command Reference & Team Workflow](#4-complete-git-command-reference--team-workflow)
5. [Complete Import Reference (Every Library, Module & Purpose)](#5-complete-import-reference-every-library-module--purpose)
6. [In-Depth Codebase Walkthrough (File-by-File & Line-by-Line Logic)](#6-in-depth-codebase-walkthrough-file-by-file--line-by-line-logic)
   - [app/main.py](#appmainpy)
   - [app/database.py](#appdatabasepy)
   - [app/auth.py](#appauthpy)
   - [app/routers/auth_routes.py](#approutersauth_routespy)
   - [app/routers/issues.py](#approutersissuespy)
   - [app/routers/status.py](#approutersstatuspy)
   - [seed_data.py](#seed_datapy)
   - [Frontend Architecture (static/)](#frontend-architecture-static)
7. [API Specification & Endpoints Cheatsheet](#7-api-specification--endpoints-cheatsheet)
8. [Comprehensive Viva Voce Q&A Guide (Categorized)](#8-comprehensive-viva-voce-qa-guide-categorized)
   - [Category 1: Core Architecture & Design Choices](#category-1-core-architecture--design-choices)
   - [Category 2: FastAPI & RESTful APIs](#category-2-fastapi--restful-apis)
   - [Category 3: Database & SQL Engineering](#category-3-database--sql-engineering)
   - [Category 4: Authentication, Cryptography & Security](#category-4-authentication-cryptography--security)
   - [Category 5: Python & Pydantic Internals](#category-5-python--pydantic-internals)
   - [Category 6: Frontend Integration & DOM Operations](#category-6-frontend-integration--dom-operations)
   - [Category 7: Git, Version Control & Collaboration](#category-7-git-version-control--collaboration)
   - [Category 8: Edge Cases, Error Handling & System Failure Scenarios](#category-8-edge-cases-error-handling--system-failure-scenarios)

---

## 1. Project Overview & System Architecture

### 1.1 Problem Statement
In university and college campuses, physical infrastructure issues (damaged benches, leaking coolers, broken projectors, Wi-Fi outages, lost student IDs) are traditionally reported through unstructured channels such as WhatsApp groups, casual emails, or verbal complaints to staff. This leads to:
- Lack of accountability and tracking.
- Duplicate reporting of the same issue.
- No visibility for students regarding repair timelines or status resolution.

### 1.2 The CampusConnect Solution
**CampusConnect** is a centralized, lightweight web application where students can:
1. Register and authenticate securely with encrypted credentials.
2. Submit campus issues with title, detailed description, and standardized category.
3. Track the issue lifecycle through standardized states: **`Open` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved`**.
4. View real-time campus issue statistics and filter issues by category and status.

### 1.3 High-Level Architectural Flow

```
[ Client Browser (HTML5 / CSS3 / ES6 JS) ]
                   │
                   │ HTTP / JSON Requests with Bearer JWT
                   ▼
[ Uvicorn ASGI Server (Port 8000) ]
                   │
                   ▼
[ FastAPI Application (app/main.py) ]
  ├── StaticFiles Handler ("/static" & "/")
  └── API Routers ("/api")
        ├── auth_routes.py  ---> JWT Auth & User Profile
        ├── issues.py       ---> Issue Creation, Listing, Categories
        └── status.py       ---> Status Updates & Aggregation Stats
                   │
                   ▼
[ Dependency Injection Layer: get_db & get_current_user ]
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
[ Bcrypt / PyJWT ]    [ SQLite3 Engine (campusconnect.db) ]
 (Auth & Token Engine) (PRAGMA foreign_keys = ON)
```

---

## 2. Project File Structure

```
campusconnect/
│
├── app/                              # Core Python backend package
│   ├── __init__.py                   # Package initializer
│   ├── main.py                       # FastAPI entrypoint, lifespan events, router mounting
│   ├── database.py                   # SQLite connection provider, row factory & table schema init
│   ├── auth.py                       # Bcrypt password hashing, JWT generation & get_current_user dependency
│   └── routers/                      # Modular API route controllers
│       ├── __init__.py               # Routers package initializer
│       ├── auth_routes.py            # POST /register, POST /login, GET /me
│       ├── issues.py                 # GET /categories, GET /issues, POST /issues, GET /issues/{id}
│       └── status.py                 # PATCH /issues/{id}/status, GET /stats
│
├── static/                           # Client-side static frontend assets
│   ├── index.html                    # Root entrypoint with smart client-side token redirect
│   ├── login.html                    # Student login page
│   ├── register.html                 # Student registration page
│   ├── dashboard.html                # Main issues overview & statistics dashboard
│   ├── create.html                   # Form to report a new campus issue
│   ├── issue.html                    # Single issue detail & status update view
│   ├── profile.html                  # Logged-in student profile page
│   ├── style.css                     # Unified stylesheet (theme, cards, status badges, navbar)
│   ├── api.js                        # Shared HTTP utility (fetch wrapper, bearer auth, date formatting)
│   ├── auth.js                       # Logic for handling registration and login form submissions
│   ├── dashboard.js                  # Dynamic issue card rendering, filtering and stats calculations
│   ├── create.js                     # Form validation and issue submission handling
│   ├── issue.js                      # URL parameter parsing, issue rendering and status updates
│   └── profile.js                    # Fetching and displaying current authenticated student profile
│
├── .gitignore                        # Git exclusion rules (venv, .secret_key, db files, cache)
├── .secret_key                       # Auto-generated 256-bit cryptographically secure JWT secret key
├── campusconnect.db                  # SQLite database file containing persistent records
├── requirements.txt                  # Pinned Python package dependencies with exact versions
├── seed_data.py                      # Development utility to seed demo user and 10 realistic issues
└── README.md                         # Project description, team assignments and instructions
```

---

## 3. All Commands Reference (Terminal, Setup & Execution)

### 3.1 Virtual Environment Setup

#### Windows (PowerShell):
```powershell
# 1. Create a Python virtual environment named 'venv'
python -m venv venv

# 2. Allow script execution for current session (if restricted)
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 3. Activate the virtual environment
.\venv\Scripts\Activate.ps1
```

#### Windows (Command Prompt - CMD):
```cmd
python -m venv venv
venv\Scripts\activate.bat
```

#### macOS / Linux (Bash / Zsh):
```bash
python3 -m venv venv
source venv/bin/activate
```

---

### 3.2 Dependency Management Commands
```bash
# Install all required project dependencies exactly as pinned
pip install -r requirements.txt

# Inspect currently installed packages in the virtual environment
pip list

# Check if any dependencies have known security vulnerabilities or mismatches
pip check

# Output installed packages to generate/update requirements file
pip freeze > requirements.txt
```

---

### 3.3 Database & Seeding Commands
```bash
# Initialize SQLite database schema directly (creates users and issues tables)
python -m app.database

# Populate database with sample data (demo user: demo@campusconnect.com / demo1234 + 10 issues)
python seed_data.py
```

---

### 3.4 Running the Application Server
```bash
# Start the backend development server with auto-reload enabled
uvicorn app.main:app --reload

# Start the backend server on a custom host and port
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Start without auto-reload (production simulation)
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

---

### 3.5 Verification & Testing Commands via Terminal (cURL)
```bash
# 1. Register a new user
curl -X POST http://127.0.0.1:8000/api/register \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Rahul Sharma\", \"email\": \"rahul@college.edu\", \"password\": \"securePass123\"}"

# 2. Login to obtain JWT Bearer Token
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"rahul@college.edu\", \"password\": \"securePass123\"}"

# 3. Access protected profile route using token
curl -X GET http://127.0.0.1:8000/api/me \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"

# 4. Fetch list of issue categories
curl -X GET http://127.0.0.1:8000/api/categories

# 5. Create a new issue (Protected)
curl -X POST http://127.0.0.1:8000/api/issues \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"Broken projector in Room 302\", \"description\": \"HDMI port does not transmit video output\", \"category\": \"Classroom\"}"

# 6. Fetch all issues (Protected)
curl -X GET http://127.0.0.1:8000/api/issues \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"

# 7. Update issue status (Protected)
curl -X PATCH http://127.0.0.1:8000/api/issues/1/status \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"status\": \"In Progress\"}"

# 8. Fetch dashboard stats (Protected)
curl -X GET http://127.0.0.1:8000/api/stats \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

---

## 4. Complete Git Command Reference & Team Workflow

### 4.1 Git Setup & Configuration
```bash
# Set global identity (Name and Email)
git config --global user.name "Pranav Pushya"
git config --global user.email "pushyapranav24@gmail.com"

# Check active git configuration
git config --list
```

### 4.2 Initializing & Cloning
```bash
# Initialize a brand-new git repository in current folder
git init

# Clone existing repository from remote GitHub URL
git clone https://github.com/<owner>/campusconnect.git

# View connected remote repository URL
git remote -v

# Link local repository to remote origin
git remote add origin https://github.com/<owner>/campusconnect.git
```

### 4.3 Daily Development Cycle & Branching
```bash
# Check working tree status (untracked, modified, staged files)
git status

# Fetch latest branches and commits from remote without modifying local files
git fetch origin

# Update your local main branch with remote changes
git checkout main
git pull origin main

# Create and switch to a new feature branch
git checkout -b feature/issues-api-pranav
# Alternatively in modern git:
git switch -c feature/issues-api-pranav

# Stage specific file for commit
git add app/routers/issues.py

# Stage all modified and untracked files
git add .

# Create a commit with a descriptive message
git commit -m "add categories and issues endpoints"

# Push feature branch to GitHub for the first time (-u sets upstream)
git push -u origin feature/issues-api-pranav
```

### 4.4 Merging & Pull Request Workflow
```bash
# Switch to main branch
git checkout main

# Merge feature branch into main
git merge feature/issues-api-pranav

# Push merged main to remote
git push origin main

# Delete local branch after successful merge
git branch -d feature/issues-api-pranav

# Delete remote branch
git push origin --delete feature/issues-api-pranav
```

### 4.5 Inspecting History, Changes & Troubleshooting
```bash
# View compact commit history (one line per commit)
git log --oneline

# View commit history as a visual ASCII graph
git log --graph --oneline --all --decorate

# View commits authored by a specific developer
git log --author="pushyapranav24@gmail.com" --oneline

# Show exact diff / changes made in a specific commit
git show <commit-hash>

# Compare differences between working directory and staging area
git diff

# Compare differences between current branch and main
git diff main...HEAD

# Temporarily save uncommitted work without committing
git stash
# Restore stashed changes
git stash pop

# Unstage a file without losing modifications
git restore --staged app/database.py

# Discard local changes to a file and revert to last commit
git restore app/database.py
```

---

## 5. Complete Import Reference (Every Library, Module & Purpose)

| Import Statement | Module / Package | Why It Is Used in CampusConnect |
| :--- | :--- | :--- |
| `import sqlite3` | Python Standard Library | Connects to SQLite database engine, executes SQL queries, manages transactions and cursors. |
| `from pathlib import Path` | Python Standard Library | Handles file system paths cross-platform (Windows `\` vs Linux `/`), used to resolve `campusconnect.db`, static directories, and `.secret_key`. |
| `import os` | Python Standard Library | Reads environment variables (`os.getenv("SECRET_KEY")`) for deployment configuration. |
| `import secrets` | Python Standard Library | Generates cryptographically secure random hexadecimal tokens (`secrets.token_hex(32)`) for JWT signing keys when not configured in environment. |
| `from datetime import datetime, timedelta, timezone` | Python Standard Library | Manages UTC timestamps, token expiration windows (`exp` set to +24 hours), and date transformations. |
| `from contextlib import asynccontextmanager` | Python Standard Library | Defines the modern FastAPI `lifespan` handler to execute startup actions (table initialization) and shutdown cleanup cleanly. |
| `from typing import Annotated` | Python Standard Library | Attaches metadata and constraints to type annotations (e.g. `Annotated[str, StringConstraints(...)]`). |
| `from enum import Enum` | Python Standard Library | Implements `IssueStatus` enum (`Open`, `In Progress`, `Resolved`) ensuring type-safe, validated status transitions. |
| `from fastapi import FastAPI, APIRouter, Depends, HTTPException` | Third-party (`fastapi`) | Core web framework classes: `FastAPI` creates app, `APIRouter` enables modular route grouping, `Depends` powers Dependency Injection, and `HTTPException` raises standard RFC HTTP error responses. |
| `from fastapi.staticfiles import StaticFiles` | Third-party (`fastapi`) | Mounts the `static/` directory to serve HTML, CSS, and JS files directly to browser clients with `html=True` fallback. |
| `from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials` | Third-party (`fastapi`) | Extracts the `Authorization: Bearer <token>` header from HTTP request headers and passes credentials to auth handlers. |
| `from pydantic import BaseModel, Field, EmailStr, StringConstraints, field_validator` | Third-party (`pydantic`) | Data validation, request body parsing, automatic schema generation, email syntax verification, string trimming, and custom field constraints. |
| `import jwt` | Third-party (`PyJWT`) | Encodes JSON payloads into signed JWT access tokens and decodes/verifies incoming tokens against `SECRET_KEY` and `HS256`. |
| `import bcrypt` | Third-party (`bcrypt`) | One-way cryptographic password hashing using salted Blowfish cipher (`hashpw`, `gensalt`, `checkpw`), preventing rainbow-table attacks. |

---

## 6. In-Depth Codebase Walkthrough (File-by-File & Line-by-Line Logic)

### `app/main.py`
* **Entrypoint & Lifespan Architecture**:
  * Lines 25–33 define `lifespan(app: FastAPI)` using `@asynccontextmanager`. When Uvicorn starts, code before `yield` runs (`init_db()`), guaranteeing tables exist before the first request is processed. Code after `yield` executes on graceful server shutdown.
* **App Instantiation**:
  * Line 36 initializes `app = FastAPI(title="CampusConnect", version="1.0.0", lifespan=lifespan)`. Automatic OpenAPI documentation is generated at `/docs` (Swagger UI) and `/redoc`.
* **Router Registration Order (Crucial Design Consideration)**:
  * Lines 44–46 register `auth_routes.router`, `issues.router`, and `status.router` under `/api`.
  * Line 50 mounts `StaticFiles(directory=STATIC_DIR, html=True)` at `"/"`.
  * **Viva Note:** Routers *must* be included **before** mounting static files at `"/"`. If static files were mounted first at the root path, the static handler would intercept all incoming requests, shadowing or blocking `/api` routes.

---

### `app/database.py`
* **Path Resolution**:
  * Lines 5–6 use `Path(__file__).resolve().parent.parent` to compute the repository root dynamically, making the database location portable regardless of working directory.
* **`get_db_connection()`**:
  * Line 14: `conn = sqlite3.connect(DB_FILE)`.
  * Line 16: `conn.row_factory = sqlite3.Row`. This is a vital configuration: by default, `sqlite3` returns tuples (`(1, 'Title')`). `sqlite3.Row` wraps tuples allowing dictionary-like access (`row['title']`) and direct conversion via `dict(row)` for JSON serialization.
  * Line 18: `conn.execute("PRAGMA foreign_keys = ON;")`. SQLite disables foreign key enforcement by default for backward compatibility. Executing this PRAGMA enables referential integrity so `created_by` must reference a valid `users.id`.
* **Dependency Injection (`get_db`)**:
  * Lines 22–31 implement a Python generator yielding a connection:
    ```python
    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()
    ```
  * In FastAPI, any route taking `db = Depends(get_db)` receives an open connection for the lifetime of that single request. Once the response is sent, execution enters the `finally` block, closing the connection and preventing memory or file descriptor leaks.
* **Schema Initialization (`init_db`)**:
  * `users` table:
    * `id`: `INTEGER PRIMARY KEY AUTOINCREMENT`
    * `name`: `TEXT NOT NULL`
    * `email`: `TEXT UNIQUE NOT NULL` (enforces uniqueness at database level)
    * `password_hash`: `TEXT NOT NULL`
    * `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
  * `issues` table:
    * `id`: `INTEGER PRIMARY KEY AUTOINCREMENT`
    * `title`: `TEXT NOT NULL`
    * `description`: `TEXT NOT NULL`
    * `category`: `TEXT NOT NULL`
    * `status`: `TEXT NOT NULL DEFAULT 'Open'`
    * `created_by`: `INTEGER NOT NULL, FOREIGN KEY (created_by) REFERENCES users (id)`
    * `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

---

### `app/auth.py`
* **Configuration Constants**:
  * `ALGORITHM = "HS256"` (HMAC using SHA-256 hash algorithm).
  * `TOKEN_HOURS = 24` (Token validity duration).
  * `bearer = HTTPBearer(auto_error=False)` (Extracts bearer credentials from headers without crashing if missing).
* **Secret Key Persistence (`_load_secret_key`)**:
  * Checks if `SECRET_KEY` exists in environment variables. If not found, it checks for a local file `.secret_key`. If the file does not exist, it generates a 64-character random hex string (`secrets.token_hex(32)`) and saves it. This guarantees that restarting the server does not invalidate existing user JWT tokens while keeping secrets out of source control.
* **Bcrypt Password Security**:
  * `hash_password(password)`: Encodes plaintext string to UTF-8 bytes and invokes `bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()`. Salt generation uses random entropy and standard cost factor.
  * `verify_password(password, hashed)`: Uses `bcrypt.checkpw()`. Wrapped in `try...except ValueError` to gracefully return `False` if an invalid salt/hash format is encountered instead of raising an unhandled 500 server error.
* **JWT Creation (`create_token`)**:
  * Constructs claims payload:
    * `"sub"` (Subject): `str(user_id)`
    * `"exp"` (Expiration): `datetime.now(timezone.utc) + timedelta(hours=24)`
  * Encodes payload with `jwt.encode(..., SECRET_KEY, algorithm="HS256")`.
* **Current User Dependency (`get_current_user`)**:
  * Receives `creds: HTTPAuthorizationCredentials` and `db: sqlite3.Connection`.
  * Verifies presence of credentials; raises `401 Unauthorized` if missing.
  * Decodes token via `jwt.decode()`; catches `jwt.PyJWTError` (covers expired token, invalid signature, corrupted payload) and raises `401`.
  * Executes SQL lookup:
    ```sql
    SELECT id, name, email, strftime('%Y-%m-%dT%H:%M:%SZ', created_at) AS created_at
    FROM users WHERE id = ?
    ```
  * Instantiates and returns a Pydantic `User` object.

---

### `app/routers/auth_routes.py`
* **Input Schemas**:
  * `RegisterRequest`:
    * `name`: String between 1 and 100 characters.
    * `email`: Validated via `EmailStr` (verifies RFC compliance and domain syntax).
    * `password`: Validated via `Field(min_length=8, max_length=72)`. Max length 72 is set because the underlying Bcrypt algorithm truncates passwords beyond 72 bytes.
  * `LoginRequest`:
    * `email`: `EmailStr`.
    * `password`: `Field(max_length=72)`.
* **Registration Flow (`POST /api/register`)**:
  * Normalizes email: `email = data.email.lower()`.
  * Inserts record with hashed password into `users` table.
  * Catches `sqlite3.IntegrityError` if the email already exists and responds with `400 Bad Request` (`"Email already registered"`).
  * Returns user record with `201 Created` status code.
* **Login Flow (`POST /api/login`)**:
  * Looks up user by normalized lowercase email.
  * Verifies plaintext password against stored `password_hash` using `verify_password()`.
  * If user not found or password mismatch: raises `401 Unauthorized` (`"Invalid email or password"`). Notice that the error message does not disclose whether the email or password was wrong, protecting against user enumeration attacks.
  * Returns `{"access_token": token, "token_type": "bearer"}`.
* **Profile Flow (`GET /api/me`)**:
  * Protected endpoint using `Depends(get_current_user)`.
  * Returns current authenticated student details.

---

### `app/routers/issues.py`
* **Standardized Categories**:
  * `CATEGORIES = ["Classroom", "Campus", "Lost & Found", "Digital IT Services", "General"]`.
* **Input Validation (`IssueCreate`)**:
  * `title`: `Annotated[str, StringConstraints(strip_whitespace=True, min_length=3, max_length=100)]`.
  * `description`: `Annotated[str, StringConstraints(strip_whitespace=True, min_length=5, max_length=1000)]`.
  * `@field_validator("category")`: Rejects any category not in `CATEGORIES` with a validation error.
* **Reusable SQL Query (`ISSUE_SELECT`)**:
  ```sql
  SELECT i.id, i.title, i.description, i.category, i.status, i.created_by,
         u.name AS created_by_name,
         strftime('%Y-%m-%dT%H:%M:%SZ', i.created_at) AS created_at
  FROM issues i JOIN users u ON u.id = i.created_by
  ```
  * Joining `users` allows displaying author name without extra queries.
  * Formatting `created_at` with SQLite's `strftime` with trailing `Z` creates an unambiguous ISO 8601 UTC timestamp so browser JavaScript parses it accurately without timezone shift.
* **Endpoints**:
  * `GET /api/categories`: Returns JSON array of 5 valid categories (public).
  * `GET /api/issues`: Protected via `Depends(get_current_user)`. Returns all issues sorted by `i.id DESC` (newest first).
  * `POST /api/issues`: Protected. Reads `user.id` from token, executes parameterized insert into `issues`, commits transaction, fetches created record via `cur.lastrowid`, and returns `201 Created`.
  * `GET /api/issues/{issue_id}`: Protected. Queries single issue by ID. If `fetchone()` returns `None`, raises `404 Not Found`.

---

### `app/routers/status.py`
* **Status Enum**:
  * `IssueStatus(str, Enum)` defines three legal states: `Open`, `In Progress`, `Resolved`.
* **Status Update Endpoint (`PATCH /api/issues/{issue_id}/status`)**:
  * Uses HTTP `PATCH` because only a partial field (`status`) is modified.
  * Checks if issue exists. If not, raises `404 Not Found`.
  * Updates issue status using `status_data.status.value` and commits.
  * Returns updated `id` and `status`.
* **Dashboard Statistics (`GET /api/stats`)**:
  * Executes aggregation SQL:
    ```sql
    SELECT status, COUNT(*) AS count
    FROM issues
    GROUP BY status
    ```
  * Iterates over grouped results and constructs a normalized response:
    ```json
    { "open": 5, "in_progress": 2, "resolved": 3 }
    ```

---

### `seed_data.py`
* Ensures `init_db()` has run.
* Hashes password `demo1234` with bcrypt.
* Uses SQLite `INSERT ... ON CONFLICT(email) DO UPDATE` to upsert a demo account (`demo@campusconnect.com`).
* Contains a list of 10 realistic campus issues spanning multiple categories and statuses.
* Checks `SELECT id FROM issues WHERE title = ?` before inserting to make the script **idempotent** (it can be executed multiple times without creating duplicate sample records).

---

### Frontend Architecture (`static/`)

#### 1. `static/api.js` (Core Frontend Utility)
* Stores the JWT token in browser `localStorage` under key `"token"`.
* `getToken()` / `logout()`: Retrieval and cleanup helpers.
* `requireAuth()`: Guards protected pages; if no token is found in `localStorage`, immediately redirects user to `/login.html`.
* `apiFetch(path, options)`: Wrapper around native browser `fetch()`:
  * Automatically sets `"Content-Type": "application/json"`.
  * Automatically injects `"Authorization": "Bearer " + token` when a token exists.
  * Intercepts `401 Unauthorized` responses: automatically logs the user out and clears token.
* `formatDate(iso)`: Converts ISO UTC timestamp string into localized date format (`en-IN`).

#### 2. `static/auth.js`
* Intercepts submit events on `#loginForm` and `#registerForm` using `event.preventDefault()`.
* Sends JSON payload to `/api/login` or `/api/register`.
* On login success, saves `access_token` to `localStorage` and routes user to `dashboard.html`.

#### 3. `static/dashboard.js`
* Renders issue statistics cards and dynamic issue cards.
* Creates elements safely using `document.createElement()` and `textContent` rather than `innerHTML`, preventing Cross-Site Scripting (XSS).
* Implements dynamic client-side filtering listening to `change` events on category and status dropdowns.

#### 4. `static/issue.js`
* Reads query parameters via `new URLSearchParams(window.location.search).get("id")`.
* Fetches issue details and binds them to the DOM.
* Handles status update form submission via `PATCH /api/issues/{id}/status`.

#### 5. `static/index.html`
* Serves as the intelligent root router. Checks if a token exists:
  ```javascript
  window.location.replace(localStorage.getItem("token") ? "/dashboard.html" : "/login.html");
  ```
  Users are directed to their dashboard if logged in, or the login page if unauthenticated.

---

## 7. API Specification & Endpoints Cheatsheet

| HTTP Method | Endpoint Path | Authentication Required? | Request Body | Success Response | Error Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/register` | No | `{"name", "email", "password"}` | `201 Created` (User object) | `400` (Email exists), `422` (Validation) |
| `POST` | `/api/login` | No | `{"email", "password"}` | `200 OK` (`access_token`, `token_type`) | `401` (Invalid credentials), `422` |
| `GET` | `/api/me` | Yes (Bearer JWT) | None | `200 OK` (Current user profile) | `401` (Unauthorized) |
| `GET` | `/api/categories` | No | None | `200 OK` (Array of category strings) | None |
| `GET` | `/api/issues` | Yes (Bearer JWT) | None | `200 OK` (Array of issue objects) | `401` |
| `POST` | `/api/issues` | Yes (Bearer JWT) | `{"title", "description", "category"}` | `201 Created` (Created issue object) | `401`, `422` (Invalid category/length) |
| `GET` | `/api/issues/{id}` | Yes (Bearer JWT) | None | `200 OK` (Single issue object) | `401`, `404` (Not Found) |
| `PATCH` | `/api/issues/{id}/status` | Yes (Bearer JWT) | `{"status": "Open"\|"In Progress"\|"Resolved"}` | `200 OK` (`{"id", "status"}`) | `401`, `404`, `422` |
| `GET` | `/api/stats` | Yes (Bearer JWT) | None | `200 OK` (`{"open", "in_progress", "resolved"}`) | `401` |

---

## 8. Comprehensive Viva Voce Q&A Guide (Categorized)

### Category 1: Core Architecture & Design Choices

#### Q1.1: What is the architecture of CampusConnect?
**Answer:**  
CampusConnect uses a decoupled **Client-Server Architecture**:
- **Backend:** Built using Python with the **FastAPI** framework running on the **Uvicorn ASGI server**. It exposes a stateless RESTful JSON API.
- **Database:** **SQLite 3** relational database managed locally through parameterized SQL queries and connection-level foreign key enforcement.
- **Frontend:** Single-page style static web interface using vanilla HTML5, CSS3, and ES6 JavaScript, communicating asynchronously with the backend via `fetch` API and Bearer JWT authentication.

#### Q1.2: Why did you choose FastAPI over Flask or Django?
**Answer:**  
1. **Speed & Asynchronous Capability:** FastAPI is built on Starlette and Pydantic, making it one of the fastest Python frameworks available, with native ASGI support.
2. **Automatic Data Validation:** Request payloads are automatically validated against Pydantic schemas, eliminating repetitive manual verification code.
3. **Interactive Documentation:** It automatically creates interactive OpenAPI Swagger UI (`/docs`) and ReDoc (`/redoc`) specifications directly from Python type annotations.
4. **Dependency Injection System:** FastAPI includes a built-in DI system used in CampusConnect for database connection management (`get_db`) and authentication checking (`get_current_user`).

#### Q1.3: Why choose SQLite for this project instead of PostgreSQL or MySQL?
**Answer:**  
1. **Zero-Configuration & Serverless:** SQLite is an embedded database engine that stores data directly in a single local disk file (`campusconnect.db`), requiring no standalone database server setup or credentials.
2. **Portability:** The entire project can be cloned and run instantly by evaluators without running separate Docker containers or services.
3. **Sufficient for Scope:** For a campus-level issue tracking app, SQLite handles read and write operations with ACID compliance efficiently.

---

### Category 2: FastAPI & RESTful APIs

#### Q2.1: What is an ASGI server and what role does Uvicorn play?
**Answer:**  
ASGI stands for **Asynchronous Server Gateway Interface**. It is the modern Python standard specification for asynchronous web servers and applications (succeeding the synchronous WSGI standard). **Uvicorn** is the lightning-fast ASGI web server implementation that runs our FastAPI application, listening for TCP connections on port 8000 and passing HTTP requests to FastAPI.

#### Q2.2: Why are routers included before mounting the static directory in `main.py`?
**Answer:**  
In FastAPI, route evaluation order matters. Static files are mounted at the root path (`"/"`). If static files were mounted first, any request matching a route prefix (such as `/api/...`) could be intercepted and treated as a static file request, causing route shadowing or 404 errors. Registering API routers first ensures `/api` endpoints have top priority.

#### Q2.3: Why is `PATCH` used instead of `PUT` for updating issue status?
**Answer:**  
In HTTP REST specifications:
- `PUT` replaces the **entire resource** with the new payload (requiring title, description, category, and status).
- `PATCH` applies a **partial update** to a resource. Since we are modifying only the `status` field while keeping `title`, `description`, and `created_at` unchanged, `PATCH /api/issues/{id}/status` is semantically correct.

#### Q2.4: What is the purpose of FastAPI's `lifespan` event handler?
**Answer:**  
The `@asynccontextmanager` lifespan handler manages startup and shutdown routines. Everything before `yield` executes when the server starts (we call `init_db()` to ensure tables exist before handling user requests). Everything after `yield` executes during graceful server shutdown. This replaces legacy `@app.on_event("startup")` decorators.

---

### Category 3: Database & SQL Engineering

#### Q3.1: How is the database connection managed per request in CampusConnect?
**Answer:**  
Database connections are managed via FastAPI's **Dependency Injection** using the `get_db()` generator function:
```python
def get_db():
    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()
```
When an endpoint specifies `db: sqlite3.Connection = Depends(get_db)`, FastAPI calls `get_db()`, yields the active connection to the route handler, and once the response finishes (even if an error occurs), the `finally` block runs, closing the connection cleanly.

#### Q3.2: Why is `conn.row_factory = sqlite3.Row` used?
**Answer:**  
By default, Python's `sqlite3` module returns query results as standard tuples, forcing access by integer index (`row[0]`, `row[1]`), which is error-prone and unreadable. `sqlite3.Row` enables dictionary-style column access (`row["title"]`, `row["status"]`) and allows converting rows into standard Python dictionaries using `dict(row)` for direct JSON serialization.

#### Q3.3: Why do we explicitly execute `PRAGMA foreign_keys = ON;` in SQLite?
**Answer:**  
In SQLite, foreign key constraint enforcement is **disabled by default** for backward compatibility with older SQLite 3 releases. Without explicitly running `PRAGMA foreign_keys = ON;` upon opening every database connection, SQLite ignores `FOREIGN KEY` clauses, allowing issues to be created with nonexistent `created_by` user IDs.

#### Q3.4: How are SQL injection attacks prevented in this codebase?
**Answer:**  
All SQL queries in CampusConnect use **parameterized queries** with `?` placeholders (e.g., `cursor.execute("SELECT id FROM users WHERE email = ?", (email,))`). User input is never concatenated directly into SQL query strings using string formatting or f-strings. The SQLite driver handles escaping safely, ensuring user inputs are treated strictly as literal values rather than executable SQL code.

#### Q3.5: Explain the SQL query used in `GET /api/issues`.
**Answer:**  
```sql
SELECT i.id, i.title, i.description, i.category, i.status, i.created_by,
       u.name AS created_by_name,
       strftime('%Y-%m-%dT%H:%M:%SZ', i.created_at) AS created_at
FROM issues i 
JOIN users u ON u.id = i.created_by
ORDER BY i.id DESC
```
- Performs an `INNER JOIN` between `issues` and `users` to retrieve the submitter's full name alongside the issue details in a single query.
- Uses `strftime('%Y-%m-%dT%H:%M:%SZ', i.created_at)` to format the stored timestamp into an ISO 8601 UTC string ending with `Z`.
- Orders by `i.id DESC` so the most recently submitted issues appear at the top of the feed.

---

### Category 4: Authentication, Cryptography & Security

#### Q4.1: How does password hashing work in CampusConnect? Why not MD5 or SHA-256?
**Answer:**  
Passwords are protected using the **Bcrypt** cryptographic algorithm (`bcrypt.hashpw` with `bcrypt.gensalt()`):
- **Why not MD5 or SHA-256:** MD5 and standard SHA-256 are general-purpose cryptographic hash functions designed to be extremely fast. Attackers using modern GPUs can compute billions of SHA-256 hashes per second, making brute-force and rainbow table attacks trivial.
- **Why Bcrypt:** Bcrypt is an adaptive, computationally expensive one-way key derivation function based on the Blowfish cipher. It incorporates a random cryptographic salt (preventing precomputed rainbow table attacks) and a configurable work factor (cost) that can be increased over time as computing hardware becomes faster.

#### Q4.2: Why is password length constrained between 8 and 72 characters?
**Answer:**  
- **Minimum 8 characters:** Enforces basic password complexity and entropy against dictionary guessing.
- **Maximum 72 characters:** Bcrypt has an algorithmic limitation where it hashes only the first 72 bytes of input; any bytes past 72 are silently ignored. Enforcing `max_length=72` in Pydantic prevents false security assumptions.

#### Q4.3: Explain the structure and lifecycle of the JWT token in CampusConnect.
**Answer:**  
JWT (JSON Web Token) is a compact, URL-safe means of representing claims between two parties:
1. **Header:** Identifies the signing algorithm (`HS256` - HMAC SHA-256) and token type (`JWT`).
2. **Payload:** Contains the claims:
   - `"sub"`: Subject identifier (the user's integer database ID converted to string).
   - `"exp"`: Expiration timestamp in UTC (`datetime.now(timezone.utc) + timedelta(hours=24)`).
3. **Signature:** Computed by taking the base64-encoded header and payload, hashing them with the server's secret key (`SECRET_KEY`), and base64-encoding the digest.

When the student logs in, the server generates this token. The client stores it in `localStorage` and includes it in the `Authorization: Bearer <token>` header for subsequent API requests. The server validates the signature and extracts the user ID without needing to maintain server-side session state in memory.

#### Q4.4: How does `get_current_user` protect private routes?
**Answer:**  
`get_current_user` is a FastAPI dependency:
1. It intercepts the HTTP `Authorization` header using `HTTPBearer`.
2. If credentials are missing, it immediately raises `HTTPException(status_code=401, detail="Not authenticated")`.
3. It calls `jwt.decode(token, SECRET_KEY, algorithms=["HS256"])`. If the token signature is invalid or expired, PyJWT raises `PyJWTError`, which is caught and returned as `401 Unauthorized`.
4. It queries the database for the user ID specified in `"sub"`. If found, it returns the verified `User` model; otherwise, it raises `401`.

#### Q4.5: How is the `SECRET_KEY` managed in CampusConnect?
**Answer:**  
To prevent hardcoded credentials in source control, `_load_secret_key()` in `app/auth.py`:
1. Checks for an environment variable `SECRET_KEY`.
2. If absent, checks for a file named `.secret_key` in the project root.
3. If neither exists, generates a 256-bit cryptographically secure random key (`secrets.token_hex(32)`) and saves it to `.secret_key` (which is excluded from Git via `.gitignore`). This ensures tokens remain valid across server reboots while preventing key exposure in public repositories.

---

### Category 5: Python & Pydantic Internals

#### Q5.1: What is Pydantic and how is it used in CampusConnect?
**Answer:**  
Pydantic is a data validation and settings management library based on Python type hints. In CampusConnect:
- It defines schemas for incoming requests (`RegisterRequest`, `LoginRequest`, `IssueCreate`, `StatusUpdate`).
- It sanitizes input (e.g., `strip_whitespace=True`).
- It enforces constraints (e.g., minimum and maximum length).
- It verifies email formatting using `EmailStr`.
- It executes custom validation using `@field_validator` (e.g., ensuring `category` matches one of the five allowed options).

#### Q5.2: What happens if a user submits an invalid category or missing fields?
**Answer:**  
FastAPI automatically intercepts the request before it reaches the endpoint function and returns an HTTP `422 Unprocessable Entity` response with a structured JSON body detailing the exact field and error message, protecting the database layer from corrupt data.

---

### Category 6: Frontend Integration & DOM Operations

#### Q6.1: How does the client-side JavaScript communicate with the authenticated backend?
**Answer:**  
Through the `apiFetch(path, options)` helper function in `static/api.js`:
1. It reads the JWT token from `localStorage.getItem("token")`.
2. If present, it attaches `"Authorization": "Bearer " + token` to the request headers.
3. It dispatches the request using the native browser `fetch` API.
4. If the server responds with `401 Unauthorized`, it calls `logout()` (which clears `localStorage` and redirects to `/login.html`).

#### Q6.2: How is Cross-Site Scripting (XSS) mitigated on the frontend?
**Answer:**  
In `static/dashboard.js`, DOM elements are constructed programmatically using `document.createElement()` and populated using `node.textContent = issue.description`. Setting `textContent` causes the browser to treat input strictly as plain text, neutralising any embedded HTML tags or `<script>` injections that might have been entered into the issue title or description.

#### Q6.3: How does the filtering feature work on the dashboard?
**Answer:**  
Event listeners are attached to the `#categories` and `#statusFilter` dropdowns. Whenever the user changes a selection, `filterIssues()` runs, filtering the issues array:
```javascript
const filteredIssues = issues.filter(function(issue) {
    const categoryMatches = selectedCategory === "" || issue.category === selectedCategory;
    const statusMatches = selectedStatus === "" || issue.status === selectedStatus;
    return categoryMatches && statusMatches;
});
renderIssues(filteredIssues);
```
The DOM is cleared and re-rendered with the matching subset of issue cards without reloading the web page.

---

### Category 7: Git, Version Control & Collaboration

#### Q7.1: What was your team's Git branching strategy?
**Answer:**  
We followed a feature-branch workflow:
1. The `main` branch remained stable and protected.
2. Developers created dedicated feature branches named with their module and name (e.g., `feature/issues-api-pranav`, `feature/auth-m2`, `dashboard-ui-M3`).
3. Changes were committed with atomic, meaningful commit messages.
4. Pull Requests (PRs) were opened on GitHub, peer-reviewed, and merged into `main`.

#### Q7.2: What files are excluded in `.gitignore` and why?
**Answer:**  
1. `venv/`: Virtual environment binaries and packages (large, platform-dependent, can be reinstalled from `requirements.txt`).
2. `campusconnect.db`: SQLite database file (contains local runtime test records; committing it leads to binary merge conflicts).
3. `.secret_key`: Contains the private token signing secret (must never be committed to public version control).
4. `__pycache__/` and `*.pyc`: Compiled Python bytecode files.

---

### Category 8: Edge Cases, Error Handling & System Failure Scenarios

#### Q8.1: What happens if two students attempt to register with the same email?
**Answer:**  
The `users.email` column has a `UNIQUE` constraint. When the second registration executes `INSERT INTO users`, SQLite raises a `sqlite3.IntegrityError`. The route controller catches this specific exception and responds with `HTTP 400 Bad Request` and detail `"Email already registered"`, preventing duplicate accounts.

#### Q8.2: What happens if a user submits an issue pointing to a nonexistent user ID?
**Answer:**  
Since issue creation is protected by `Depends(get_current_user)`, the `user_id` is extracted directly from the verified cryptographic JWT token, not supplied by client input. Furthermore, `PRAGMA foreign_keys = ON;` guarantees that the database engine itself rejects any foreign key mismatches.

#### Q8.3: What happens if the database file is accidentally deleted?
**Answer:**  
Upon restarting the FastAPI server, the `lifespan` handler calls `init_db()`. SQLite automatically creates a new `campusconnect.db` file and generates the `users` and `issues` tables. Running `python seed_data.py` then restores demo accounts and sample issues in seconds.
