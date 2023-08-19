from jose import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from api.tools.database import engine, Session
from api.schemas.user import User

import api.tools.env
import os


def get_current_user(token=Depends(HTTPBearer())):
    try:
        payload = jwt.decode(token.credentials, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        with Session(engine) as session:
            # user = session.get(User, payload.email)
            user = session.query(User).filter(User.email == payload["email"]).first()
            if not user:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return payload
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
