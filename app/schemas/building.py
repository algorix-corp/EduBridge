from typing import Optional

from sqlmodel import SQLModel, Field


class Building(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    address: str
    username: str
    password: str
    phone: str
    image_url: Optional[str] = None
