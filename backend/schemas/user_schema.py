from pydantic import BaseModel
from models.user import Role


class UserCreate(BaseModel):
    username: str
    password: str
    role: Role = Role.USER


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    accessToken: str
    tokenType: str


class UserRoleUpdate(BaseModel):
    role: Role
