from api.routes._imports import *

router = APIRouter(
    prefix="/building",
    tags=["building"],
)


class BuildingIn(BaseModel):
    name: str
    address: str
    description: Optional[str] = None
    image_url: Optional[str] = None


class BuildingUpdate(BaseModel):
    name: Optional[str]
    address: Optional[str]
    description: Optional[str] = None
    image_url: Optional[str] = None


@router.post("/")
def create_building(building: BuildingIn, current_user=Depends(get_current_user)):
    if current_user.role != "building" or current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    with Session(engine) as session:
        building = Building(**building.dict(), owner_id=current_user.id)
        session.add(building)
        session.commit()
        session.refresh(building)
        return building


@router.get("/")
def get_buildings(current_user=Depends(get_current_user)):
    with Session(engine) as session:
        buildings = session.query(Building).filter(Building.owner_id == current_user.id).all()
        return buildings


@router.get("/{building_id}")
def get_building(building_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        building = session.query(Building).filter(Building.id == building_id).first()
        if not building:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
        return building


@router.put("/{building_id}")
def update_building(building_id: int, building: BuildingUpdate, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        building = session.query(Building).filter(Building.id == building_id).first()
        if not building:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
        if building.owner_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        for key, value in building.dict().items():
            if value is not None:
                setattr(building, key, value)
        session.add(building)
        session.commit()
        session.refresh(building)
        return building


@router.delete("/{building_id}")
def delete_building(building_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        building = session.query(Building).filter(Building.id == building_id).first()
        if not building:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
        if building.owner_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        session.delete(building)
        session.commit()
        return {"message": "Building deleted successfully"}
