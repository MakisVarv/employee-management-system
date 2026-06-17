from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from models.department import Department
from schemas.department_schema import DepartmentCreate

department_router = APIRouter(prefix="/departments")


@department_router.post("/")
def create_department(dep: DepartmentCreate, db: Session = Depends(get_db)):
    new_dep = Department(name=dep.name)
    db.add(new_dep)
    db.commit()
    db.refresh(new_dep)
    return new_dep


@department_router.get("/")
def get_departments(db: Session = Depends(get_db)):
    return db.query(Department).all()


@department_router.put("/{dep_id}")
def update(dep_id: int, dep: DepartmentCreate, db: Session = Depends(get_db)):
    db_dep = db.query(Department).filter(Department.id == dep_id).first()

    if not db_dep:
        raise HTTPException(status_code=404, detail="Department not found")

    db_dep.name = dep.name

    db.commit()
    db.refresh(db_dep)

    return db_dep


@department_router.delete("/{dep_id}")
def delete(dep_id: int, db: Session = Depends(get_db)):
    db_dep = db.query(Department).filter(Department.id == dep_id).first()

    if not db_dep:
        raise HTTPException(status_code=404, detail="Department not found")

    db.delete(db_dep)
    db.commit()

    return {"message": "Deleted"}
