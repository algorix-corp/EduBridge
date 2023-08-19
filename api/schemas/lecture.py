from _imports import *


class Lecture(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    academy_id: int = Field(foreign_key="academy.id")
    name: str
    teacher: Optional[str] = None
    description: Optional[str] = None
    start_date: date
    end_date: date
    created_at: Optional[datetime] = Field(default=None, sa_column_kwargs={"default": "now()"})
