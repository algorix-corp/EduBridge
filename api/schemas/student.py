from _dependency import *


class Student(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    academy_id: int = Field(foreign_key="academy.id")
    name: str
    school: str
    grade: int
    phone: Optional[str] = None
    parent_phone: str
    address: str
    memo: Optional[str] = None
    image_url: Optional[str] = None
    created_at: Optional[datetime] = Field(default=None, sa_column_kwargs={"default": "now()"})
