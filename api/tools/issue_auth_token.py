import os
from datetime import datetime, timedelta

from jose import jwt
from sqlmodel import Session

from api.schemas.user import User
from api.tools.database import engine


def issue_auth_token(user_id: int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            return None
        payload = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "image_url": user.image_url,
            "exp": datetime.utcnow() + timedelta(days=1),
        }
        return jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm="HS256")
