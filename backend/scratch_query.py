from database import SessionLocal
from models.profile import ProfileSetting

db = SessionLocal()
try:
    p = db.query(ProfileSetting).first()
    if p:
        print(f"DB PROFILE photo_url: {p.photo_url}")
    else:
        print("No profile settings found in DB.")
finally:
    db.close()
