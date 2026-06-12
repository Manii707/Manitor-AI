from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os
import jwt
from datetime import datetime, timedelta, timezone
from database import get_db
import models

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])
security = HTTPBearer()

JWT_SECRET = os.environ.get("JWT_SECRET", "super_secret_neon_key_123")
JWT_ALGORITHM = "HS256"

class LoginRequest(BaseModel):
    username: str
    password: str

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    user = db.query(models.User).filter(models.User.name == username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    if req.username != "Manikandan" or req.password != "63798":
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    # Ensure user exists in DB for foreign key constraints
    user = db.query(models.User).filter(models.User.name == "Manikandan").first()
    if not user:
        user = models.User(
            email="money.boxx007@gmail.com", 
            name="Manikandan"
        )
        db.add(user)
        db.commit()

    payload = {
        "sub": req.username,
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    return {"access_token": token, "token_type": "bearer"}
