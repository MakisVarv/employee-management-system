from fastapi import FastAPI
import uvicorn
from database.connection import engine, Base
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

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
