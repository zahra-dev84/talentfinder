import sqlite3
import json

def connect_quiz_db():
    conn=sqlite3.connect("quiz.db")
    return conn

def encode_options(options):
    return json.dumps(options)

def connect_question_db():
    conn=connect_quiz_db()
    cursor=conn.cursor()
    cursor.execute("""
CREATE TABLE IF NOT EXISTS question(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    qusetion TEXT NOT NULL
)
    """)
    conn.commit()
    conn.close()

