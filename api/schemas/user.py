from _dependency import *


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    username: str = Field(unique=True)
    password: str
    email: Optional[str] = Field(unique=True)
    phone: str
    role: str
    image_url: Optional[str] = None
    created_at: Optional[str] = Field(default=None)
