from datetime import date

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import or_, and_
from sqlmodel import Session

from app.schemas.room import Room
from app.schemas.academy import Academy
from app.schemas.reservation import Reservation

from app.tools.database import engine
from app.tools.get_current_academy import get_current_academy

router = APIRouter(prefix="/room", tags=["Room"])


class MakeReservation(BaseModel):
    academy_id: int
    room_id: int
    start_date: date
    end_date: date


@router.post("/reservation")
def make_reservation(reservation_form: MakeReservation, current_academy: dict = Depends(get_current_academy)):
    academy_id = reservation_form.academy_id
    room_id = reservation_form.room_id
    start_date = reservation_form.start_date
    end_date = reservation_form.end_date

    if start_date > end_date:
        raise HTTPException(status_code=404, detail="Time Traveler UwU!")

    with Session(engine) as session:
        # 학원 있는지
        db_academy = session.query(Academy).get(reservation_form.academy_id)
        if db_academy is None:
            raise HTTPException(status_code=404, detail="Academy Not Found")

        try:
            conflicting_reservation = session.query(Reservation).filter(
                Reservation.room_id == room_id,
                or_(
                    and_(
                        Reservation.start_date <= start_date,
                        start_date <= Reservation.end_date
                    ),
                    and_(
                        Reservation.start_date <= end_date,
                        end_date <= Reservation.end_date
                    ),
                    and_(
                        start_date <= Reservation.start_date,
                        Reservation.start_date <= end_date
                    ),
                )
            ).first()
        except Exception as e:
            print(e)
            raise HTTPException(status_code=409, detail="Room broken.")

        if conflicting_reservation is not None:
            raise HTTPException(status_code=409, detail="Room already Occupied")
        else:
            db_reservation = Reservation(
                academy_id=academy_id,
                room_id=room_id,
                start_date=start_date,
                price=30000,
                end_date=end_date,
            )

            session.add(db_reservation)
            session.commit()
            session.refresh(db_reservation)

    return "Reservation Success"


@router.get("/")
def get_rooms():
    with Session(engine) as session:
        return session.query(Room).all()
