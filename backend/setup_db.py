import sqlite3

conn = sqlite3.connect("quiz.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS question(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS answer(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    category TEXT NOT NULL,
    FOREIGN KEY (question_id) REFERENCES question(id)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS result (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    type TEXT,
    score TEXT
)
""")


cursor.execute("""
CREATE TABLE IF NOT EXISTS personality_type(
    type TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    strengths TEXT NOT NULL,
    jobs TEXT NOT NULL
)
""")

conn.commit()
conn.close()

print("database created :)")