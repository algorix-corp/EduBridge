from api.routes._imports import *

router = APIRouter(
    prefix="",
    tags=["reservation"],
)


class ReservationIn(BaseModel):
    academy_id: int
    room_id: int
    start_date: date
    end_date: date


@router.get("/building/{building_id}/reservation")
def get_building_reservations(building_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        building = session.query(Building).filter(Building.id == building_id).first()
        if not building:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
        reservations = session.query(Reservation).filter(Reservation.building_id == building_id).all()
        return reservations


@router.post("/building/{building_id}/reservation")
def create_building_reservation(building_id: int, reservation: ReservationIn,
                                current_user=Depends(get_current_user)):
    if reservation.start_date > reservation.end_date:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid date range")

    with Session(engine) as session:
        building = session.query(Building).filter(Building.id == building_id).first()
        if not building:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
        reservation = Reservation(**reservation.dict())
        # check if room reservation does not overlap with other reservations
        reservations = session.query(Reservation).filter(Reservation.room_id == reservation.room_id).all()
        for res in reservations:
            if res.start_date <= reservation.start_date <= res.end_date or \
                    res.start_date <= reservation.end_date <= res.end_date:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                    detail="Room is already reserved for this date")
        session.add(reservation)
        session.commit()
        session.refresh(reservation)
        return reservation


@router.get("/building/{building_id}/room/{room_id}/reservation")
def get_room_reservations(building_id: int, room_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        building = session.query(Building).filter(Building.id == building_id).first()
        if not building:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
        room = session.query(Room).filter(Room.id == room_id).first()
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
        reservations = session.query(Reservation).filter(Reservation.room_id == room_id).all()
        return reservations


@router.post("/building/{building_id}/room/{room_id}/reservation")
def create_room_reservation(building_id: int, room_id: int, reservation: ReservationIn,
                            current_user=Depends(get_current_user)):
    if reservation.start_date > reservation.end_date:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid date range")

    with Session(engine) as session:
        building = session.query(Building).filter(Building.id == building_id).first()
        if not building:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
        room = session.query(Room).filter(Room.id == room_id).first()
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
        reservation = Reservation(**reservation.dict())
        # check if room reservation does not overlap with other reservations
        reservations = session.query(Reservation).filter(Reservation.room_id == room_id).all()
        for res in reservations:
            if res.start_date <= reservation.start_date <= res.end_date or \
                    res.start_date <= reservation.end_date <= res.end_date:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                    detail="Room is already reserved for this date")
        session.add(reservation)
        session.commit()
        session.refresh(reservation)
        return reservation


@router.get("/building/{building_id}/room/{room_id}/reservation/{reservation_id}")
def get_reservation(building_id: int, room_id: int, reservation_id: int,
                    current_user=Depends(get_current_user)):
    with Session(engine) as session:
        building = session.query(Building).filter(Building.id == building_id).first()
        if not building:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
        room = session.query(Room).filter(Room.id == room_id).first()
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
        reservation = session.query(Reservation).filter(Reservation.id == reservation_id).first()
        if not reservation:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")
        return reservation


@router.put("/building/{building_id}/room/{room_id}/reservation/{reservation_id}")
def update_reservation(building_id: int, room_id: int, reservation_id: int, reservation: ReservationIn,
                       current_user=Depends(get_current_user)):
    if reservation.start_date > reservation.end_date:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid date range")

    with Session(engine) as session:
        building = session.query(Building).filter(Building.id == building_id).first()
        if not building:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
        room = session.query(Room).filter(Room.id == room_id).first()
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
        reservation = session.query(Reservation).filter(Reservation.id == reservation_id).first()
        if not reservation:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")
        reservation.academy_id = reservation.academy_id
        reservation.room_id = reservation.room_id
        reservation.start_date = reservation.start_date
        reservation.end_date = reservation.end_date
        session.commit()
        session.refresh(reservation)
        return reservation


@router.delete("/building/{building_id}/room/{room_id}/reservation/{reservation_id}")
def delete_reservation(building_id: int, room_id: int, reservation_id: int,
                       current_user=Depends(get_current_user)):
    with Session(engine) as session:
        building = session.query(Building).filter(Building.id == building_id).first()
        if not building:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
        room = session.query(Room).filter(Room.id == room_id).first()
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
        reservation = session.query(Reservation).filter(Reservation.id == reservation_id).first()
        if not reservation:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")
        session.delete(reservation)
        session.commit()
        return {"message": "Reservation deleted successfully"}
