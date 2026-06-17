from sqlalchemy.orm import Session
from models.employee import Employee
from sqlalchemy import asc, desc
from sqlalchemy.orm import joinedload


def create_employee(db: Session, emp):
    db_emp = Employee(**emp.dict())
    db.add(db_emp)
    db.commit()
    db.refresh(db_emp)
    return db_emp


def get_employees(db, skip, limit, search, type, sort_by, order):
    query = db.query(Employee).options(joinedload(Employee.department))
    if search:
        query = query.filter(Employee.name.ilike(f"%{search}%"))
    if type:
        query = query.filter(Employee.type == type)
    column = getattr(Employee, sort_by, Employee.id)

    if order == "desc":
        query = query.order_by(desc(column))
    else:
        query = query.order_by(asc(column))
        total = query.count()
        data = query.offset(skip).limit(limit).all()

    return {
        "data": data,
        "total": total,
    }


def delete_employee(db: Session, emp_id: int):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()

    if not emp:
        return None

    db.delete(emp)
    db.commit()
    return emp


def update_employee(db: Session, emp_data, emp_id: int):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()

    if not emp:
        return None

    for key, value in emp_data.dict().items():
        setattr(emp, key, value)

    db.commit()
    db.refresh(emp)

    return emp
