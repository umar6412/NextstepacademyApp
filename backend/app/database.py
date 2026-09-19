"""Database engine and session handling for FastAPI.
Supports PostgreSQL with automated SQLite fallback when PostgreSQL is unreachable.
"""
import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .config import settings
from .models import Base, User, StudentProfile, Role

logger = logging.getLogger("nextstep.database")

def create_db_engine():
    db_url = settings.database_url
    try:
        if "postgresql" in db_url:
            # Test postgres connection with 3-second timeout
            test_engine = create_engine(db_url, connect_args={"connect_timeout": 3}, pool_pre_ping=True)
            with test_engine.connect():
                pass
            logger.info("Connected successfully to PostgreSQL database.")
            return test_engine
    except Exception as e:
        logger.warning(f"PostgreSQL connection failed ({e}). Falling back to local SQLite database.")

    # SQLite fallback
    sqlite_url = "sqlite:///./nextstep.db"
    return create_engine(sqlite_url, connect_args={"check_same_thread": False})

engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables if they don't exist
Base.metadata.create_all(bind=engine)

# Seed default demo candidate if not present
def seed_default_data():
    import bcrypt
    db = SessionLocal()
    try:
        demo_user = db.query(User).filter(User.email == "alex.chen@nextstep.dev").first()
        if not demo_user:
            salt = bcrypt.gensalt()
            hashed_pwd = bcrypt.hashpw(b"password123", salt).decode("utf-8")
            demo_user = User(
                email="alex.chen@nextstep.dev",
                hashed_password=hashed_pwd,
                role=Role.STUDENT
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

            profile = StudentProfile(
                user_id=demo_user.id,
                name="Alex Chen",
                phone="+1 (555) 382-9104",
                education="BS Computer Science",
                degree="Bachelor of Science",
                college="State University of Technology",
                graduation_year=2025,
                skills="TypeScript, React, Node.js, Python, PostgreSQL, System Design",
                career_interests="Full Stack Software Engineer",
                completed_fields=8
            )
            db.add(profile)
            db.commit()
            logger.info("Demo user alex.chen@nextstep.dev seeded successfully.")
    except Exception as e:
        db.rollback()
        logger.warning(f"Failed to seed demo data: {e}")
    finally:
        db.close()

seed_default_data()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
