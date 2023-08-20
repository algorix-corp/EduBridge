from sqlalchemy import or_, and_, between

from api.routes._imports import *

router = APIRouter(
    prefix="/reservation",
    tags=["reservation"],
)


class ReservationCreate(BaseModel):
    academy_id: int
    room_id: int
    start_date: date
    end_date: date


@router.post("/")
def create_reservation(reservation_create: ReservationCreate, current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        if reservation_create.start_date > reservation_create.end_date:
            raise HTTPException(status_code=400, detail="Time traveler!")

        if current_user.role == "admin":
            overlapping_reservations = session.query(Reservation).filter(
                Reservation.room_id == reservation_create.room_id,
                and_(
                    or_(
                        # and_(Reservation.start_date <= reservation_create.start_date, Reservation.end_date >= reservation_create.start_date),
                        # and_(Reservation.start_date <= reservation_create.end_date, Reservation.end_date >= reservation_create.end_date),
                        # and_(Reservation.start_date >= reservation_create.start_date, Reservation.end_date <= reservation_create.end_date)
                        between(Reservation.start_date, reservation_create.start_date, reservation_create.end_date),
                        between(Reservation.end_date, reservation_create.start_date, reservation_create.end_date)

                    )
                )
            ).all()

            if overlapping_reservations:
                raise HTTPException(status_code=400, detail="Reservation overlaps with existing reservation")

            # check room is available
            room = session.query(Room).filter_by(id=reservation_create.room_id).first()
            if not room.available:
                raise HTTPException(status_code=400, detail="Room is not available")

            # create reservation
            new_reservation = Reservation(**reservation_create.dict())
            session.add(new_reservation)
            session.commit()
            session.refresh(new_reservation)
            return new_reservation
        elif current_user.role == "academy":
            # check user is owner of academy
            academy = session.query(Academy).filter(reservation.academy_id).first()
            if academy.owner_id != current_user.id:
                raise HTTPException(status_code=400, detail="User is not owner of academy")
            # check start_date and end_date do not overlap with existing reservations
            reservations = session.query(Reservation).filter(
                Reservation.room_id == reservation.room_id,
                or_(between(Reservation.start_date, reservation.start_date, reservation.end_date),
                    between(Reservation.end_date, reservation.start_date, reservation.end_date))

            )
            if reservations:
                raise HTTPException(status_code=400, detail="Reservation overlaps with existing reservation")
            # check room is available
            room = session.query(Room).filter(reservation.room_id).first()
            if not room.available:
                raise HTTPException(status_code=400, detail="Room is not available")
            # create reservation
            reservation = Reservation(**reservation.dict())
            session.add(reservation)
            session.commit()
            session.refresh(reservation)
            return reservation
        else:
            raise HTTPException(status_code=400, detail="User is not authorized")


@router.get("/")
def get_reservations(current_user: User = Depends(get_current_user)):
    if current_user.role == "admin":
        with Session(engine) as session:
            query = session.query(Reservation, Academy, Room).join(Academy).join(Room).all()
            return query
    elif current_user.role == "academy":
        with Session(engine) as session:
            # get academies that user own
            academies = Academy.select().where(Academy.owner_id == current_user.id)
            # get reservations that belong to academies that user own
            query = session.query(Reservation, Academy, Room).join(Academy).join(Room).filter(
                Reservation.academy_id.in_(academies)).all()
            return query
    elif current_user.role == "building":
        with Session(engine) as session:
            # get buildings that user own
            buildings = Building.select().where(Building.owner_id == current_user.id)
            # get rooms that belong to buildings that user own
            rooms = Room.select().where(Room.building_id.in_(buildings))
            # get reservations that belong to rooms that user own
            query = session.query(Reservation, Academy, Room).join(Academy).join(Room).filter(
                Reservation.room_id.in_(rooms)).all()
            return query
    else:
        raise HTTPException(status_code=400, detail="User is not authorized")
