from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.department import Department
from database.connection import get_db
from models.employee import Employee
from security.settings import get_current_user
from sqlalchemy import func

dashboard_router = APIRouter(prefix="/dashboard")


@dashboard_router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    payload: dict = Depends(get_current_user),
):
    employees = db.query(Employee).all()

    total = len(employees)
    fulltime = (
        db.query(func.count(Employee.id)).filter(Employee.type == "fulltime").scalar()
        or 0
    )

    parttime = (
        db.query(func.count(Employee.id)).filter(Employee.type == "parttime").scalar()
        or 0
    )

    managers = (
        db.query(func.count(Employee.id)).filter(Employee.type == "manager").scalar()
        or 0
    )

    total_salary = db.query(func.coalesce(func.sum(Employee.salary), 0)).scalar() or 0
    average_salary = round(total_salary / total) if total else 0

    dep_stats = (
        db.query(Department.name, func.count(Employee.id).label("total"))
        .join(Employee, Employee.department_id == Department.id)
        .group_by(Department.name)
        .all()
    )

    dep_stats = [{"department": d[0], "total": d[1]} for d in dep_stats]

    return {
        "totalEmployees": total,
        "fulltimeEmployees": fulltime,
        "parttimeEmployees": parttime,
        "managers": managers,
        "totalSalary": total_salary,
        "averageSalary": average_salary,
        "depStats": dep_stats,
    }
