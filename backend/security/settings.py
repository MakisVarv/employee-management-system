from datetime import datetime, timedelta, timezone
import os
import re
from dotenv import load_dotenv
from fastapi import Depends, HTTPException,  status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pathlib import Path
import secrets


pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)
load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_hex(32))
# Default to RS256 for stronger security
ALGORITHM = os.getenv("ALGORITHM", "RS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

TOKEN_BLACKLIST = set()


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        return verify_token(token, expected_type="access")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid or expired token")


def create_access_token(data: dict) -> str:
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire,
        "type": "access"
    })

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        days=REFRESH_TOKEN_EXPIRE_DAYS
    )

    to_encode.update({
        "exp": expire,
        "type": "refresh"
    })

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str, expected_type: str = "access") -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        token_type = payload.get("type")

        if token_type != expected_type:
            raise JWTError("Invalid token type")

        return payload

    except JWTError:
        raise ValueError("Invalid or expired token")


def revoke_token(token: str):
    TOKEN_BLACKLIST.add(token)


def admin_required(payload: dict = Depends(verify_token)) -> dict:
    if payload.get("role") != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return payload


def manager_required(payload: dict = Depends(verify_token)) -> dict:
    if payload.get("role") != "Manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return payload


def user_required(payload: dict = Depends(verify_token)) -> dict:
    if payload.get("role") != "User":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return payload


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def validate_password(password: str):
    if len(password) < 8:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Password must be at least 8 characters")

    if not re.search(r"[A-Z]", password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Password must contain at least one uppercase letter")

    if not re.search(r"[a-z]", password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Password must contain at least one lowercase letter")

    if not re.search(r"\d", password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Password must contain at least one number")

    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Password must contain at least one special character")

    if " " in password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Password cannot contain spaces")

    return True
