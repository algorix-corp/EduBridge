from datetime import date
from typing import Optional

from sqlmodel import SQLModel, Field


class Attend(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    lecture_id: int = Field(foreign_key="lecture.id")
    student_id: int = Field(foreign_key="student.id")
    registered_at: date