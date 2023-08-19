from typing import Optional

import bcrypt
from fastapi import APIRouter
from pydantic import BaseModel
from sqlmodel import Session

from app.schemas.academy import Academy
from app.tools.database import engine
from app.tools.s3 import upload_image_to_s3

router = APIRouter(prefix="/academy", tags=["Academy"])


class AcademyIn(BaseModel):
    name: str
    owner_name: str
    phone: str
    username: str
    password: str  # hash it
    subject: list[str]
    description: Optional[str] = None
    image_dataurl: Optional[str] = None


@router.post("/")
def create_academy(academy: AcademyIn):
    image_url = None
    if academy.image_dataurl:
        image_url = upload_image_to_s3(academy.image_dataurl)
    with Session(engine) as session:
        db_academy = Academy(
            name=academy.name,
            owner_name=academy.owner_name,
            phone=academy.phone,
            username=academy.username,
            password=bcrypt.hashpw(academy.password.encode(), bcrypt.gensalt()).decode(),
            subject=academy.subject,
            description=academy.description,
            image_url=image_url,
        )
        session.add(db_academy)
        session.commit()
        session.refresh(db_academy)
        return "Create-Academy Success"


@router.get("/")
def get_academies():
    with Session(engine) as session:
        return session.query(Academy).all()


class StudentIn(BaseModel):
    name: str
    phone: str
    address: str
    memo: Optional[str] = None
    image_dataurl: Optional[str] = None


@router.post("/student")
def add_student(student: StudentIn, academy_id: Depends(get_current_academy)):
    image_url = None
    if student.image_dataurl:
        image_url = upload_image_to_s3(student.image_dataurl)
    with Session(engine) as session:
        db_student = Student(
            name=student.name,
            phone=student.phone,
            academy_id=academy_id,
            address=student.address,
            memo=student.memo,
            image_url=image_url,
        )
        session.add(db_student)
        session.commit()
        session.refresh(db_student)
        return db_studnet.id


@router.get("/student")
def get_student(student_id: int, academy_id: Depends(get_current_academy)):
    with Session(engine) as session:
        return session.query(Student).get(student_id, academy_id)


@router.delete("/student")
def delete_student(student_id: int, academy_id: Depends(get_current_academy)):
    with Session(engine) as session:
        session.query(Student).delete(student_id, academy_id)
        session.commit()
        return


@router.put("/student")
def update_student(student_id: int, student: StudentIn, academy_id: Depends(get_current_academy)):
    image_url = None
    if student.image_dataurl:
        image_url = upload_image_to_s3(student.image_dataurl)
    with Session(engine) as session:
        db_student = session.query(Student).get(student_id, academy_id)
        db_student.name = student.name
        db_student.phone = student.phone
        db_student.address = student.address
        db_student.memo = student.memo
        db_student.image_url = image_url
        session.commit()
        session.refresh(db_student)
        return db_student


class LectureIn(BaseModel):
    name: str
    description: Optional[str] = None
    start_at: date
    end_at: date


@router.post("/lecture")
def add_lecture(lecture: LectureIn, academy_id: Depends(get_current_academy)):
    with Session(engine) as session:
        db_lecture = Lecture(
            academy_id=academy_id,
            name=lecture.name,
            description=lecture.description,
            start_at=lecture.start_at,
            end_at=lecture.end_at,
        )
        session.add(db_lecture)
        session.commit()
        session.refresh(db_lecture)
        return db_lecture.id


@router.get("/lecture")
def get_lecture(lecture_id: int, academy_id: Depends(get_current_academy)):
    with Session(engine) as session:
        return session.query(Lecture).get(lecture_id, academy_id)


@router.delete("/lecture")
def delete_lecture(lecture_id: int, academy_id: Depends(get_current_academy)):
    # check if academy_id is correct
    with Session(engine) as session:
        # queryy lectur
        data = session.query(Lecture).get(lecture_id, academy_id)
        session.query(Lecture).delete(lecture_id)
        session.commit()
        return


@router.put("/lecture")
def update_lecture(lecture_id: int, lecture: LectureIn, academy_id: Depends(get_current_academy)):
    with Session(engine) as session:
        db_lecture = session.query(Lecture).get(lecture_id, academy_id)
        db_lecture.name = lecture.name
        db_lecture.description = lecture.description
        db_lecture.start_at = lecture.start_at
        db_lecture.end_at = lecture.end_at
        session.commit()
        session.refresh(db_lecture)
        return db_lecture


class BillIn(BaseModel):
    student_id: int
    lecture_id: int
    yearmonth: str
    amount: int
    memo: Optional[str] = None


@router.post("/bill")
def add_bill(bill_data: BillIn, academy_id: Depends(get_current_academy)):
    with Session(engine) as session:
        query_student = session.query(Student).get(bill_data.student_id, academy_id)
        query_lecture = session.query(Lecture).get(bill_data.lecture_id, academy_id)
        if query_student is None:
            raise HTTPException(status_code=404, detail="Student Not Found")
        if query_lecture is None:
            raise HTTPException(status_code=404, detail="Lecture Not Found")

        db_bill = Bill(
            student_id=bill_data.student_id,
            lecture_id=bill_data.lecture_id,
            academy_id=academy_id,
            yearmonth=bill_data.yearmonth,
            amount=bill_data.amount,
            memo=bill_data.memo,
        )
        session.add(db_bill)
        session.commit()
        session.refresh(db_bill)
        return db_bill.id


@router.get("/bill-list")
def get_bill(paid: Optional[bool], academy_id: Depends(get_current_academy)):
    with Session(engine) as session:
        if paid:
            return session.query(Bill).filter(academy_id, Bill.is_paid).all()
        elif not paid:
            return session.query(Bill).filter(academy_id, not Bill.is_paid).all()
        elif paid is None:
            return session.query(Bill).filter(academy_id).all()


