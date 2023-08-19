from api.routes._imports import *
import stripe
from fastapi.responses import RedirectResponse

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

stripe.api_key = "sk_test_51LwFptLCjb1ULAaJ4f4Z9mIvpwGwrmiOY6FsMurzhHQY8EjfnKiDwAEWSe1VWz7uIX6K1qHpPpGryZZxVDnKJJr600cOV9ouvk"

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


@router.get("/{tuition_bill_id}/pay")
def pay_tuition_bill(tuition_bill_id: int):
    with Session(engine) as session:
        tuition_bill = session.query(TuitionBill).filter(TuitionBill.id == tuition_bill_id).first()
        if not tuition_bill or tuition_bill.is_paid:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TuitionBill not found")
        if tuition_bill.stripe_session_id:
            session = stripe.checkout.Session.retrieve(tuition_bill.stripe_session_id)
            if session.status is "open":
                return RedirectResponse(session.url, status_code=303)
            elif session.status is "complete":
                tuition_bill.is_paid = True
                session.commit()
                session.refresh(tuition_bill)
                return {"message": "TuitionBill paid successfully"}

    stripe_session = stripe.checkout.Session.create(
        line_items=[{
            'price_data': {
                'currency': 'krw',
                'product_data': {
                    'name': f'TuitionBill/{tuition_bill_id}/{tuition_bill.yearmonth}',
                },
                'unit_amount': tuition_bill.amount,
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url='https://ja2023api.algorix.io/tuition_bill/{CHECKOUT_SESSION_ID}/pay',
        cancel_url='https://ja2023api.algorix.io/tuition_bill/cancel',
    )

    with Session(engine) as session:
        tuition_bill.stripe_session_id = stripe_session.id
        session.commit()
        session.refresh(tuition_bill)

    return RedirectResponse(stripe_session.url, status_code=303)


@router.get("/cancel")
def cancel():
    return {"message": "Payment canceled"}


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
