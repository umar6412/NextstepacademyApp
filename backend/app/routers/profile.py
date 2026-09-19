"""Profile router for viewing and updating student profile.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, models, dependencies

router = APIRouter()

@router.get("/me", response_model=schemas.ProfileOut)
def read_profile(current_user: models.User = Depends(dependencies.get_current_user), db: Session = Depends(dependencies.get_db)):
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/me", response_model=schemas.ProfileOut)
def update_profile(update: schemas.ProfileUpdate, current_user: models.User = Depends(dependencies.get_current_user), db: Session = Depends(dependencies.get_db)):
    profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    for attr, value in update.dict(exclude_unset=True).items():
        setattr(profile, attr, value)
    # calculate completed fields count
    filled = sum(1 for field in [profile.name, profile.phone, profile.education, profile.degree, profile.college, profile.graduation_year, profile.skills, profile.career_interests, profile.resume_url, profile.photo_url] if field)
    profile.completed_fields = filled
    db.commit()
    db.refresh(profile)
    return profile
