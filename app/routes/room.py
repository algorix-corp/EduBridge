from datetime import date

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import or_, and_
from sqlmodel import Session

from app import schemas
from app.tools.database import engine

router = APIRouter(prefix="/room", tags=["Room"])


class MakeReservation(BaseModel):
    academy_id: int
    room_id: int
    start_date: date
    end_date: date


@router.post("/reservation", tags=["Reservation"])
def make_reservation(reservation_form: MakeReservation, current_academy: dict = Depends(get_current_academy)):
    academy_id = current_academy["id"]
    room_id = reservation_form.room_id
    start_date = reservation_form.start_date
    end_date = reservation_form.end_date

    with Session(engine) as session:
        # 학원 있는지
        db_academy = session.query(schemas.Academy).get(reservation_form.academy_id)
        if db_academy is None:
            raise HTTPException(status_code=404, detail="Academy Not Found")

        try:
            conflicting_reservation = session.query(schemas.Reservation).filter(
                schemas.Reservation.room_id == reservation_form.room_id,
                or_(
                    and_(
                        schemas.Reservation.start_date <= reservation_form.start_date,
                        schemas.Reservation.end_date >= reservation_form.start_date
                    ),
                    and_(
                        schemas.Reservation.start_date <= reservation_form.end_date,
                        schemas.Reservation.end_date >= reservation_form.end_date
                    ),
                    and_(
                        schemas.Reservation.start_date >= reservation_form.start_date,
                        schemas.Reservation.end_date <= reservation_form.end_date
                    )
                )
            ).first()
        except Exception as e:
            print(e)
            raise HTTPException(status_code=409, detail="Room broken.")

        if conflicting_reservation is not None:
            raise HTTPException(status_code=409, detail="Room already Occupied")
        else:
            db_reservation = schemas.Reservation(
                academy_id=academy_id,
                room_id=room_id,
                start_date=start_date,
                end_date=end_date,
            )

            session.add(db_reservation)
            session.commit()
            session.refresh(db_reservation)

    return
