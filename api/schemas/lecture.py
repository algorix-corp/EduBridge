from _dependency import *


class Lecture(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    academy_id: int = Field(foreign_key="academy.id")
    name: str
    teacher: str
    description: Optional[str] = None
    start_date: date
    end_date: date
