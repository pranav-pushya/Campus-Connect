import sqlite3
from pathlib import Path

# Path to the SQLite database file in the project root directory
BASE_DIR = Path(__file__).resolve().parent.parent
DB_FILE = BASE_DIR / "campusconnect.db"


def get_db_connection():
    """
    Creates and returns a connection to the SQLite database.
    row_factory = sqlite3.Row allows accessing columns by name like a dictionary (e.g. row['title']).
    """
    conn = sqlite3.connect(DB_FILE)
    # Enable accessing columns by column name
    conn.row_factory = sqlite3.Row
    # Enable foreign key support in SQLite
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def get_db():
    """
    FastAPI dependency that provides a database connection for a request
    and ensures it gets closed when the request is finished.
    """
    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()


def init_db():
    """
    Initializes the database by creating 'users' and 'issues' tables
    if they do not already exist.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Create users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. Create issues table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS issues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Open',
        created_by INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users (id)
    );
    """)

    conn.commit()
    conn.close()
    print("Database tables initialized successfully.")


# Allow running this file directly to initialize the database: python app/database.py
if __name__ == "__main__":
    init_db()
