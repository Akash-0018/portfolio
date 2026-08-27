from core.database import create_tables, SessionLocal
from models.user import User
from utils.auth import get_password_hash

def seed_user():
    create_tables()
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == "Akash").first()
        if not user:
            user = User(
                username="Akash",
                email="akashcse018@gmail.com",
                hashed_password=get_password_hash("Pydev@2602!")
            )
            db.add(user)
            db.commit()
            print("Successfully created admin user in DB!")
        else:
            user.email = "akashcse018@gmail.com"
            user.hashed_password = get_password_hash("Pydev@2602!")
            db.commit()
            print("Successfully updated admin user in DB!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_user()
