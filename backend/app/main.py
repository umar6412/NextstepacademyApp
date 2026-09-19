import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth, users, profile, dashboard

app = FastAPI(title="NextStep Academy Backend", version="0.1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        settings.frontend_url,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "NextStep Academy API is running", "docs": "/docs", "status": "healthy"}

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "nextstep-backend", "version": "0.1.0"}

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
