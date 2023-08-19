from api.routes._imports import *
from api.tools.database import engine, Session
from api.tools.upload_image_to_s3 import upload_image_to_s3

router = APIRouter(
    prefix="/student",
    tags=["student"],
)


class StudentCreate(BaseModel):
    academy_id: int
    name: str = Field(min_length=3)
    school: str = Field(min_length=3)
    grade: int = Field(ge=1, le=12)
    phone: Optional[str] = None
    parent_phone: str = Field(min_length=10)
    address: str = Field(min_length=3)
    memo: Optional[str] = None
    image_dataurl: Optional[str] = None


class StudentUpdate(BaseModel):
    name: Optional[str] = Field(min_length=3)
    school: Optional[str] = Field(min_length=3)
    grade: Optional[int] = Field(ge=1, le=12)
    phone: Optional[str] = Field(min_length=10)
    parent_phone: Optional[str] = Field(min_length=10)
    address: Optional[str] = Field(min_length=3)
    memo: Optional[str] = None
    image_dataurl: Optional[str] = None


@router.post("/")
def create_student(new_student: StudentCreate, current_user=Depends(get_current_user)):
    if current_user.role == "admin":
        with Session(engine) as session:
            student = Student(
                academy_id=new_student.academy_id,
                name=new_student.name,
                school=new_student.school,
                grade=new_student.grade,
                phone=new_student.phone,
                parent_phone=new_student.parent_phone,
                address=new_student.address,
                memo=new_student.memo,
                image_url=upload_image_to_s3(new_student.image_dataurl) if new_student.image_dataurl else None,
            )

            session.add(student)
            session.commit()
            session.refresh(student)
            return student
    elif current_user.role == "academy":

        # check if current user is the owner of the academy
        with Session(engine) as session:
            academy = session.get(Academy, current_user.academy_id)
            if not academy:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Academy not found",
                )
            if academy.owner_id != current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You don't have permission to access this academy.",
                )

        with Session(engine) as session:
            student = Student(
                academy_id=new_student.academy_id,
                name=new_student.name,
                school=new_student.school,
                grade=new_student.grade,
                phone=new_student.phone,
                parent_phone=new_student.parent_phone,
                address=new_student.address,
                memo=new_student.memo,
                image_url=upload_image_to_s3(new_student.image_dataurl) if new_student.image_dataurl else None,
            )

            session.add(student)
            session.commit()
            session.refresh(student)
            return student

    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access this academy.",
        )


@router.get("/")
def get_students(current_user=Depends(get_current_user)):
    if current_user.role == "admin":
        with Session(engine) as session:
            students = session.query(Student).all()
            return students
    elif current_user.role == "academy":
        with Session(engine) as session:
            # check if current user is the owner of the academy
            academy = session.query(Academy).filter(Academy.owner_id == current_user.id).first()
            if not academy:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You don't have permission to access this academy.",
                )
            students = session.query(Student).filter(Student.academy_id == academy.id).all()
            return students
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access this academy.",
        )


@router.get("/{student_id}")
def get_student(student_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        student = session.get(Student, student_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found",
            )
        if current_user.role == "admin":
            return student
        elif current_user.role == "academy":
            # check if current user is the owner of the academy
            academy = session.query(Academy).filter(Academy.owner_id == current_user.id).first()
            if not academy:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You don't have permission to access this academy.",
                )
            return student
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this academy.",
            )


@router.put("/{student_id}")
def update_student(student_id: int, student_update: StudentUpdate, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        student = session.get(Student, student_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found",
            )
        if current_user.role == "admin":
            if student_update.name:
                student.name = student_update.name
            if student_update.school:
                student.school = student_update.school
            if student_update.grade:
                student.grade = student_update.grade
            if student_update.phone:
                student.phone = student_update.phone
            if student_update.parent_phone:
                student.parent_phone = student_update.parent_phone
            if student_update.address:
                student.address = student_update.address
            if student_update.memo:
                student.memo = student_update.memo
            if student_update.image_dataurl:
                student.image_url = upload_image_to_s3(student_update.image_dataurl)
            session.add(student)
            session.commit()
            session.refresh(student)
            return student
        elif current_user.role == "academy":
            # check if current user is the owner of the academy
            academy = session.query(Academy).filter(Academy.owner_id == current_user.id).first()
            if not academy:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You don't have permission to access this academy.",
                )

            if student_update.name:
                student.name = student_update.name
            if student_update.school:
                student.school = student_update.school
            if student_update.grade:
                student.grade = student_update.grade
            if student_update.phone:
                student.phone = student_update.phone
            if student_update.parent_phone:
                student.parent_phone = student_update.parent_phone
            if student_update.address:
                student.address = student_update.address
            if student_update.memo:
                student.memo = student_update.memo
            if student_update.image_dataurl:
                student.image_url = upload_image_to_s3(student_update.image_dataurl)
            session.add(student)
            session.commit()
            session.refresh(student)
            return student
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this academy.",
            )


@router.delete("/{student_id}")
def delete_student(student_id: int, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        student = session.get(Student, student_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found",
            )
        if current_user.role == "admin":
            session.delete(student)
            session.commit()
            return {"message": "Student deleted"}
        elif current_user.role == "academy":
            # check if current user is the owner of the academy
            academy = session.query(Academy).filter(Academy.owner_id == current_user.id).first()
            if not academy:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You don't have permission to access this academy.",
                )

            session.delete(student)
            session.commit()
            return {"message": "Student deleted"}
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this academy.",
            )
