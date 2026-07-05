import sqlite3

def connect_db():
    conn=sqlite3.connect("users.db")
    return conn

def create_table():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
        firstName TEXT,
        lastName TEXT,
        PhonNumber TEXT UNIQUE ,
        email TEXT UNIQUE,
        password TEXT
        
        )
        """)


    conn.commit()
    conn.close()
    
    
