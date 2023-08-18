import bcrypt
from fastapi import Depends, APIRouter, HTTPException
from pydantic import BaseModel
from sqlmodel import Session

from app.schemas import Academy
from app.tools.database import engine
from app.tools.get_current_academy import get_current_academy
from app.tools.issue_token import issue_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/")
def auth(current_academy: dict = Depends(get_current_academy)):
    return current_academy


class AuthLogin(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(login_data: AuthLogin):
    with Session(engine) as session:
        db_academy = session.query(Academy).filter(Academy.username == login_data.username).first()
        if not db_academy:
            raise HTTPException(status_code=404, detail="Academy not found")
        if not bcrypt.checkpw(login_data.password.encode(), db_academy.password.encode()):
            raise HTTPException(status_code=401, detail="Password is incorrect")
        # return db_academy
        return {"access_token": issue_token(db_academy.id)}
