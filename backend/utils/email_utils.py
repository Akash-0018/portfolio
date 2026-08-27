import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from core.config import settings

logger = logging.getLogger("uvicorn.error")

def send_contact_notification(name: str, sender_email: str, subject: str, message: str):
    """
    Sends an email notification to the admin when a contact form is submitted.
    """
    # Check if SMTP is configured
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning(
            "SMTP_USER or SMTP_PASSWORD is not set in environment. Skipping email notification."
        )
        return

    try:
        # Create message container
        msg = MIMEMultipart()
        msg["From"] = settings.SMTP_USER
        msg["To"] = settings.ADMIN_EMAIL
        msg["Subject"] = f"Portfolio Contact: {subject}"

        # Design a clean HTML body for the email
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #4A90E2; border-bottom: 2px solid #4A90E2; padding-bottom: 10px;">New Contact Message</h2>
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Email:</strong> {sender_email}</p>
                    <p><strong>Subject:</strong> {subject}</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4A90E2; margin-top: 15px; white-space: pre-wrap;">
                        {message}
                    </div>
                </div>
            </body>
        </html>
        """
        msg.attach(MIMEText(html_body, "html"))

        # Setup SMTP Connection
        logger.info(f"Connecting to SMTP server {settings.SMTP_HOST}:{settings.SMTP_PORT}...")
        
        # We start with SMTP connection. For TLS (port 587) we use starttls.
        # If it was SSL (port 465) we would use smtplib.SMTP_SSL.
        if settings.SMTP_PORT == 465:
            server = smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT)
        else:
            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
            server.starttls()
            
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_USER, settings.ADMIN_EMAIL, msg.as_string())
        server.quit()
        logger.info(f"Contact notification email sent successfully to {settings.ADMIN_EMAIL}")

    except Exception as e:
        logger.error(f"Failed to send contact notification email: {str(e)}")
