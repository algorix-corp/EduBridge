from _dependency import *


class Room(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    building_id: int = Field(foreign_key="building.id")
    floor: int
    unit_name: str
    capacity: int
    image_url: Optional[str] = None
    memo: Optional[str] = None
    is_active: bool = True
    price: int
    grid_x: int
    grid_y: int
