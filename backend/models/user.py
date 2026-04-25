from sqlalchemy import Column, Integer, String, Enum
from database.connection import Base
from enum import Enum as PyEnum


class Role(str, PyEnum):
    USER = "User"
    MANAGER = "Manager"
    ADMIN = "Admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True)
    password = Column(String(100), unique=True)
    role = Column(Enum(Role), default=Role.USER)
