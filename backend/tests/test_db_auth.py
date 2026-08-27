import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import SessionLocal
from models.user import User
from utils.auth import verify_password

db = SessionLocal()
try:
    user_by_name = db.query(User).filter(User.username.ilike("Akash")).first()
    print("User by username:", user_by_name.username if user_by_name else "None", "| Email:", user_by_name.email if user_by_name else "None")
    
    user_by_email = db.query(User).filter(User.email.ilike("akashcse018@gmail.com")).first()
    print("User by email:", user_by_email.username if user_by_email else "None", "| Email:", user_by_email.email if user_by_email else "None")
    
    if user_by_name:
        is_pw_valid = verify_password("Pydev@2602!", user_by_name.hashed_password)
        print("Bcrypt password verification for 'Pydev@2602!':", is_pw_valid)
finally:
    db.close()
