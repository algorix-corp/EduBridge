from api.schemas._imports import *


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True)
    password: str
    phone: str
    role: str  # admin, bd_manager, acd_manager
    image_url: Optional[str] = None
    created_at: Optional[datetime] = Field(default=None, sa_column_kwargs={"default": "now()"})
