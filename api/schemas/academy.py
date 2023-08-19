from _dependency import *


class Academy(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="user.id")
    name: str
    phone: str
    subject: Optional[list[str]]
    information: Optional[str] = None
    image_url: Optional[str] = None
