from pydantic import BaseModel, EmailStr
from models.user import Role


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: Role


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    accessToken: str
    tokenType: str


class UserRoleUpdate(BaseModel):
    role: Role


class UserUpdate(BaseModel):
    username: str
    email: EmailStr
