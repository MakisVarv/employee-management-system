import os
from sqlalchemy.orm import Session

from models.user import User, Role
from security.settings import hash_password, validate_password


def seed_admin(db: Session):
    seed_enabled = os.getenv("SEED_ADMIN", "false").lower() == "true"

    if not seed_enabled:
        return

    username = os.getenv("ADMIN_USERNAME")
    password = os.getenv("ADMIN_PASSWORD")

    if not username or not password:
        raise RuntimeError(
            "SEED_ADMIN is true, but ADMIN_USERNAME or ADMIN_PASSWORD is missing"
        )

    existing_admin = db.query(User).filter(User.role == Role.ADMIN).first()

    if existing_admin:
        return

    existing_user = db.query(User).filter(User.username == username).first()

    if existing_user:
        existing_user.role = Role.ADMIN
        db.commit()
        return

    validate_password(password)

    admin = User(
        username=username,
        password=hash_password(password),
        role=Role.ADMIN,
    )

    db.add(admin)
    db.commit()
