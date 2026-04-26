from pydantic import BaseModel
from models.user import Role


class UserCreate(BaseModel):
    id: int
    username: str
    password: str
    role: str


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    accessToken: str
    tokenType: str


class UserRoleUpdate(BaseModel):
    role: Role
