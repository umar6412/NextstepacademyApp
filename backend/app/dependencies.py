"""FastAPI dependencies for database session and current user retrieval.

Import these in routers:
    from ..dependencies import get_db, get_current_user
"""
from .database import get_db
from .auth import get_current_user

__all__ = ["get_db", "get_current_user"]
