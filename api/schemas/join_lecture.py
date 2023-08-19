from _dependency import *


class JoinLecture(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    lecture_id: int = Field(foreign_key="lecture.id")
    student_id: int = Field(foreign_key="student.id")
    created_at: Optional[str] = Field(default=None)
