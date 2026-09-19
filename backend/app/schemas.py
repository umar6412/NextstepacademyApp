"""Pydantic schemas for request and response bodies used in the API.
"""
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: Optional[str] = None
    user: Optional[dict] = None

class TokenData(BaseModel):
    email: Optional[EmailStr] = None
    role: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: Optional[str] = "student"
    name: Optional[str] = None
    targetRole: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    is_active: bool

    class Config:
        from_attributes = True

class ProfileBase(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    education: Optional[str] = None
    degree: Optional[str] = None
    college: Optional[str] = None
    graduation_year: Optional[int] = None
    skills: Optional[str] = None
    career_interests: Optional[str] = None
    resume_url: Optional[str] = None
    photo_url: Optional[str] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(ProfileBase):
    pass

class ProfileOut(ProfileBase):
    id: int
    user_id: int
    completed_fields: int
    updated_at: datetime

    class Config:
        from_attributes = True


# ── Password-reset schemas ────────────────────────────────────────────────────

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str = Field(..., min_length=8)
