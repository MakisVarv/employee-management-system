from models.employee import Employee
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from models.department import Department
from schemas.department_schema import DepartmentCreate
from security.settings import (
    get_current_user,
    manager_or_admin_required,
    admin_required,
)

department_router = APIRouter(prefix="/departments")


@department_router.post("/")
def create_department(
    dep: DepartmentCreate,
    db: Session = Depends(get_db),
    payload: dict = Depends(manager_or_admin_required),
):
    existing_department = (
        db.query(Department).filter(Department.name == dep.name).first()
    )

    if existing_department:
        raise HTTPException(status_code=400, detail="Department already exists")
    new_dep = Department(name=dep.name)
    db.add(new_dep)
    db.commit()
    db.refresh(new_dep)
    return new_dep


@department_router.get("/")
def get_departments(
    db: Session = Depends(get_db), payload: dict = Depends(get_current_user)
):
    return db.query(Department).all()


@department_router.put("/{dep_id}")
def update(
    dep_id: int,
    dep: DepartmentCreate,
    db: Session = Depends(get_db),
    payload: dict = Depends(manager_or_admin_required),
):
    db_dep = db.query(Department).filter(Department.id == dep_id).first()

    if not db_dep:
        raise HTTPException(status_code=404, detail="Department not found")
    existing_department = (
        db.query(Department).filter(Department.name == dep.name).first()
    )

    if existing_department:
        raise HTTPException(status_code=400, detail="Department already exists")

    db_dep.name = dep.name

    db.commit()
    db.refresh(db_dep)

    return db_dep


@department_router.delete("/{dep_id}")
def delete(
    dep_id: int,
    db: Session = Depends(get_db),
    payload: dict = Depends(admin_required),
):
    employee_count = db.query(Employee).filter(Employee.department_id == dep_id).count()

    if employee_count > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete department with assigned employees",
        )
    db_dep = db.query(Department).filter(Department.id == dep_id).first()

    if not db_dep:
        raise HTTPException(status_code=404, detail="Department not found")

    db.delete(db_dep)
    db.commit()

    return {"message": "Deleted"}
