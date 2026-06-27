import csv

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from models.department import Department
from repositories.employee_crud import create_employee, delete_employee, get_employees
from models.employee import Employee
from schemas.employee_schema import (
    EmployeeCreate,
    EmployeeListResponse,
    EmployeeResponse,
)
from database.connection import get_db
from sqlalchemy import asc, desc
import pandas as pd
from fastapi.responses import StreamingResponse
import io
from security.settings import get_current_user, manager_or_admin_required

employee_router = APIRouter(prefix="/employees")


@employee_router.post("/")
def create(
    emp: EmployeeCreate,
    db: Session = Depends(get_db),
    payload: dict = Depends(get_current_user),
):
    return create_employee(db, emp)


@employee_router.get("/", response_model=EmployeeListResponse)
def read(
    skip: int = 0,
    limit: int = 10,
    search: str = "",
    type: str = "",
    sort_by: str = "id",
    order: str = "asc",
    db: Session = Depends(get_db),
    payload: dict = Depends(get_current_user),
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
def export_employees(
    db: Session = Depends(get_db),
    payload: dict = Depends(get_current_user),
):
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


@employee_router.post("/import-csv")
async def import_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    payload: dict = Depends(manager_or_admin_required),
):
    content = await file.read()
    decoded = content.decode("utf-8")

    reader = csv.DictReader(io.StringIO(decoded))

    created = 0
    for row in reader:
        if not row.get("name") or not row.get("type"):
            continue
        dep_name = row.get("department")

        department = db.query(Department).filter(Department.name == dep_name).first()

        if not department and dep_name:
            department = Department(name=dep_name)
            db.add(department)
            db.commit()
            db.refresh(department)
            emp = Employee(
                name=row.get("name"),
                type=row.get("type"),
                salary=float(row.get("salary") or 0),
                hourly_rate=float(row.get("hourly_rate") or 0),
                hours=int(row.get("hours") or 0),
                bonus=float(row.get("bonus") or 0),
                team_size=int(row.get("team_size") or 0),
                department_id=department.id if department else None,
            )

        db.add(emp)
        created += 1

        db.commit()

    return {"message": f"{created} employees imported"}


@employee_router.delete("/{emp_id}")
def delete(
    emp_id: int,
    db: Session = Depends(get_db),
    payload: dict = Depends(manager_or_admin_required),
):
    deleted_employee = delete_employee(db, emp_id)
    if deleted_employee is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found"
        )
    return {"message": "Employee deleted successfully"}


@employee_router.get("/{emp_id}", response_model=EmployeeResponse)
def get_employee(
    emp_id: int,
    db: Session = Depends(get_db),
    payload: dict = Depends(get_current_user),
):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()

    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found",
        )

    return emp


@employee_router.put("/{emp_id}")
def update_employee(
    emp_id: int,
    emp: EmployeeCreate,
    db: Session = Depends(get_db),
    payload: dict = Depends(get_current_user),
):
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
