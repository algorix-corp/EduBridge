import os
from datetime import datetime, timedelta

from jose import jwt
from sqlmodel import Session

from app.schemas.academy import Academy
from app.tools.database import engine


def issue_token(academy_id: int):
    with Session(engine) as session:
        academy = session.get(Academy, academy_id)
        if not academy:
            return None
        payload = {
            "academy_id": academy.id,
            "academy_name": academy.name,
            "username": academy.username,
            "image_url": academy.image_url,
            "exp": datetime.utcnow() + timedelta(days=1),
        }
        return jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm="HS256")

