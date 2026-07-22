import os
import sys
from email_utils import send_contact_notification
from config import settings

print("--- Testing SMTP Mail Notification System ---")
print(f"SMTP Host: {settings.SMTP_HOST}")
print(f"SMTP Port: {settings.SMTP_PORT}")
print(f"SMTP User (Sender): {settings.SMTP_USER}")
print(f"Admin Email (Recipient): {settings.ADMIN_EMAIL}")
print("---------------------------------------------")

if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
    print("ERROR: SMTP credentials (SMTP_USER/SMTP_PASSWORD) are not loaded.")
    print("Please ensure backend/.env contains them and you are running the script from backend folder.")
    sys.exit(1)

try:
    print("Sending test email...")
    send_contact_notification(
        name="Antigravity Test Agent",
        sender_email="test-sender@example.com",
        subject="SMTP Integration Test Successful",
        message="Hello Akash,\n\nThis is a test message generated to confirm that your SMTP and credentials configuration is working correctly.\n\nBest,\nAntigravity"
    )
    print("SUCCESS: SMTP test completed. Please check your inbox (including spam folder) for the test email!")
except Exception as e:
    print(f"FAILED: SMTP test failed: {e}")

