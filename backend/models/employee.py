from sqlalchemy import Column, Integer, String, Float
from database.connection import Base


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
