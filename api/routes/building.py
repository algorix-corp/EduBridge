from api.routes._imports import *

router = APIRouter(
    prefix="/building",
    tags=["building"],
)


class BuildingCreate(BaseModel):
    name: str = Field(min_length=3)
    address: str = Field(min_length=3)
    description: Optional[str] = None
    image_url: Optional[str] = None


class BuildingUpdate(BaseModel):
    name: Optional[str] = Field(min_length=3)
    address: Optional[str] = Field(min_length=3)
    description: Optional[str] = None
    image_url: Optional[str] = None


@router.post("/")
def create_building(building: BuildingCreate, current_user=Depends(get_current_user)):
    if current_user.role != "admin" and current_user.role != "building":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    with Session(engine) as session:
        building = Building(**building.dict(), owner_id=current_user.id)
        session.add(building)
        session.commit()
        session.refresh(building)
        return {"message": "Building created successfully", "building": building}


@router.get("/")
def get_buildings(current_user=Depends(get_current_user)):
    if current_user.role == "admin":
        with Session(engine) as session:
            buildings = session.query(Building).all()
            return buildings

    elif current_user.role == "building":
        with Session(engine) as session:
            buildings = session.query(Building).filter(Building.owner_id == current_user.id).all()
            return buildings

    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")


@router.get("/{building_id}")
def get_building(building_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        building = session.get(Building, building_id)
        if not building:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
        return building


@router.put("/{building_id}")
def update_building(building_id: int, new_building: BuildingUpdate, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        building = session.get(Building, building_id)
        if not building:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
        if building.owner_id != current_user.id and current_user.role != "admin":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        updated_building = Building(**new_building.dict())
        session.merge(updated_building)
        session.commit()
        return {"message": "Building updated successfully", "building": updated_building}


@router.delete("/{building_id}")
def delete_building(building_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        building = session.query(Building).filter(Building.id == building_id).first()
        if not building:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
        if building.owner_id != current_user.id and current_user.role != "admin":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        session.delete(building)
        session.commit()
        return {"message": "Building deleted successfully"}
