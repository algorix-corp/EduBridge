from api.routes._imports import *

router = APIRouter(
    prefix="/tuition_bill",
    tags=["student"],
)


class TuitionBillCreate(BaseModel):
    lecture_id: int
    student_id: int
    yearmonth: str
    amount: int
    memo: Optional[str] = None


class TuitionBillUpdate(BaseModel):
    lecture_id: Optional[int]
    student_id: Optional[int]
    yearmonth: Optional[str]
    amount: Optional[int]
    memo: Optional[str] = None


@router.post("/")
def create_tuition_bill(tuition_bill: TuitionBillCreate, current_user=Depends(get_current_user)):
    if current_user.role == "admin":
        with Session(engine) as session:
            tuition_bill = TuitionBill(**tuition_bill.dict())
            session.add(tuition_bill)
            session.commit()
            session.refresh(tuition_bill)
            return tuition_bill
    elif current_user.role == "academy":
        with Session(engine) as session:
            tuition_bill = TuitionBill(**tuition_bill.dict())
            session.add(tuition_bill)
            session.commit()
            session.refresh(tuition_bill)
            return tuition_bill
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")


@router.get("/")
def get_tuition_bills(current_user=Depends(get_current_user)):
    if current_user.role == "admin":
        with Session(engine) as session:
            tuition_bills = session.query(TuitionBill).all()
            return tuition_bills
    elif current_user.role == "academy":
        with Session(engine) as session:
            tuition_bills = session.query(TuitionBill).all()
            return tuition_bills
    elif current_user.role == "student":
        with Session(engine) as session:
            tuition_bills = session.query(TuitionBill).filter(TuitionBill.student_id == current_user.id).all()
            return tuition_bills


@router.get("/{tuition_bill_id}")
def get_tuition_bill(tuition_bill_id: int, current_user=Depends(get_current_user)):
    if current_user.role == "admin":
        with Session(engine) as session:
            tuition_bill = session.query(TuitionBill).filter(TuitionBill.id == tuition_bill_id).first()
            if not tuition_bill:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TuitionBill not found")
            return tuition_bill
    elif current_user.role == "academy":
        with Session(engine) as session:
            tuition_bill = session.query(TuitionBill).filter(TuitionBill.id == tuition_bill_id).first()
            if not tuition_bill:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TuitionBill not found")
            return tuition_bill
    elif current_user.role == "student":
        with Session(engine) as session:
            tuition_bill = session.query(TuitionBill).filter(TuitionBill.id == tuition_bill_id).first()
            if not tuition_bill:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TuitionBill not found")
            return tuition_bill


@router.put("/{tuition_bill_id}")
def update_tuition_bill(tuition_bill_id: int, tuition_bill: TuitionBillUpdate, current_user=Depends(get_current_user)):
    if current_user.role == "admin":
        with Session(engine) as session:
            tuition_bill = session.query(TuitionBill).filter(TuitionBill.id == tuition_bill_id).first()
            if not tuition_bill:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TuitionBill not found")
            tuition_bill = session.query(TuitionBill).filter(TuitionBill.id == tuition_bill_id).update(
                tuition_bill.dict())
            session.commit()
            session.refresh(tuition_bill)
            return tuition_bill
    elif current_user.role == "academy":
        with Session(engine) as session:
            tuition_bill = session.query(TuitionBill).filter(TuitionBill.id == tuition_bill_id).first()
            if not tuition_bill:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TuitionBill not found")
            tuition_bill = session.query(TuitionBill).filter(TuitionBill.id == tuition_bill_id).update(
                tuition_bill.dict())
            session.commit()
            session.refresh(tuition_bill)
            return tuition_bill
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")


@router.delete("/{tuition_bill_id}")
def delete_tuition_bill(tuition_bill_id: int, current_user=Depends(get_current_user)):
    if current_user.role == "admin":
        with Session(engine) as session:
            tuition_bill = session.query(TuitionBill).filter(TuitionBill.id == tuition_bill_id).first()
            if not tuition_bill:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TuitionBill not found")
            session.delete(tuition_bill)
            session.commit()
            return {"message": "TuitionBill deleted successfully"}
    elif current_user.role == "academy":
        with Session(engine) as session:
            tuition_bill = session.query(TuitionBill).filter(TuitionBill.id == tuition_bill_id).first()
            if not tuition_bill:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TuitionBill not found")
            session.delete(tuition_bill)
            session.commit()
            return {"message": "TuitionBill deleted successfully"}
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
