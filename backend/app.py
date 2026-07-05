from flask import Flask, request, jsonify, json
from flask_cors import CORS
import sqlite3
import re
from database import create_table
from database import connect_db
from question import connect_quiz_db


app = Flask(__name__)
CORS(app)

# ساخت جدول اگر وجود نداشت
create_table()


@app.route("/")
def home():
    return "Backend is running"


# ثبت نام کاربر
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    phone = data["PhonNumber"]
    if not re.match(r"^09\d{9}$",phone):
        return jsonify({
        "message":"شماره مبایل نامعتبر است"
    }),400
        
    email=data["email"]
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$",email):
            return jsonify({
                "message":"ایمیل نامعتبر است"
            }),400
            
    print("DATA FROM FRONTEND:", data)  

    try:
        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute("""
           SELECT id FROM users WHERE email=? OR PhonNumber=?
           """,(data["email"],
                data["PhonNumber"])
           
        )
        if cursor.fetchone():
            conn.close()
            return jsonify({
                "message":"ایمیل قبلا ثبت شده"
            }),400
        
        cursor.execute("""
            INSERT INTO users (
                firstName,
                lastName,
                PhonNumber,
                email,
                password
            )
            VALUES (?, ?, ?, ?, ?)
        """, (
            data.get("firstName"),
            data.get("lastName"),
            data.get("PhonNumber"),
            data.get("email"),
            data.get("password"),
          
        ))

        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        
        return jsonify({
            "message": " با موفقیت ذخیره شد 🎉",
            "id":user_id
        })

    except Exception as e:
        print("ERROR:", e)
        return jsonify({
            "message": "خطا در ذخیره اطلاعات"
        }), 500



# read
@app.route("/users", methods=["GET"])
def gey_users():
    conn=connect_db()
    conn.row_factory=sqlite3.Row
    
    cursor=conn.cursor()
    cursor.execute("SELECT * FROM users")
    
    users=cursor.fetchall()
    conn.close()
    return jsonify([dict(user) for user in users])

# delet
@app.route("/delete/<int:id>",methods=["DELETE"])
def delete_users(id):
    try:
        conn=connect_db()
        cursoe=conn.cursor()
        
        cursoe.execute("DELETE FROM users WHERE id=?",(id,))
        conn.commit()
        conn.close()
        
        return jsonify({"masseg":"کاربر حذف شد"})
    except Exception as e:
        print(f"Error:{e}")
        return jsonify({"Error":str(e)})

#update
@app.route("/update/<int:id>",methods=["PUT"])
def update_user(id):
    data=request.get_json()
    
  
    
    conn=connect_db()
    cursor=conn.cursor()
    cursor.execute(""" 
                   UPDATE users
                   SET firstName=?,lastName=?,PhonNumber=?,email=?,password=?
                   WHERE id=?
                   """,(
                        data["firstName"],
                        data["lastName"],
                        data["PhonNumber"],
                        data["email"],
                        data["password"],
                        id
                   ))
    
    conn.commit()
    conn.close()
    return jsonify({"massage":"updated"})


#login
@app.route("/login",methods=["POST"])
def login():
    
    data=request.get_json()
    email=data["email"]
    password=data["password"]
    
    conn=connect_db()
    cursor=conn.cursor()
    cursor.execute(
        "SELECT * FROM users WHERE email=? AND password=?",
        (email, password)
    )
    user=cursor.fetchone()
    conn.close()
    if user:
        return jsonify({
            "message":"ورود موفق بود",
            "id":user[0]
            
        }),200
    return jsonify({
            "message":"ایمیل با رمز عبور اشتباه است"
        }),401
  
@app.route("/user/<int:id>")
def get_user(id):

    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE id=?",
        (id,)
    )

    user = cursor.fetchone()

    conn.close()

    return jsonify({
        "id": user[0],
        "firstName": user[1],
        "lastName": user[2],
        "PhoneNumber": user[3],
        "email": user[4]
    })  


#question

@app.route("/question/<int:question_id>",methods=["GET"])
def get_question(question_id):
    conn=connect_quiz_db()
    conn.row_factory=sqlite3.Row
    cursor=conn.cursor()
    
    cursor.execute(
        "SELECT * FROM question WHERE id=?",
        (question_id,)
        
    )
    question= cursor.fetchone()
    
    
    
    if question is None:
        conn.close()
        return jsonify({"eror:":"question not found"}),
    
    cursor.execute(
        "SELECT * FROM answer WHERE question_id=?",
        (question_id,)
    )
    answers= cursor.fetchall()
    conn.close()
    return jsonify({
        "question":dict(question),
        "answers":[dict(answer)for answer in answers]
    })


#result-save
@app.route("/save-result", methods=["POST"])
def save_result():

    data = request.json

    conn = connect_quiz_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO result (userId, type, score)
        VALUES (?, ?, ?)
    """, (
        data["userId"],
        data["type"],
        json.dumps(data["score"])
    ))

    conn.commit()

    result_id = cursor.lastrowid
    conn.close()

    return jsonify({"id": result_id})

# GET RESULT
@app.route("/result/<int:result_id>")
def get_result(result_id):

    conn = connect_quiz_db()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            result.id,
            result.userId,
            result.type,
            result.score,

            personality_type.title,
            personality_type.description,
            personality_type.strengths,
            personality_type.jobs

        FROM result

        JOIN personality_type
        ON result.type = personality_type.type

        WHERE result.id = ?
    """, (result_id,))

    result = cursor.fetchone()

    conn.close()

    if result is None:
        return jsonify({"message":"Result not found"}),404

    return jsonify(dict(result))

if __name__ == "__main__":
    app.run(debug=True)