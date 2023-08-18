from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlmodel import Session

from app.schemas.building import Building
from app.schemas.reservation import Reservation
from app.tools.database import engine
from app.tools.s3 import upload_image_to_s3

router = APIRouter(prefix="/building", tags=["Building"])


class BuildingIn(BaseModel):
    name: str
    address: str
    image_dataurl: Optional[str] = None


@router.post("/")
def create_building(building: BuildingIn):
    image_url = None
    if building.image_dataurl:
        image_url = upload_image_to_s3(building.image_dataurl)
    with Session(engine) as session:
        db_building = Building(name=building.name, address=building.address, image_url=image_url)
        session.add(db_building)
        session.commit()
        session.refresh(db_building)
        return db_building


@router.get("/")
def get_buildings():
    with Session(engine) as session:
        return session.query(Building).all()


@router.get("/{building_id}/stats")
def get_building_stats(building_id: int, day: int):
    if len(str(day)) != 8:
        raise HTTPException(detail="day must be 8 digits", status_code=400)
    with Session(engine) as session:
        return session.query(Reservation).get(building_id)
