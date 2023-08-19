from _imports import *


class Reservation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    academy_id: int = Field(foreign_key="academy.id")
    room_id: int = Field(foreign_key="room.id")
    charge: int
    start_date: date
    end_date: date
    created_at: Optional[datetime] = Field(default=None, sa_column_kwargs={"default": "now()"})
