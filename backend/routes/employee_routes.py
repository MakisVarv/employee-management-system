from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from repositories.employee_crud import create_employee, delete_employee, get_employees
from models.employee import Employee
from schemas.employee_schema import EmployeeCreate, EmployeeResponse
from database.connection import get_db


employee_router = APIRouter()


@employee_router.post("/employees")
def create(emp: EmployeeCreate, db: Session = Depends(get_db)):
    return create_employee(db, emp)


@employee_router.get("/employees")
def read(db: Session = Depends(get_db)):
    return get_employees(db)


@employee_router.delete("/employees/{emp_id}")
def delete(emp_id: int, db: Session = Depends(get_db)):
    return delete_employee(db, emp_id)


@employee_router.get("/employees/{emp_id}", response_model=EmployeeResponse)
def get_employee(emp_id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()
    print(emp.__dict__)

    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    return emp


@employee_router.put("/employees/{emp_id}")
def update_employee(emp_id: int, emp: EmployeeCreate, db: Session = Depends(get_db)):
    db_emp = db.query(Employee).filter(Employee.id == emp_id).first()

    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    for key, value in emp.dict().items():
        setattr(db_emp, key, value)

    db.commit()
    db.refresh(db_emp)

    return db_emp
