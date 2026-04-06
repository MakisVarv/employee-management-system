from pydantic import BaseModel

class Employee(BaseModel):
    name: str
    type: str
    salary: float = 0
    hourly_rate: float = 0
    hours: int = 0
    bonus: float = 0
    team_size: int = 0

class EmployeeResponse(Employee):
    id: int

    class Config:
        orm_mode = True