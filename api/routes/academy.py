from fastapi import APIRouter, Depends, HTTPException, status

from api.routes._imports import *

router = APIRouter(
    prefix="/academy",
    tags=["academy"],
)


class AcademyIn(BaseModel):
    name: str
    contact: str
    subject: Optional[list[str]]
    description: Optional[str] = None
    image_url: Optional[str] = None


class AcademyUpdate(BaseModel):
    name: Optional[str]
    contact: Optional[str]
    subject: Optional[list[str]]
    description: Optional[str] = None
    image_url: Optional[str] = None


@router.post("/")
def create_academy(academy: AcademyIn, current_user: dict = Depends(get_current_user)):
    if current_user.role != "academy" or current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    with Session(engine) as session:
        academy = Academy(**academy.dict(), owner_id=current_user.id)
        session.add(academy)
        session.commit()
        session.refresh(academy)
        return academy


@router.get("/")
def get_academies(current_user: dict = Depends(get_current_user)):
    with Session(engine) as session:
        academies = session.query(Academy).filter(Academy.owner_id == current_user.id).all()
        return academies


@router.get("/{academy_id}")
def get_academy(academy_id: int, current_user: dict = Depends(get_current_user)):
    with Session(engine) as session:
        academy = session.query(Academy).filter(Academy.id == academy_id).first()
        if not academy:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Academy not found")
        return academy


@router.put("/{academy_id}")
def update_academy(academy_id: int, academy: AcademyUpdate, current_user: dict = Depends(get_current_user)):
    with Session(engine) as session:
        academy = session.query(Academy).filter(Academy.id == academy_id).first()
        if not academy:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Academy not found")
        if academy.owner_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        for key, value in academy.dict().items():
            if getattr(academy, key) != getattr(academy, key):
                setattr(academy, key, value)
        session.commit()
        session.refresh(academy)
        return academy


@router.delete("/{academy_id}")
def delete_academy(academy_id: int, current_user: dict = Depends(get_current_user)):
    with Session(engine) as session:
        academy = session.query(Academy).filter(Academy.id == academy_id).first()
        if not academy:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Academy not found")
        if academy.owner_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        session.delete(academy)
        session.commit()
        return {"message": "Academy deleted successfully"}
