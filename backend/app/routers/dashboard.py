"""Dashboard router providing live telemetry, progression, benchmarks,
and mentor booking endpoints for NextStep Academy.
"""
from typing import Optional, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .. import models, dependencies

router = APIRouter()

class MentorBookingRequest(BaseModel):
    mentor_name: str
    slot: str
    notes: Optional[str] = None

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(dependencies.get_db),
):
    """Return comprehensive live telemetry for the dev-terminal dashboard."""
    # Look up candidate profile if available
    profile = db.query(models.StudentProfile).first()
    candidate_name = profile.name if profile and profile.name else "Alex Chen"
    target_role = profile.career_interests if profile and profile.career_interests else "Full Stack Engineer (L4)"

    return {
        "status": "ONLINE",
        "backend_version": "0.1.0",
        "timestamp": datetime.utcnow().isoformat(),
        "user": {
            "name": candidate_name,
            "targetRole": target_role,
            "level": 14,
            "levelTitle": "Senior Candidate Track",
            "currentXP": 8450,
            "nextLevelXP": 10000,
            "xpToNext": 1550,
            "xpProgressPercent": 84.5,
            "streakDays": 12,
            "xpMultiplier": 1.5,
            "tasksToday": 3,
            "totalTasksToday": 5,
            "syllabusCompletionPercent": 68,
            "aiMockScore": 8.8,
            "aiMockMax": 10.0,
            "verifiedJobMatchesCount": 14
        },
        "badges": [
            {"id": "b-1", "label": "7-DAY STREAK", "type": "violet"},
            {"id": "b-2", "label": "50 PROBLEMS", "type": "mint"},
            {"id": "b-3", "label": "MOCK-READY", "type": "amber"}
        ],
        "skills": [
            {"skill": "DSA", "user": 88, "target": 85},
            {"skill": "System Design", "user": 76, "target": 85},
            {"skill": "Frontend", "user": 92, "target": 80},
            {"skill": "Backend", "user": 84, "target": 85},
            {"skill": "DevOps", "user": 65, "target": 75}
        ],
        "companies": [
            {
                "name": "TCS",
                "role": "Digital Systems Engineer",
                "score": 82,
                "status": "TIER-1 READY",
                "compensation": "₹9.5 - 12 LPA",
                "color": "#10B981"
            },
            {
                "name": "Zoho",
                "role": "Member of Technical Staff",
                "score": 76,
                "status": "INTERVIEW READY",
                "compensation": "₹8.5 - 11 LPA",
                "color": "#F59E0B"
            },
            {
                "name": "Amazon",
                "role": "Software Dev Engineer (SDE-1)",
                "score": 88,
                "status": "HIGH MATCH",
                "compensation": "₹28 - 34 LPA",
                "color": "#8B5CF6"
            },
            {
                "name": "Infosys",
                "role": "Specialist Programmer",
                "score": 91,
                "status": "OFFER READY",
                "compensation": "₹10 - 14 LPA",
                "color": "#10B981"
            }
        ],
        "leaderboard": [
            {"rank": 1, "initials": "AK", "name": "Alex Kumar", "xp": 14820, "delta": 2},
            {"rank": 2, "initials": "SC", "name": "Sarah Chen", "xp": 13950, "delta": 1},
            {"rank": 3, "initials": "DR", "name": "Dev R.", "xp": 12400, "delta": -1},
            {"rank": 4, "initials": "MP", "name": "Maya Patel", "xp": 11880, "delta": 0},
            {"rank": 5, "initials": "JW", "name": "Jason Wu", "xp": 10920, "delta": 3},
            {"rank": 7, "initials": "CU", "name": f"{candidate_name} (You)", "xp": 8450, "delta": 4, "isCurrentUser": True}
        ],
        "mentors": [
            {
                "id": "m-1",
                "initials": "RG",
                "name": "Rahul Gupta",
                "role": "Staff SRE",
                "company": "Google",
                "tags": ["System Design", "Go", "K8s"],
                "status": "ONLINE",
                "statusColor": "#10B981",
                "action": "Book slot"
            },
            {
                "id": "m-2",
                "initials": "PK",
                "name": "Priya Kapoor",
                "role": "Sr. Frontend Architect",
                "company": "Zoho",
                "tags": ["React", "TypeScript", "WebPerf"],
                "status": "SLOTS TODAY",
                "statusColor": "#F59E0B",
                "action": "Book slot"
            },
            {
                "id": "p-3",
                "initials": "AL",
                "name": "Alex Ling",
                "role": "Algorithms Peer (Top 1%)",
                "company": "Peer Mentor",
                "tags": ["DSA", "Graph/DP", "Mock"],
                "status": "PEER AVAILABLE",
                "statusColor": "#8B5CF6",
                "action": "Message"
            }
        ]
    }

@router.post("/book-mentor")
def book_mentor_slot(
    payload: MentorBookingRequest,
    db: Session = Depends(dependencies.get_db),
):
    """Record a booked mentor session in the backend database."""
    booking = models.MentorBooking(
        mentor_name=payload.mentor_name,
        slot=payload.slot,
        status="CONFIRMED"
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    return {
        "success": True,
        "booking_id": booking.id,
        "mentor_name": booking.mentor_name,
        "slot": booking.slot,
        "status": booking.status,
        "message": f"Slot successfully confirmed with {booking.mentor_name} at {booking.slot}!"
    }
