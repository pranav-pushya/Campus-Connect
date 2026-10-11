# CampusConnect 🎓

A simple, robust full-stack web application designed for university students to report, track, and resolve common campus issues.

> Built for **Code2Chill — Weekly Project 01**  
> **Status:** ✅ Complete & Production Ready (`v1.0`)

---

## 📌 Project Overview

Campus problems like broken classroom fans, Wi-Fi outages, water cooler leaks, or lost ID cards usually get reported through scattered WhatsApp messages, emails, and word of mouth. 

**CampusConnect** provides a centralized, streamlined platform where students can:
1. **Report an issue** with a title, description, and specific category.
2. **View and filter issues** on an interactive real-time dashboard.
3. **Track issue lifecycle** through status progression: **Open → In Progress → Resolved**.
4. **View student profile** with secure JWT session management.

The focus of this project is high-discipline full-stack integration—connecting vanilla HTML/CSS/JavaScript with a Python FastAPI backend and raw SQLite database while adhering to strict team GitHub workflows.

---

## ✨ Features

- [x] **Secure Student Authentication**: Student registration and login powered by `bcrypt` password hashing and stateless JWT bearer tokens.
- [x] **Campus Issue Reporting**: Report issues with titles (3–100 chars), detailed descriptions (5–1000 chars), and strict category validation.
- [x] **5 Standard Issue Categories**:
  - `Classroom`
  - `Campus`
  - `Lost & Found`
  - `Digital IT Services`
  - `General`
- [x] **Live Issues Dashboard**: Dynamic issue list sorted newest-first, real-time counters for *Open*, *In Progress*, and *Resolved* issues.
- [x] **Issue Detail & Status Tracking**: Detailed issue view with lifecycle dropdown to update status from *Open → In Progress → Resolved*.
- [x] **Student Profile Management**: Dedicated profile view displaying student name, verified email, account role, and join date.
- [x] **XSS-Safe DOM Rendering**: All user-generated content rendered safely using `textContent` and `createElement` to block Cross-Site Scripting.
- [x] **Auto-Redirection**: Intelligent root `/` route directing authenticated students to `/dashboard.html` and guests to `/login.html`.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | Vanilla frontend without heavy frameworks for maximum speed and simplicity |
| **Backend** | Python 3.10+, FastAPI | High-performance, asynchronous REST API framework |
| **Database** | SQLite (Raw `sqlite3`) | Relational SQLite database using secure parameterized queries (no ORM) |
| **Security** | `bcrypt`, `PyJWT`, `HTTPBearer` | Industry-standard password hashing and token authentication |
| **Server** | `uvicorn` | Lightning-fast ASGI web server |
| **Version Control** | Git & GitHub | Strict feature branch and Pull Request review workflow |

---

## 📁 Project Structure

```text
Campus-Connect/
├── app/
│   ├── main.py              # FastAPI application entry point & static mounting
│   ├── database.py          # SQLite connection helper & table auto-initialization
│   ├── auth.py              # Password hashing, JWT token handling & auth guards
│   └── routers/
│       ├── auth_routes.py   # Register (/api/register), Login (/api/login), Me (/api/me)
│       ├── issues.py        # Categories, Issue creation & listing endpoints
│       └── status.py        # Status update (PATCH) & dashboard counters (/api/stats)
├── static/
│   ├── css/
│   │   └── style.css        # Central stylesheet for auth, dashboard & profile
│   ├── js/
│   │   ├── api.js           # Shared fetch helper, auth token manager & date formatter
│   │   ├── auth.js          # Client-side login & registration logic
│   │   ├── dashboard.js     # Dashboard issue rendering & category/status filters
│   │   ├── issue.js         # Single issue detail viewer & status updater
│   │   └── profile.js       # Student profile data fetching & logout logic
│   ├── index.html           # Smart redirection router (token-aware)
│   ├── login.html           # Student login page
│   ├── register.html        # Student account registration page
│   ├── dashboard.html       # Issues feed and stats counters
│   ├── create.html          # New issue submission form
│   └── profile.html         # Logged-in student profile page
├── seed_data.py             # Database seeder (10 pre-loaded campus issues + demo account)
├── requirements.txt         # Pinned backend dependencies
├── .gitignore               # Strict ignore rules for DB, venv, cache & secrets
└── README.md                # Project documentation
```

---

## 🚀 How to Run Locally

