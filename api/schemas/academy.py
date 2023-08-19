from _dependency import *


class Academy(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="user.id")
    name: str
    contact: str
    subject: Optional[list[str]]
    description: Optional[str] = None
    image_url: Optional[str] = None
    created_at: Optional[datetime] = Field(default=None, sa_column_kwargs={"default": "now()"})
