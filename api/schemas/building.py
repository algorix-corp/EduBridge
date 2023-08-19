from _dependency import *


class Building(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="user.id")
    name: str
    address: str
    image_url: Optional[str] = None
