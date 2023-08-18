from typing import Optional

from sqlmodel import SQLModel, Field


class Academy(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    owner_name: str
    phone: str
    username: str
    password: str
    subject: list[str]
    description: Optional[str] = None
    image_url: Optional[str] = None
