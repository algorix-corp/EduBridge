from fastapi import APIRouter, Depends, HTTPException, status

from _imports import *

router = APIRouter(
    prefix="/",
    tags=["lecture"],
)


class LectureIn(BaseModel):
    name: str
    teacher: Optional[str] = None
    description: Optional[str] = None
    start_date: date
    end_date: date


class LectureUpdate(BaseModel):
    name: Optional[str]
    teacher: Optional[str]
    description: Optional[str]
    start_date: Optional[date]
    end_date: Optional[date]


@router.post("/academy/{academy_id}/lecture")
def create_lecture(academy_id: int, lecture: LectureIn, current_user: dict = Depends(get_current_user)):
    if current_user.role != "academy" or current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    with Session(engine) as session:
        academy = session.query(Academy).filter(Academy.id == academy_id).first()
        if not academy:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Academy not found")
        lecture = Lecture(**lecture.dict(), academy_id=academy_id)
        session.add(lecture)
        session.commit()
        session.refresh(lecture)
        return lecture


@router.get("/academy/{academy_id}/lecture")
def get_lectures(academy_id: int, current_user: dict = Depends(get_current_user)):
    if current_user.role != "academy" or current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    with Session(engine) as session:
        lectures = session.query(Lecture).filter(Lecture.academy_id == academy_id).all()
        return lectures


@router.get("/academy/{academy_id}/lecture/{lecture_id}")
def get_lecture(academy_id: int, lecture_id: int, current_user: dict = Depends(get_current_user)):
    if current_user.role != "academy" or current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    with Session(engine) as session:
        lecture = session.query(Lecture).filter(Lecture.id == lecture_id).first()
        if not lecture:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lecture not found")
        return lecture


@router.put("/academy/{academy_id}/lecture/{lecture_id}")
def update_lecture(academy_id: int, lecture_id: int, lecture: LectureUpdate,
                   current_user: dict = Depends(get_current_user)):
    if current_user.role != "academy" or current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    with Session(engine) as session:
        lecture = session.query(Lecture).filter(Lecture.id == lecture_id).first()
        if not lecture:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lecture not found")
        lecture = session.query(Lecture).filter(Lecture.id == lecture_id).update(lecture.dict())
        session.commit()
        session.refresh(lecture)
        return lecture


@router.delete("/academy/{academy_id}/lecture/{lecture_id}")
def delete_lecture(academy_id: int, lecture_id: int, current_user: dict = Depends(get_current_user)):
    if current_user.role != "academy" or current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    with Session(engine) as session:
        lecture = session.query(Lecture).filter(Lecture.id == lecture_id).first()
        if not lecture:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lecture not found")
        session.delete(lecture)
        session.commit()
        return {"message": "Lecture deleted successfully"}


