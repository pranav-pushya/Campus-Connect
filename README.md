# CampusConnect

A simple web app where students can report and track common issues around their college campus.

> Built for **Code2Chill, Weekly Project 01**.
> **Status:** 🚧 In development. This README will be updated as features are completed.

---

## Project Idea

Campus problems like a broken fan, no Wi-Fi, or a lost ID card usually get reported through scattered messages and word of mouth. CampusConnect gives students one place to:

- Report an issue with a title, description, and category
- See all submitted issues in one dashboard
- Track each issue as it moves from **Open → In Progress → Resolved**

The goal is a small but fully working full-stack app (frontend, backend, and database working together), built by a team using GitHub.

## Features

Planned features (checked off as they are merged to `main`):

- [ ] Student registration and login
- [ ] Create a campus issue (title, description, category)
- [ ] Issue categories (Classroom, Campus, Lost & Found, General)
- [ ] Dashboard listing all submitted issues
- [ ] Issue details page
- [ ] Update issue status (Open / In Progress / Resolved)
- [ ] Simple profile page for the logged-in student

## Tech Stack

| Layer           | Technology            |
| --------------- | --------------------- |
| Frontend        | HTML, CSS, JavaScript |
| Backend         | Python, FastAPI       |
| Database        | SQLite                |
| Version Control | Git, GitHub           |

## Project Structure

```
campusconnect/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # SQLite connection + table setup
│   ├── auth.py              # Password hashing, tokens, current-user dependency
│   └── routers/
│       ├── auth_routes.py   # Register, login, profile (/api/me)
│       ├── issues.py        # Create, list, view issues + categories
│       └── status.py        # Status update + dashboard stats
├── static/
│   ├── css/
│   │   └── style.css        # Shared styles
│   ├── js/
│   │   ├── api.js           # Shared fetch helper
│   │   ├── auth.js          # Login/register logic
│   │   ├── profile.js       # Profile page logic
│   │   ├── dashboard.js     # Dashboard logic
│   │   └── issue.js         # Issue details logic
│   ├── login.html
│   ├── register.html
│   ├── profile.html
│   ├── dashboard.html
│   ├── create.html
│   └── issue.html
├── requirements.txt         # Python dependencies
├── .gitignore
└── README.md
```

## How to Run

> ⚠️ Setup steps below are the planned workflow. They will be verified and finalized once the backend is merged.

1. Clone the repository

   ```bash
   git clone <repo-url>
   cd campusconnect
   ```
2. Create and activate a virtual environment

   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS / Linux
   source venv/bin/activate
   ```
3. Install dependencies

   ```bash
   pip install -r requirements.txt
   ```
4. Start the server

   ```bash
   uvicorn app.main:app --reload
   ```
5. Open `http://127.0.0.1:8000` in your browser.
   API docs are available at `http://127.0.0.1:8000/docs`.

## API Overview

| Method | Endpoint                    | Description                  |
| ------ | --------------------------- | ---------------------------- |
| POST   | `/api/register`           | Create a new student account |
| POST   | `/api/login`              | Log in and receive a token   |
| GET    | `/api/me`                 | Logged-in student's profile  |
| GET    | `/api/categories`         | List issue categories        |
| GET    | `/api/issues`             | List all issues              |
| POST   | `/api/issues`             | Create a new issue           |
| GET    | `/api/issues/{id}`        | Get issue details            |
| PATCH  | `/api/issues/{id}/status` | Update issue status          |
| GET    | `/api/stats`              | Issue counts by status       |

## Team

| Name     | Role                                    |
| -------- | --------------------------------------- |
| Pranav   | Team Lead, Backend Core, Issues API     |
| Gavesh   | Authentication, Profile                 |
| _Name_ | Frontend UI                             |
| Aastha | Status Workflow, Testing, Documentation |

## Contributing (Team Workflow)

1. Never push directly to `main`.
2. Create a branch for each feature: `feature/<short-name>`
3. Make small, meaningful commits (e.g. `add password hashing`, not `update`).
4. Push your branch and open a Pull Request.
5. At least one teammate reviews before merging.
6. Run `git pull origin main` before starting new work.

---

_CampusConnect · Code2Chill Weekly Project 01_
