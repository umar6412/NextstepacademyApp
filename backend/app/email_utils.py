"""Email utility for NextStep Academy.

Sends HTML OTP emails for password reset.
When MOCK_EMAIL=true, skips SMTP and prints the OTP to the terminal instead
(ideal for local dev / college demo without a real mail account).
"""
import smtplib
import random
import string
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from .config import settings

logger = logging.getLogger(__name__)


def generate_otp(length: int = 6) -> str:
    """Generate a cryptographically reasonable numeric OTP."""
    return "".join(random.choices(string.digits, k=length))


def _build_otp_html(otp: str) -> str:
    return f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body {{ font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #f1f5f9; margin: 0; padding: 0; }}
    .container {{ max-width: 480px; margin: 40px auto; background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }}
    .header {{ background: linear-gradient(135deg, #f59e0b, #fbbf24); padding: 32px; text-align: center; }}
    .header h1 {{ margin: 0; font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }}
    .body {{ padding: 32px; text-align: center; }}
    .otp-box {{ display: inline-block; font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #fbbf24;
                background: #0f172a; border-radius: 12px; padding: 16px 28px; border: 2px solid #f59e0b;
                margin: 24px 0; font-family: 'Courier New', monospace; }}
    .note {{ font-size: 12px; color: #94a3b8; margin-top: 16px; }}
    .footer {{ padding: 20px 32px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; font-size: 11px; color: #475569; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>NextStep Academy</h1>
    </div>
    <div class="body">
      <p style="font-size:15px; color:#cbd5e1;">You requested a password reset. Use the OTP below — it expires in <strong>15 minutes</strong>.</p>
      <div class="otp-box">{otp}</div>
      <p class="note">If you didn't request this, you can safely ignore this email.</p>
    </div>
    <div class="footer">NextStep Academy · AI-Powered Career Learning Platform</div>
  </div>
</body>
</html>
"""


def send_password_reset_otp(to_email: str, otp: str) -> None:
    """Send (or mock-print) an OTP password reset email.

    Args:
        to_email: Recipient email address.
        otp: The 6-digit OTP to send.
    """
    if settings.mock_email:
        logger.warning("MOCK EMAIL — password reset OTP for %s: %s", to_email, otp)
        print(f"\n{'='*50}")
        print(f"  [MOCK EMAIL] Password Reset OTP")
        print(f"  To      : {to_email}")
        print(f"  OTP Code: {otp}")
        print(f"  (Expires in 15 minutes)")
        print(f"{'='*50}\n")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Your NextStep Academy Password Reset Code"
    msg["From"] = settings.smtp_from
    msg["To"] = to_email

    plain_text = (
        f"Your NextStep Academy password reset code is: {otp}\n\n"
        "This code expires in 15 minutes.\n"
        "If you did not request a reset, ignore this email."
    )
    msg.attach(MIMEText(plain_text, "plain"))
    msg.attach(MIMEText(_build_otp_html(otp), "html"))

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.ehlo()
            server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.sendmail(settings.smtp_from, [to_email], msg.as_string())
        logger.info("Password reset OTP sent to %s", to_email)
    except Exception as exc:
        logger.error("Failed to send reset email to %s: %s", to_email, exc)
        raise
