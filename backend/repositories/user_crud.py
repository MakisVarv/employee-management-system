from sqlalchemy.orm import Session
from models.user import User
from schemas.user_schema import UserCreate, UserRoleUpdate
from security.settings import hash_password


def create_user(db: Session, user: UserCreate):
    db_user = User(username=user.username,
                   password=hash_password(user.password),
                   role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def update_role_name(db: Session, user_id, role_update: UserRoleUpdate):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    user.role = role_update.role
    db.commit()
    db.refresh(user)
    return user
