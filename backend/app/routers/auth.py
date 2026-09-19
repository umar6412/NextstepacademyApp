"""Authentication router providing registration, login, and password-reset endpoints."""
import hashlib
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, models, auth, dependencies
from ..email_utils import generate_otp, send_password_reset_otp

router = APIRouter()

# ── OTP expiry window ─────────────────────────────────────────────────────────
OTP_EXPIRY_MINUTES = 15


def _hash_otp(otp: str) -> str:
    """SHA-256 hash the OTP before storing so raw digits aren't in the DB."""
    return hashlib.sha256(otp.encode()).hexdigest()


# ── Registration ──────────────────────────────────────────────────────────────

@router.post("/register", response_model=schemas.Token)
def register(user_in: schemas.UserCreate, db: Session = Depends(dependencies.get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user_in.password)
    user = models.User(email=user_in.email, hashed_password=hashed_password, role=user_in.role or "student")
    db.add(user)
    db.commit()
    db.refresh(user)

    # create profile with optional name and career interests
    profile = models.StudentProfile(
        user_id=user.id,
        name=user_in.name or user_in.email.split("@")[0],
        career_interests=user_in.targetRole or "Full Stack Developer",
        completed_fields=2 if user_in.name else 1
    )
    db.add(profile)
    db.commit()

    access_token = auth.create_access_token({"sub": user.email, "role": user.role})
    refresh_token = auth.create_refresh_token({"sub": user.email, "role": user.role})
    user_data = {
        "id": str(user.id),
        "email": user.email,
        "name": profile.name,
        "role": "STUDENT" if user.role == "student" else "ADMIN",
        "targetRole": profile.career_interests,
        "progressPercent": 20,
    }
    return schemas.Token(access_token=access_token, refresh_token=refresh_token, user=user_data)


# ── Login ─────────────────────────────────────────────────────────────────────

@router.post("/login", response_model=schemas.Token)
def login(form_data: schemas.UserLogin, db: Session = Depends(dependencies.get_db)):
    user = auth.authenticate_user(db, form_data.email, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    access_token = auth.create_access_token({"sub": user.email, "role": user.role})
    refresh_token = auth.create_refresh_token({"sub": user.email, "role": user.role})
    profile = user.profile
    user_data = {
        "id": str(user.id),
        "email": user.email,
        "name": profile.name if profile and profile.name else user.email.split("@")[0],
        "role": "STUDENT" if user.role == "student" else "ADMIN",
        "targetRole": profile.career_interests if profile and profile.career_interests else "Full Stack Software Engineer",
        "progressPercent": 78,
    }
    return schemas.Token(access_token=access_token, refresh_token=refresh_token, user=user_data)


# ── Forgot Password — Step 1: request OTP ────────────────────────────────────

@router.post("/forgot-password", status_code=200)
def forgot_password(
    payload: schemas.ForgotPasswordRequest,
    db: Session = Depends(dependencies.get_db),
):
    """Generate a 6-digit OTP, store its hash, and email it to the user.

    Always returns HTTP 200 (even if the email isn't found) to avoid
    leaking whether an account exists.
    """
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if user:
        otp = generate_otp()
        user.password_reset_token = _hash_otp(otp)
        user.reset_token_expires_at = datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)
        db.commit()
        try:
            send_password_reset_otp(payload.email, otp)
        except Exception:
            # Don't expose SMTP errors to the client; backend log has the detail
            pass
    return {"message": "If that email is registered, an OTP has been sent."}


# ── Reset Password — Step 2: verify OTP and set new password ─────────────────

@router.post("/reset-password", status_code=200)
def reset_password(
    payload: schemas.ResetPasswordRequest,
    db: Session = Depends(dependencies.get_db),
):
    """Verify OTP and update the user's password."""
    user = db.query(models.User).filter(models.User.email == payload.email).first()

    invalid_exc = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid or expired OTP. Please request a new one.",
    )

    if not user or not user.password_reset_token or not user.reset_token_expires_at:
        raise invalid_exc

    if datetime.utcnow() > user.reset_token_expires_at:
        # Clear expired token
        user.password_reset_token = None
        user.reset_token_expires_at = None
        db.commit()
        raise invalid_exc

    if user.password_reset_token != _hash_otp(payload.otp):
        raise invalid_exc

    # All checks passed — update password and clear reset fields
    user.hashed_password = auth.get_password_hash(payload.new_password)
    user.password_reset_token = None
    user.reset_token_expires_at = None
    db.commit()

    return {"message": "Password updated successfully. You can now sign in."}
