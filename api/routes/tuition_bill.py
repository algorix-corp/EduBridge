import random
import string

import stripe
from fastapi.responses import RedirectResponse

from api.routes._imports import *
from api.tools.send_sms import send_sms

router = APIRouter(
    prefix="/tuition_bill",
    tags=["student"],
)


def make_random_6_char():
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(6))


# def make_short_url(url: str):
#     url = "https://t.ly/api/v1/link/shorten"
#     Bearer = "naBHqsdI8DbuogNRQxNwx9gYT0OCcG7pqoInUALpUSYOjiOE0Lf8y7qu3kOO"
#     body = {
#         "long_url": url,
#     }
#     headers = {
#         "Authorization": f"Bearer {Bearer}",
#         "Content-Type": "application/json",
#         "Accept": "application/json"
#     }
#
#     resp = requests.post(url, json=body, headers=headers)
#     return resp.text


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


@router.get("/payment_success")
def payment_success(session_code: str):
    with Session(engine) as session:
        tuition_bill = session.query(TuitionBill).filter(TuitionBill.stripe_session_id == session_code).first()
        if tuition_bill is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TuitionBill not found")
        tuition_bill.is_paid = True
        session.commit()
        session.refresh(tuition_bill)
        return RedirectResponse("https://edubridge.algorix.io/success")


@router.post("/")
def create_tuition_bill(tuition_bill: TuitionBillCreate, current_user=Depends(get_current_user)):
    if current_user.role == "admin":
        with Session(engine) as session:
            tuition_bill = TuitionBill(**tuition_bill.dict())
            session.add(tuition_bill)
            session.commit()
            session.refresh(tuition_bill)

            resp = pay_tuition_bill(tuition_bill.id)
            student = session.query(Student).filter(Student.id == tuition_bill.student_id).first()
            phone = student.parent_phone
            send_sms(phone, f"수업료 청구서가 발행되었습니다. {tuition_bill.amount}원을 결제해주세요. {resp['url']}")

            return tuition_bill
    elif current_user.role == "academy":
        with Session(engine) as session:
            tuition_bill = TuitionBill(**tuition_bill.dict())
            session.add(tuition_bill)
            session.commit()
            session.refresh(tuition_bill)

            resp = pay_tuition_bill(tuition_bill.id)
            student = session.query(Student).filter(Student.id == tuition_bill.student_id).first()
            phone = student.parent_phone
            send_sms(phone, f"수업료 청구서가 발행되었습니다. {tuition_bill.amount}원을 결제해주세요. {resp['url']}")

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
        if tuition_bill is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TuitionBill not found")
        if tuition_bill.stripe_session_id is not None and tuition_bill.stripe_session_id is not "":
            strp_session = stripe.checkout.Session.retrieve(tuition_bill.stripe_session_id)
            if strp_session.status is "complete":
                tuition_bill.is_paid = True
                session.commit()
                return {"message": "TuitionBill Already Paid"}
            else:
                return {
                    "url": strp_session["url"]
                }

    stripe_session = stripe.checkout.Session.create(
        line_items=[{
            'price_data': {
                'currency': 'krw',
                'product_data': {
                    'name': f'Tuition Bill (BILL_ID:{tuition_bill_id};YYYYMM:{tuition_bill.yearmonth})',
                },
                'unit_amount': tuition_bill.amount,
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url='https://ja2023api.algorix.io/tuition_bill/payment_success?session_code={CHECKOUT_SESSION_ID}',
        cancel_url='https://edubridge.algorix.io/cancel',
    )

    with Session(engine) as session:
        tuition_bill = session.query(TuitionBill).filter(TuitionBill.id == tuition_bill_id).first()
        tuition_bill.stripe_session_id = stripe_session.id
        session.commit()
        session.refresh(tuition_bill)

    return {
        "url": stripe_session["url"]
    }




# @router.get("/cancel")
# def cancel():
#     return {"message": "Payment canceled"}


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
