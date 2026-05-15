from fastapi import Depends, FastAPI, HTTPException

import uvicorn
from sqlalchemy.orm import Session
from models.user import User
from schemas.user_schema import UserResponse, UserUpdate
from database.connection import engine, Base, get_db
from fastapi.middleware.cors import CORSMiddleware
from routes.employee_routes import employee_router
from routes.user_routes import user_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employee_router)
app.include_router(user_router)


@app.get("/me/{user_id}")
def get_me(user_id: int, db: Session = Depends(get_db)):
    return db.query(User).filter(User.id == user_id).first()


@app.put("/me/{user_id}")
def update_me(user_id: int, data: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in data.dict().items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)

    return user


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
