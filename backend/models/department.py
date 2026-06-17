from sqlalchemy import Column, Integer, String
from database.connection import Base
from sqlalchemy.orm import relationship


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True)
    employees = relationship("Employee", back_populates="department")
