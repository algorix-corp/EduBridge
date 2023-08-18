from typing import Optional

import bcrypt
from fastapi import APIRouter
from pydantic import BaseModel
from sqlmodel import Session

from app.schemas.academy import Academy
from app.tools.database import engine
from app.tools.s3 import upload_image_to_s3

router = APIRouter(prefix="/academy", tags=["Academy"])


class AcademyIn(BaseModel):
    name: str
    owner_name: str
    phone: str
    username: str
    password: str  # hash it
    subject: list[str]
    description: Optional[str] = None
    image_dataurl: Optional[str] = None


@router.post("/")
def create_academy(academy: AcademyIn):
    image_url = None
    if academy.image_dataurl:
        image_url = upload_image_to_s3(academy.image_dataurl)
    with Session(engine) as session:
        db_academy = Academy(
            name=academy.name,
            owner_name=academy.owner_name,
            phone=academy.phone,
            username=academy.username,
            password=bcrypt.hashpw(academy.password.encode(), bcrypt.gensalt()).decode(),
            subject=academy.subject,
            description=academy.description,
            image_url=image_url,
        )
        session.add(db_academy)
        session.commit()
        session.refresh(db_academy)
        return "Create-Academy Success"


@router.get("/")
def get_academies():
    with Session(engine) as session:
        return session.query(Academy).all()
