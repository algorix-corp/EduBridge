from api.routes._imports import *
from api.tools.upload_image_to_s3 import upload_image_to_s3

router = APIRouter(
    prefix="/room",
    tags=["room"],
)


class RoomCreate(BaseModel):
    building_id: int
    floor: int = Field(ge=1)
    unit_name: str = Field(min_length=1)
    capacity: int = Field(ge=1)
    image_dataurl: Optional[str] = None
    description: Optional[str] = None
    daily_price: int
    grid_x: int
    grid_y: int
    is_active: bool = True


class RoomUpdate(BaseModel):
    floor: Optional[int] = Field(ge=1)
    unit_name: Optional[str] = Field(min_length=1)
    capacity: Optional[int] = Field(ge=1)
    image_dataurl: Optional[str] = None
    description: Optional[str] = None
    daily_price: Optional[int] = None
    grid_x: Optional[int] = None
    grid_y: Optional[int] = None
    is_active: Optional[bool] = True


@router.post("/")
def create_room(new_room: RoomCreate, current_user=Depends(get_current_user)):
    if current_user.role == "admin":
        with Session(engine) as session:
            room = Room(
                building_id=new_room.building_id,
                floor=new_room.floor,
                unit_name=new_room.unit_name,
                capacity=new_room.capacity,
                image_url=upload_image_to_s3(new_room.image_dataurl) if new_room.image_dataurl else None,
                description=new_room.description,
                daily_price=new_room.daily_price,
                grid_x=new_room.grid_x,
                grid_y=new_room.grid_y,
                is_active=new_room.is_active,
            )

            session.add(room)
            session.commit()
            session.refresh(room)
            return room
    elif current_user.role == "building":

        with Session(engine) as session:
            room = Room(
                building_id=new_room.building_id,
                floor=new_room.floor,
                unit_name=new_room.unit_name,
                capacity=new_room.capacity,
                image_url=upload_image_to_s3(new_room.image_dataurl) if new_room.image_dataurl else None,
                description=new_room.description,
                daily_price=new_room.daily_price,
                grid_x=new_room.grid_x,
                grid_y=new_room.grid_y,
                is_active=new_room.is_active,
            )

            session.add(room)
            session.commit()
            session.refresh(room)
            return room
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to create room.",
        )


@router.get("/")
def get_rooms(current_user=Depends(get_current_user)):
    if current_user.role == "admin":
        with Session(engine) as session:
            rooms = session.get(Room).all()
            return rooms
    elif current_user.role == "building":
        with Session(engine) as session:
            rooms = session.query(Room).filter(Room.building_id == current_user.building_id).all()
            return rooms
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access rooms.",
        )


@router.get("/")
def get_rooms(building_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        rooms = session.query(Room).filter(Room.building_id == building_id).all()
        return rooms


@router.get("/{room_id}")
def get_room(room_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        room = session.get(Room, room_id)
        return room


@router.put("/{room_id}")
def update_room(room_id: int, room_update: RoomUpdate, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        room = session.get(Room, room_id)
        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Room not found",
            )
        if current_user.role == "admin":
            room_data = room_update.dict(exclude_unset=True)
            if room_data["image_dataurl"]:
                room_data["image_url"] = upload_image_to_s3(room_data["image_dataurl"])
                del room_data["image_dataurl"]
            for key, value in room_data.items():
                setattr(room, key, value)
            session.add(room)
            session.commit()
            session.refresh(room)
            return room
        elif current_user.role == "building":
            if current_user.building_id != room.building_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You don't have permission to access this room.",
                )
            room_data = room_update.dict(exclude_unset=True)
            if room_data["image_dataurl"]:
                room_data["image_url"] = upload_image_to_s3(room_data["image_dataurl"])
                del room_data["image_dataurl"]
            for key, value in room_data.items():
                setattr(room, key, value)
            session.add(room)
            session.commit()
            session.refresh(room)
            return room
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this room.",
            )


@router.delete("/{room_id}")
def delete_room(room_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        room = session.get(Room, room_id)
        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Room not found",
            )
        if current_user.role == "admin":
            session.delete(room)
            session.commit()
            return {"message": "Room deleted successfully."}
        elif current_user.role == "building":
            if current_user.building_id != room.building_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You don't have permission to access this room.",
                )
            session.delete(room)
            session.commit()
            return {"message": "Room deleted successfully."}
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this room.",
            )
