from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import SessionLocal, engine, Base
from . import crud, schemas
from fastapi.middleware.cors import CORSMiddleware
from .models import Employee



app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # επιτρέπει React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/employees")
def create(emp: schemas.Employee, db: Session = Depends(get_db)):
    return crud.create_employee(db, emp)

@app.get("/employees")
def read(db: Session = Depends(get_db)):
    return crud.get_employees(db)

@app.delete("/employees/{emp_id}")
def delete(emp_id:int,db:Session=Depends(get_db)):
    return crud.delete_employee(db,emp_id)

@app.put("/employees/{emp_id}")
def update_employee(emp_id: int, emp: schemas.Employee, db: Session = Depends(get_db)):
    db_emp = db.query(Employee).filter(Employee.id == emp_id).first()

    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    for key, value in emp.dict().items():
        setattr(db_emp, key, value)

    db.commit()
    db.refresh(db_emp)

    return db_emp