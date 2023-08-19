from _imports import *


class JoinLecture(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    lecture_id: int = Field(foreign_key="lecture.id")
    student_id: int = Field(foreign_key="student.id")
    created_at: Optional[datetime] = Field(default=None, sa_column_kwargs={"default": "now()"})
