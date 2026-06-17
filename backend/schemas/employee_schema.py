from typing import List, Literal, Optional
from pydantic import BaseModel, Field

from schemas.department_schema import DepartmentResponse


class EmployeeCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    type: Literal["fulltime", "parttime", "manager"]
    salary: Optional[float] = Field(0, ge=0)
    hourly_rate: Optional[float] = Field(0, ge=0)
    hours: Optional[int] = Field(0, ge=0)
    bonus: Optional[float] = Field(0, ge=0)
    team_size: Optional[int] = Field(0, ge=0)
    department_id: Optional[int] = None


class EmployeeResponse(BaseModel):
    id: int
    name: str
    type: str
    salary: Optional[float] = 0
    hourly_rate: Optional[float] = 0
    hours: Optional[int] = 0
    bonus: Optional[float] = 0
    team_size: Optional[int] = 0
    department: Optional[DepartmentResponse] = None


class EmployeeListResponse(BaseModel):
    data: List[EmployeeResponse]
    total: int
