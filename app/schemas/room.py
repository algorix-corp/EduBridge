from typing import Optional

from sqlmodel import SQLModel, Field


class Room(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    building_id: int = Field(foreign_key="building.id")
    floor: int
    room_number: str  # 호실
    description: Optional[str] = None
    daily_price: int
