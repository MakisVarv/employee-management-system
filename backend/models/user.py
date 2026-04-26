from sqlalchemy import Column, Integer, String
from database.connection import Base
from enum import Enum as PyEnum
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column


class Role(str, PyEnum):
    USER = "User"
    MANAGER = "Manager"
    ADMIN = "Admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True)
    password = Column(String(100), unique=True)
    role: Mapped[Role] = mapped_column(SAEnum(Role), default=Role.USER)
