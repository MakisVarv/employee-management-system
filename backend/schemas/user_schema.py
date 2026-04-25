
from pydantic import BaseModel


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
