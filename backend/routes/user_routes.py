from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from models.user import User
from security.settings import (
    admin_required,
    create_access_token,
    create_refresh_token,
    manager_required,
    user_required,
    validate_password,
    verify_password,
)
from schemas.user_schema import UserCreate, UserLogin, UserRoleUpdate
from database.connection import get_db
from sqlalchemy.orm import Session
from repositories.user_crud import create_user, get_user_by_username, update_role_name

user_router = APIRouter()


@user_router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_username(db, user.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists!"
        )
    validate_password(user.password)
    create_user(db, user)
    return {"message": "User created successfully"}


@user_router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials"
        )

    if not verify_password(user.password, str(db_user.password)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials"
        )

    access_token = create_access_token(
        data={"sub": str(db_user.username), "role": db_user.role}
    )

    refresh_token = create_refresh_token({"sub": str(db_user.username)})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "role": db_user.role,
    }


@user_router.get("/user-dash")
async def get_User(payload: dict = Depends(user_required)):
    try:
        return {"sub": payload.get("sub")}
    except HTTPException as ex:
        raise ex
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@user_router.get("/manager-dash")
async def get_Manager(payload: dict = Depends(manager_required)):
    try:
        return {"sub": payload.get("sub")}
    except HTTPException as ex:
        raise ex
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@user_router.get("/admin-dash")
async def get_Admin(payload: dict = Depends(admin_required)):
    try:
        return {"sub": payload.get("sub")}
    except HTTPException as ex:
        raise ex
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@user_router.put("/set-role")
async def set_UserRole(
    user_id: int,
    role_update: UserRoleUpdate,
    db: Session = Depends(get_db),
    payload: dict = Depends(admin_required),
):
    try:
        user = update_role_name(db, user_id, role_update)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User Not Found"
            )
    except HTTPException as ex:
        raise ex
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
