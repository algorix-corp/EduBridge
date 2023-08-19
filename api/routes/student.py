from fastapi import APIRouter, Depends, HTTPException, status

from api.routes._imports import *

router = APIRouter(
    prefix="",
    tags=["student"],
)


class StudentIn(BaseModel):
    academy_id: int
    name: str
    school: str
    grade: int
    phone: Optional[str] = None
    parent_phone: str
    address: str
    memo: Optional[str] = None
    image_url: Optional[str] = None


class StudentUpdate(BaseModel):
    name: Optional[str]
    school: Optional[str]
    grade: Optional[int]
    phone: Optional[str] = None
    parent_phone: Optional[str]
    address: Optional[str]
    memo: Optional[str] = None
    image_url: Optional[str] = None


@router.post("/academy/{academy_id}/student")
def create_student(academy_id: int, student: StudentIn, current_user: dict = Depends(get_current_user)):
    if current_user.role != "academy" or current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    with Session(engine) as session:
        academy = session.query(Academy).filter(Academy.id == academy_id).first()
        if not academy:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Academy not found")
        if academy.owner_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        student = Student(**student.dict())
        session.add(student)
        session.commit()
        session.refresh(student)
        return student


@router.get("/academy/{academy_id}/student")
def get_students(academy_id: int, current_user: dict = Depends(get_current_user)):
    if current_user.role != "academy" or current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    with Session(engine) as session:
        # check if academy belongs to current user
        academy = session.query(Academy).filter(Academy.id == academy_id).first()
        if not academy:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Academy not found")
        if academy.owner_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
        students = session.query(Student).filter(Student.academy_id == academy_id).all()
        return students


@router.get("/academy/{academy_id}/student/{student_id}")
def get_student(academy_id: int, student_id: int, current_user: dict = Depends(get_current_user)):
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
        return student


@router.put("/academy/{academy_id}/student/{student_id}")
def update_student(academy_id: int, student_id: int, student: StudentUpdate,
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
        for var, value in student.dict().items():
            if var == "id":
                continue
            if getattr(student, var) != getattr(student, var):
                setattr(student, var, value)
        session.commit()
        session.refresh(student)
        return student


@router.delete("/academy/{academy_id}/student/{student_id}")
def delete_student(academy_id: int, student_id: int, current_user: dict = Depends(get_current_user)):
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
        session.delete(student)
        session.commit()
        return {"message": "Student deleted successfully"}


