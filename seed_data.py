import sqlite3
from pathlib import Path
from app.database import init_db

# Database path
BASE_DIR = Path(__file__).resolve().parent
DB_FILE = BASE_DIR / "campusconnect.db"



def seed_data():
    init_db()
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Create demo user if it does not already exist
    cursor.execute("""
        INSERT OR IGNORE INTO users (name, email, password_hash)
        VALUES (?, ?, ?)
    """, (
        "CampusConnect Demo",
        "demo@campusconnect.com",
        "demo_password_hash"
    ))

    # Get demo user's ID
    cursor.execute(
        "SELECT id FROM users WHERE email = ?",
        ("demo@campusconnect.com",)
    )
    user = cursor.fetchone()

    if user is None:
        print("Could not create/find demo user.")
        conn.close()
        return

    user_id = user[0]

    # Sample campus issues
    issues = [
        (
            "Projector not working",
            "The projector in Classroom 101 is not turning on.",
            "Classroom",
            "Open"
        ),
        (
            "Water cooler leaking",
            "The water cooler near the cafeteria is leaking.",
            "Campus",
            "In Progress"
        ),
        (
            "Lost ID card",
            "A student ID card was found near the library.",
            "Lost & Found",
            "Open"
        ),
        (
            "Wi-Fi not working",
            "Campus Wi-Fi is not working properly in the hostel.",
            "General",
            "Resolved"
        ),
        (
            "Broken classroom chair",
            "One of the chairs in Classroom 203 is damaged.",
            "Classroom",
            "Open"
        ),
        (
            "Lights not working",
            "Two lights are not working in the corridor.",
            "Campus",
            "In Progress"
        ),
        (
            "Lost water bottle",
            "A black water bottle was found near the sports area.",
            "Lost & Found",
            "Resolved"
        ),
        (
            "AC not cooling",
            "The AC in the seminar hall is not cooling properly.",
            "General",
            "Open"
        ),
        (
            "Washroom tap leaking",
            "A tap in the ground-floor washroom is leaking.",
            "Campus",
            "Resolved"
        ),
        (
            "Whiteboard marker missing",
            "Markers are missing from Classroom 105.",
            "Classroom",
            "In Progress"
        )
    ]

    added_count = 0

    # Add only issues that don't already exist
    for title, description, category, status in issues:

        cursor.execute(
            "SELECT id FROM issues WHERE title = ?",
            (title,)
        )

        existing_issue = cursor.fetchone()

        if existing_issue is None:
            cursor.execute("""
                INSERT INTO issues
                (title, description, category, status, created_by)
                VALUES (?, ?, ?, ?, ?)
            """, (
                title,
                description,
                category,
                status,
                user_id
            ))

            added_count += 1

    conn.commit()
    conn.close()

    print(f"Seed complete. Added {added_count} new sample issues.")


if __name__ == "__main__":
    seed_data()