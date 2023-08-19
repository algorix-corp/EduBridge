from api.routes._imports import *
from api.routes.reservation import ReservationIn

router = APIRouter(
    prefix="",
    tags=["room"],
)


class RoomIn(BaseModel):
    floor: int
    unit_name: str
    capacity: int
    image_url: Optional[str] = None
    description: Optional[str] = None
    daily_price: int
    grid_x: int
    grid_y: int
    is_active: bool = True


class RoomUpdate(BaseModel):
    floor: Optional[int]
    unit_name: Optional[str]
    capacity: Optional[int]
    image_url: Optional[str] = None
    description: Optional[str] = None
    daily_price: Optional[int]
    grid_x: Optional[int]
    grid_y: Optional[int]
    is_active: Optional[bool] = True


@router.post("/building/{building_id}/room")
def create_room(building_id: int, room: RoomIn, current_user=Depends(get_current_user)):
    if current_user.role != "building" or current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    with Session(engine) as session:
        building = session.query(Building).filter(Building.id == building_id).first()
        if not building:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
        room = Room(**room.dict(), building_id=building_id)
        session.add(room)
        session.commit()
        session.refresh(room)
        return room


@router.get("/building/{building_id}/room")
def get_rooms(building_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        rooms = session.query(Room).filter(Room.building_id == building_id).all()
        return rooms


@router.get("/building/{building_id}/room/{room_id}")
def get_room(building_id: int, room_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        room = session.query(Room).filter(Room.id == room_id).first()
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
        return room


@router.put("/building/{building_id}/room/{room_id}")
def update_room(building_id: int, room_id: int, room: RoomUpdate, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        room = session.query(Room).filter(Room.id == room_id).first()
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
        if room.building_id != building_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        for key, value in room.dict().items():
            if value is not None:
                setattr(room, key, value)
        session.commit()
        session.refresh(room)
        return room


@router.delete("/building/{building_id}/room/{room_id}")
def delete_room(building_id: int, room_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        room = session.query(Room).filter(Room.id == room_id).first()
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
        if room.building_id != building_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        session.delete(room)
        session.commit()
        return {"message": "Room deleted successfully"}


@router.get("/room/{room_id}/reservation")
def get_room_reservations(room_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        room = session.query(Room).filter(Room.id == room_id).first()
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
        reservations = session.query(Reservation).filter(Reservation.room_id == room_id).all()
        return reservations


@router.get("/room/{room_id}/reservation/{reservation_id}")
def get_room_reservation(room_id: int, reservation_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        room = session.query(Room).filter(Room.id == room_id).first()
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
        reservation = session.query(Reservation).filter(Reservation.id == reservation_id).first()
        if not reservation:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")
        return reservation


@router.post("/room/{room_id}/reservation")
def create_room_reservation(room_id: int, reservation: ReservationIn, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        room = session.query(Room).filter(Room.id == room_id).first()
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
        reservation = Reservation(**reservation.dict(), room_id=room_id)
        session.add(reservation)
        session.commit()
        session.refresh(reservation)
        return reservation


@router.put("/room/{room_id}/reservation/{reservation_id}")
def update_room_reservation(room_id: int, reservation_id: int, reservation: ReservationIn,
                            current_user=Depends(get_current_user)):
    with Session(engine) as session:
        room = session.query(Room).filter(Room.id == room_id).first()
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
        reservation = session.query(Reservation).filter(Reservation.id == reservation_id).first()
        if not reservation:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")
        for key, value in reservation.dict().items():
            if value is not None:
                setattr(reservation, key, value)
        session.commit()
        session.refresh(reservation)
        return reservation


@router.delete("/room/{room_id}/reservation/{reservation_id}")
def delete_room_reservation(room_id: int, reservation_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        room = session.query(Room).filter(Room.id == room_id).first()
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
        reservation = session.query(Reservation).filter(Reservation.id == reservation_id).first()
        if not reservation:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")
        session.delete(reservation)
        session.commit()
        return {"message": "Reservation deleted successfully"}
