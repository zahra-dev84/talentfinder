import sqlite3

conn = sqlite3.connect("quiz.db")
cursor = conn.cursor()

# اول جواب‌ها حذف می‌شوند
cursor.execute("DELETE FROM answer")

# بعد سؤال‌ها
cursor.execute("DELETE FROM question")

conn.commit()
conn.close()

print("همه سوالات و جواب‌ها حذف شدند.")