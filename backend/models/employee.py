from sqlalchemy import Column, Integer, String, Float
from database.connection import Base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    type = Column(String(50))
    salary = Column(Float)
    hourly_rate = Column(Float)
    hours = Column(Integer)
    bonus = Column(Float)
    team_size = Column(Integer)
    department_id = Column(Integer, ForeignKey("departments.id"))
    department = relationship("Department")
