from api.routes._imports import *

router = APIRouter(
    prefix="/academy",
    tags=["academy"],
)


class AcademyCreate(BaseModel):
    name: str = Field(min_length=3)
    contact: str = Field(min_length=10)
    subject: Optional[list[str]] = None
    description: Optional[str] = None
    image_dataurl: Optional[str] = None


class AcademyUpdate(BaseModel):
    name: Optional[str] = Field(min_length=3)
    contact: Optional[str] = Field(min_length=10)
    subject: Optional[list[str]] = None
    description: Optional[str] = None
    image_url: Optional[str] = None


@router.post("/")
def create_academy(new_academy: AcademyCreate, current_user=Depends(get_current_user)):
    if current_user.role != "admin" and current_user.role != "academy":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    with Session(engine) as session:
        academy = Academy(**new_academy.dict(), owner_id=current_user.id)
        session.add(academy)
        session.commit()
        session.refresh(academy)
        return {"message": "Academy created successfully", "academy": academy}


@router.get("/")
def get_academies(current_user=Depends(get_current_user)):
    if current_user.role == "admin":
        with Session(engine) as session:
            academies = session.query(Academy).all()
            return academies

    elif current_user.role == "academy":
        with Session(engine) as session:
            academies = session.query(Academy).filter(Academy.owner_id == current_user.id).all()
            return academies

    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")


@router.get("/{academy_id}")
def get_academy(academy_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        academy = session.query(Academy).filter(Academy.id == academy_id).first()
        if not academy:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Academy not found")
        return academy


@router.put("/{academy_id}")
def update_academy(academy_id: int, academy: AcademyUpdate, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        academy_db = session.query(Academy).filter(Academy.id == academy_id).first()
        if not academy_db:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Academy not found")
        if academy_db.owner_id != current_user.id and current_user.role != "admin":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        academy_db_data = academy_db.dict()
        update_data = academy.dict(exclude_unset=True)
        updated_academy = Academy(**update_data, **academy_db_data)
        session.add(updated_academy)
        session.commit()
        session.refresh(updated_academy)
        return {"message": "Academy updated successfully", "academy": updated_academy}


@router.delete("/{academy_id}")
def delete_academy(academy_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        academy = session.get(Academy, academy_id)
        if not academy:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Academy not found")
        if academy.owner_id != current_user.id and current_user.role != "admin":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        session.delete(academy)
        session.commit()
        return {"message": "Academy deleted successfully"}


@router.get("/{academy_id}/stu_bills")
def get_academy_student_bills(academy_id: int, current_user=Depends(get_current_user)):
    if current_user.role != "admin" and current_user.role != "academy":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    with Session(engine) as session:
        academy = session.query(Academy).filter(Academy.id == academy_id).first()
        if not academy:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Academy not found")

        # query lectures
        lectures = session.query(Lecture).filter(Lecture.academy_id == academy_id).all()
        lecture_ids = [lecture.id for lecture in lectures]

        # query TuitionBills
        tuition_bills = session.query(TuitionBill).filter(TuitionBill.lecture_id.in_(lecture_ids)).all()
        return tuition_bills


@router.get("/{academy_id}/students")
def get_academy_students(academy_id: int, current_user=Depends(get_current_user)):
    if current_user.role != "admin" and current_user.role != "academy":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    with Session(engine) as session:
        academy = session.query(Academy).filter(Academy.id == academy_id).first()
        if not academy:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Academy not found")

        students = session.query(Student).filter(Student.academy_id == academy_id).all()

        student_ids = [student.id for student in students]
        return student_ids
