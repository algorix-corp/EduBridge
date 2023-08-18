from datetime import date
from typing import Optional

from sqlmodel import SQLModel, Field


class Reservation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    academy_id: int = Field(foreign_key="academy.id")
    room_id: int = Field(foreign_key="room.id")
    price: int
    start_date: date
    end_date: date
