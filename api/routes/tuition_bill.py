from fastapi import APIRouter, Depends, HTTPException, status

from api.routes._imports import *

router = APIRouter(
    prefix="",
    tags=["student"],
)


class TuitionBillIn(BaseModel):
    lecture_id: int
    yearmonth: str
    amount: int
    memo: Optional[str] = None


@router.post("/academy/{academy_id}/student/{student_id}/tuition_bill")
def create_tuition(academy_id: int, student_id: int, tuition: TuitionBillIn,
                   current_user: dict = Depends(get_current_user)):
    if current_user.role != "academy" or current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    with Session(engine) as session:
        # check if academy belongs to current user
        academy = session.query(Academy).filter(Academy.id == academy_id).first()
        if not academy:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Academy not found")
        if academy.owner_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        student = session.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
        tuition = TuitionBill(**tuition.dict())
        session.add(tuition)
        session.commit()
        session.refresh(tuition)
        return tuition


@router.get("/academy/{academy_id}/student/{student_id}/tuition_bill")
def get_tuition(academy_id: int, student_id: int, current_user: dict = Depends(get_current_user)):
    if current_user.role != "academy" or current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    with Session(engine) as session:
        # check if academy belongs to current user
        academy = session.query(Academy).filter(Academy.id == academy_id).first()
        if not academy:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Academy not found")
        if academy.owner_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        student = session.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
        tuition = session.query(TuitionBill).filter(TuitionBill.student_id == student_id).all()
        return tuition


@router.get("/academy/{academy_id}/student/{student_id}/tuition_bill/{tuition_id}")
def get_tuition(academy_id: int, student_id: int, tuition_id: int, current_user: dict = Depends(get_current_user)):
    if current_user.role != "academy" or current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    with Session(engine) as session:
        # check if academy belongs to current user
        academy = session.query(Academy).filter(Academy.id == academy_id).first()
        if not academy:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Academy not found")
        if academy.owner_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        student = session.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
        tuition = session.query(TuitionBill).filter(TuitionBill.id == tuition_id).first()
        if not tuition:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tuition not found")
        return tuition


@router.put("/academy/{academy_id}/student/{student_id}/tuition_bill/{tuition_id}")
def update_tuition(academy_id: int, student_id: int, tuition_id: int, tuition: TuitionBillIn,
                   current_user: dict = Depends(get_current_user)):
    if current_user.role != "academy" or current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    with Session(engine) as session:
        # check if academy belongs to current user
        academy = session.query(Academy).filter(Academy.id == academy_id).first()
        if not academy:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Academy not found")
        if academy.owner_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        student = session.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
        tuition = session.query(TuitionBill).filter(TuitionBill.id == tuition_id).first()
        if not tuition:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tuition not found")
        for var, value in tuition.dict().items():
            if var == "id":
                continue
            if getattr(tuition, var) != getattr(tuition, var):
                setattr(tuition, var, value)
        session.commit()
        session.refresh(tuition)
        return tuition


@router.delete("/academy/{academy_id}/student/{student_id}/tuition_bill/{tuition_id}")
def delete_tuition(academy_id: int, student_id: int, tuition_id: int, current_user: dict = Depends(get_current_user)):
    if current_user.role != "academy" or current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    with Session(engine) as session:
        # check if academy belongs to current user
        academy = session.query(Academy).filter(Academy.id == academy_id).first()
        if not academy:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Academy not found")
        if academy.owner_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        student = session.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
        tuition = session.query(TuitionBill).filter(TuitionBill.id == tuition_id).first()
        if not tuition:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tuition not found")
        session.delete(tuition)
        session.commit()
        return {"message": "Tuition deleted successfully"}
