from typing import Optional

from sqlmodel import SQLModel, Field


class Student(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    academy_id: int = Field(foreign_key="academy.id")
    name: str
    phone: str
    address: str
    memo: Optional[str] = None
    image_url: Optional[str] = None
