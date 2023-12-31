import os

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from jose import jwt


def get_current_user(token=Depends(HTTPBearer())):
    try:
        payload = jwt.decode(token.credentials, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
