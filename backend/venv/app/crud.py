from sqlalchemy.orm import Session
from .models import Employee


def create_employee(db: Session, emp):
    db_emp = Employee(**emp.dict())
    db.add(db_emp)
    db.commit()
    db.refresh(db_emp)
    return db_emp

def get_employees(db: Session):
    return db.query(Employee).all()

def delete_employee(db: Session, id: int):
    emp = db.query(Employee).get(id)
    db.delete(emp)
    db.commit()

def update_employee(db:Session,emp_data,emp_id:int):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not emp:
        return None
    
    for  key ,value in emp_data.dict().items():
        setattr(emp,key,value)

    db.commit()
    db.refresh(emp)

    return emp


