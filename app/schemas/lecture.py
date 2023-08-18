from datetime import date
from typing import Optional

from sqlmodel import SQLModel, Field


class Lecture(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    academy_id: int = Field(foreign_key="academy.id")
    name: str
    description: Optional[str] = None
    start_at: date
    end_at: date
