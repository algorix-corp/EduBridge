from api.schemas._imports import *


class TuitionBill(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.id")
    lecture_id: int = Field(foreign_key="lecture.id")
    yearmonth: str  # YYYYMM
    amount: int
    is_paid: bool = False
    memo: Optional[str] = None
    created_at: Optional[datetime] = Field(default=None, sa_column_kwargs={"default": "now()"})
