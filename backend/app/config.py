"""Configuration settings for the FastAPI backend.

Environment variables are loaded via a .env file (or OS env).
"""
import os


class Settings:
    """Application settings — reads from environment with sensible defaults."""
    app_name: str = "NextStep Academy Backend"
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # Database
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://postgres:postgrespw@localhost:5432/nextstepdb"
    )

    # JWT
    secret_key: str = os.getenv("FASTAPI_SECRET_KEY", "supersecretkey")
    algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
    refresh_token_expire_days: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

    # Email / SMTP
    smtp_host: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
    smtp_user: str = os.getenv("SMTP_USER", "")
    smtp_password: str = os.getenv("SMTP_PASSWORD", "")
    smtp_from: str = os.getenv("SMTP_FROM", "NextStep Academy <noreply@nextstep.academy>")
    # Set MOCK_EMAIL=true in .env to skip real SMTP and print OTP to terminal
    mock_email: bool = os.getenv("MOCK_EMAIL", "true").lower() == "true"


settings = Settings()
