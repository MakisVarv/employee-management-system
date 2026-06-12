from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from repositories.employee_crud import create_employee, delete_employee, get_employees
from models.employee import Employee
from schemas.employee_schema import EmployeeCreate, EmployeeResponse
from database.connection import get_db
from sqlalchemy import asc, desc
import pandas as pd
from fastapi.responses import StreamingResponse
import io

employee_router = APIRouter(prefix="/employees")


@employee_router.post("/")
def create(emp: EmployeeCreate, db: Session = Depends(get_db)):
    return create_employee(db, emp)


@employee_router.get("/")
def read(
    skip: int = 0,
    limit: int = 10,
    search: str = "",
    type: str = "",
    sort_by: str = "id",
    order: str = "asc",
    db: Session = Depends(get_db),
):
    return get_employees(
        db,
        skip=skip,
        limit=limit,
        search=search,
        type=type,
        sort_by=sort_by,
        order=order,
    )


@employee_router.get("/export")
def export_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()

    data = [
        {
            "ID": e.id,
            "Name": e.name,
            "Type": e.type,
            "Salary": e.salary,
            "Hourly Rate": e.hourly_rate,
            "Hours": e.hours,
            "Bonus": e.bonus,
            "Team Size": e.team_size,
        }
        for e in employees
    ]

    df = pd.DataFrame(data)

    output = io.StringIO()
    df.to_csv(output, index=False)

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=employees.csv"},
    )


@employee_router.delete("/{emp_id}")
def delete(emp_id: int, db: Session = Depends(get_db)):
    return delete_employee(db, emp_id)


@employee_router.get("/{emp_id}", response_model=EmployeeResponse)
def get_employee(emp_id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()

    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found",
        )

    return emp


@employee_router.put("/{emp_id}")
def update_employee(emp_id: int, emp: EmployeeCreate, db: Session = Depends(get_db)):
    db_emp = db.query(Employee).filter(Employee.id == emp_id).first()

    if not db_emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found",
        )

    for key, value in emp.dict().items():
        setattr(db_emp, key, value)

    db.commit()
    db.refresh(db_emp)

    return db_emp