Follow these step-by-step instructions to clone and run CampusConnect locally on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/pranav-pushya/Campus-Connect.git
cd Campus-Connect
```

### 2. Set Up a Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Initialize & Seed the Database
Run the seeder script to initialize SQLite tables and load sample campus issues along with a demo student account:
```bash
python seed_data.py
```
*(Expected output: `Seed complete. Added 10 new sample issues.`)*

### 5. Start the Server
```bash
python -m uvicorn app.main:app --reload
```

### 6. Open the Application
Open your web browser and navigate to:
👉 **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)**

Interactive Swagger API documentation is available at:
👉 **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

---

## 🔑 Demo Account Credentials

You can test the application immediately using the pre-seeded student account or register a new account:

| Field | Credentials |
|---|---|
| **Email** | `demo@campusconnect.com` |
| **Password** | `demo1234` |

---

## 📡 REST API Reference

| Method | Endpoint | Auth | Request Body | Response | Description |
|---|---|:---:|---|---|---|
| `POST` | `/api/register` | No | `{name, email, password}` | `201 {id, name, email}` | Register a new student account |
| `POST` | `/api/login` | No | `{email, password}` | `200 {access_token, token_type}` | Authenticate student and issue JWT token |
| `GET` | `/api/me` | Yes | — | `200 {id, name, email, created_at}` | Retrieve authenticated student profile |
| `GET` | `/api/categories` | No | — | `200 ["Classroom", ...]` | Get list of allowed issue categories |
| `GET` | `/api/issues` | Yes | — | `200 [{id, title, status, ...}]` | List all issues (ordered newest first) |
| `POST` | `/api/issues` | Yes | `{title, description, category}` | `201 {id, title, ...}` | Submit a new campus issue |
| `GET` | `/api/issues/{id}` | Yes | — | `200 {id, title, description, ...}` | Get full details of a specific issue |
| `PATCH` | `/api/issues/{id}/status` | Yes | `{status}` | `200 {id, status}` | Update status (`Open`, `In Progress`, `Resolved`) |
| `GET` | `/api/stats` | Yes | — | `200 {open, in_progress, resolved}` | Status counts for dashboard summary |

---

## 🔒 Security & Implementation Details

- **Password Protection**: Passwords are never stored in plaintext. They are salted and hashed using `bcrypt` (72-byte max safety limit).
- **SQL Injection Prevention**: All database queries in `app/routers/` use parameterized SQLite queries (`?`) rather than string concatenation.
- **Cross-Site Scripting (XSS)**: User inputs and titles are inserted into DOM cards strictly using `textContent` and `createElement` methods.
- **Timezone Drift Fix**: Dates are converted to ISO 8601 UTC strings (`%Y-%m-%dT%H:%M:%SZ`) in SQLite queries so client-side JavaScript dates render accurately across all timezones without offset bugs.

---

## ⚠️ Known Limitations

1. **Status Update Permissions**: In accordance with the simplified beginner project specifications, any logged-in student can update the status of an issue to facilitate testing during peer reviews.
2. **Client Token Storage**: JWT tokens are persisted in browser `localStorage`. In an enterprise production environment, `HttpOnly` Secure cookies would be preferred.

---

## 👥 The Team

| Team Member | Role | Key Contributions |
|---|---|---|
| **Pranav** (M1) | **Team Lead & Backend Core** | Project scaffolding, SQLite schema, Issues API (`issues.py`), static router, integration, and code reviews. |
| **Gavesh** (M2) | **Authentication & Security** | JWT generation, `bcrypt` password hashing, `/api/register`, `/api/login`, `/api/me`, and student profile page. |
| **Akshita** (M3) | **Frontend UI & Styling** | UI architecture, shared stylesheet (`style.css`), API helper (`api.js`), dashboard, create issue, and XSS fixes. |
| **Aastha** (M4) | **Status Workflow, QA & Docs** | Status update PATCH endpoint, stats endpoint (`status.py`), `seed_data.py` seeder, testing, and documentation. |

---

## 🤝 Git & GitHub Team Discipline

This project was built adhering to strict collaborative software engineering standards:
1. **Branch Protection**: Direct pushes to `main` are blocked; all code enters through Pull Requests.
2. **Feature Branching**: Each feature developed on a dedicated branch (`feature/<feature-name>`).
3. **Peer Review Ring**: Pull Requests required at least 1 approval before merging.
4. **Clean Commits**: Atomic, descriptive conventional commit messages.

---

_CampusConnect · Code2Chill Weekly Project 01_
