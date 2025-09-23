# test_dp.py
import mysql.connector

try:
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="user1234",
        database="cropcure"
    )
    print("✅ Database connected successfully!")

    cursor = db.cursor()
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    print("Tables:", tables)

except Exception as e:
    print("❌ Database connection failed:", e)

finally:
    if 'db' in locals() and db.is_connected():
        db.close()
        print("Connection closed.")