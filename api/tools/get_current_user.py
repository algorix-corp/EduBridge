import os

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from jose import jwt

from api.schemas.user import User
from api.tools.database import engine, Session


def get_current_user(token=Depends(HTTPBearer())):
    try:
        payload = jwt.decode(token.credentials, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        with Session(engine) as session:
            user = session.query(User).filter(User.email == payload["email"]).first()
            if not user:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
