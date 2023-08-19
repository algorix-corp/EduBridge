from fastapi import APIRouter, Depends, HTTPException, status

from api.routes._imports import *

router = APIRouter(
    prefix="",
    tags=["lecture"],
)


@router.get("/academy/{academy_id}/lecture/{lecture_id}/student")
def get_students(academy_id: int, lecture_id: int, current_user: dict = Depends(get_current_user)):
    if current_user.role != "academy" or current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    with Session(engine) as session:
        students = session.query(Student).join(JoinLecture).filter(JoinLecture.lecture_id == lecture_id).all()
        return students


@router.post("/academy/{academy_id}/lecture/{lecture_id}/student")
def add_student(academy_id: int, lecture_id: int, student_id: int, current_user: dict = Depends(get_current_user)):
    if current_user.role != "academy" or current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    with Session(engine) as session:
        student = session.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
        join_lecture = JoinLecture(student_id=student_id, lecture_id=lecture_id)
        session.add(join_lecture)
        session.commit()
        session.refresh(join_lecture)
        return join_lecture


@router.delete("/academy/{academy_id}/lecture/{lecture_id}/student/{student_id}")
def delete_student(academy_id: int, lecture_id: int, student_id: int, current_user: dict = Depends(get_current_user)):
    if current_user.role != "academy" or current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    with Session(engine) as session:
        join_lecture = session.query(JoinLecture).filter(JoinLecture.student_id == student_id,
                                                         JoinLecture.lecture_id == lecture_id).first()
        if not join_lecture:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
        session.delete(join_lecture)
        session.commit()
        return {"message": "Student deleted successfully"}
