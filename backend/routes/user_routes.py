
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from models.user import User
from security.settings import create_access_token, create_refresh_token, get_current_user, validate_password, verify_password
from schemas.user_schema import UserCreate, UserLogin
from database.connection import get_db
from sqlalchemy.orm import Session
from repositories.user_crud import create_user, get_user_by_username

user_router = APIRouter()


@user_router.get("/me")
def me(current_user: dict = Depends(get_current_user)):
    return current_user


@user_router.post('/register')
def register(user: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already exists!")
    validate_password(user.password)
    create_user(db, user)
    return {"message": "User created successfully"}


@user_router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(user.password, str(db_user.password)):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(
        data={"sub": str(db_user.username), "role": db_user.role})

    refresh_token = create_refresh_token({
        "sub": str(db_user.username)
    })

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
