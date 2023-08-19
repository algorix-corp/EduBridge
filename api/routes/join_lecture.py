from api.routes._imports import *

router = APIRouter(
    prefix="/lecture/{lecture_id}/student",
    tags=["lecture"],
)


class JoinLectureCreate(BaseModel):
    student_id: int


@router.post("/")
def join_lecture(lecture_id: int, join_lecture: JoinLectureCreate, current_user=Depends(get_current_user)):
    if current_user.role != "admin" and current_user.role != "student":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    with Session(engine) as session:
        lecture = session.query(Lecture).filter(Lecture.id == lecture_id).first()
        if not lecture:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lecture not found")

        if current_user.role == "admin":
            student = session.query(Student).filter(Student.id == join_lecture.student_id).first()
            if not student:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
            if student.role != "student":
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not student")
        else:
            student = current_user

        if lecture.academy_id != student.academy_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="User is not in the same academy as lecture")

        if lecture in student.lectures:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is already in lecture")

        student.lectures.append(lecture)
        session.commit()
        session.refresh(student)
        return student


@router.get("/")
def get_students(lecture_id: int, current_user=Depends(get_current_user)):
    if current_user.role != "admin" and current_user.role != "student":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    with Session(engine) as session:
        lecture = session.query(Lecture).filter(Lecture.id == lecture_id).first()
        if not lecture:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lecture not found")

        if current_user.role == "admin":
            students = session.query(User).filter(User.role == "student").all()
            return students
        else:
            students = session.query(User).filter(User.role == "student").all()
            return students


@router.get("/{student_id}")
def get_student(lecture_id: int, student_id: int, current_user=Depends(get_current_user)):
    if current_user.role != "admin" and current_user.role != "student":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    with Session(engine) as session:
        lecture = session.query(Lecture).filter(Lecture.id == lecture_id).first()
        if not lecture:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lecture not found")

        if current_user.role == "admin":
            student = session.query(User).filter(User.id == student_id).first()
            if not student:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
            if student.role != "student":
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not student")
        else:
            student = current_user

        if lecture.academy_id != student.academy_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="User is not in the same academy as lecture")

        if lecture not in student.lectures:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not in lecture")

        return student


@router.delete("/{student_id}")
def delete_student(lecture_id: int, student_id: int, current_user=Depends(get_current_user)):
    if current_user.role != "admin" and current_user.role != "student":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    with Session(engine) as session:
        lecture = session.query(Lecture).filter(Lecture.id == lecture_id).first()
        if not lecture:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lecture not found")

        if current_user.role == "admin":
            student = session.query(User).filter(User.id == student_id).first()
            if not student:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
            if student.role != "student":
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not student")
        else:
            student = current_user

        if lecture.academy_id != student.academy_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="User is not in the same academy as lecture")

        if lecture not in student.lectures:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not in lecture")

        student.lectures.remove(lecture)
        session.commit()
        session.refresh(student)
        return student
