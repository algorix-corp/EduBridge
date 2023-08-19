from typing import Optional

from sqlmodel import SQLModel, Field


class Bill(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.id")
    lecture_id: int = Field(foreign_key="lecture.id")
    academy_id: int = Field(foreign_key="academy.id")
    yearmonth: str  # YYYYMM
    amount: int
    is_paid: bool = False
    memo: Optional[str] = None
