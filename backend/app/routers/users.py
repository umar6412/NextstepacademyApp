"""User management router (admin only)."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, models, dependencies

router = APIRouter()

@router.get("/", response_model=list[schemas.UserOut])
def list_users(current_user: models.User = Depends(dependencies.get_current_user), db: Session = Depends(dependencies.get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    users = db.query(models.User).all()
    return users
