from typing import Optional
from pydantic import BaseModel


class EmployeeCreate(BaseModel):
    name: str
    type: str
    salary: Optional[float] = 0
    hourly_rate: Optional[float] = 0
    hours: Optional[int] = 0
    bonus: Optional[float] = 0
    team_size: Optional[int] = 0


class EmployeeResponse(BaseModel):
    id: int
    name: str
    type: str
    salary: Optional[float] = 0
    hourly_rate: Optional[float] = 0
    hours: Optional[int] = 0
    bonus: Optional[float] = 0
    team_size: Optional[int] = 0
