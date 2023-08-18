from typing import Optional
from datetime import datetime

from sqlmodel import SQLModel, Field


class Admin(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    username: str
    password: str
    created_at: Optional[str] = datetime
