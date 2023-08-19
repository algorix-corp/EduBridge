from _dependency import *


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    username: str = Field(unique=True)
    password: str
    phone: str
    email: Optional[str] = Field(unique=True)
    role: str  # admin, bd_manager, acd_manager
    image_url: Optional[str] = None
    created_at: Optional[datetime] = Field(default=None, sa_column_kwargs={"default": "now()"})
