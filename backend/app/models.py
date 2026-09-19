from enum import Enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum as SqlEnum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .config import settings
from typing import Optional
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Role(str, Enum):
    STUDENT = "student"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SqlEnum(Role), default=Role.STUDENT, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    # Password-reset OTP fields
    password_reset_token = Column(String, nullable=True)
    reset_token_expires_at = Column(DateTime, nullable=True)

    profile = relationship("StudentProfile", back_populates="user", uselist=False)

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    education = Column(String, nullable=True)
    degree = Column(String, nullable=True)
    college = Column(String, nullable=True)
    graduation_year = Column(Integer, nullable=True)
    skills = Column(String, nullable=True)  # comma‑separated list
    career_interests = Column(String, nullable=True)
    resume_url = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)
    completed_fields = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")

class MentorBooking(Base):
    __tablename__ = "mentor_bookings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    mentor_name = Column(String, nullable=False)
    slot = Column(String, nullable=False)
    status = Column(String, default="CONFIRMED")
    created_at = Column(DateTime, default=datetime.utcnow)
