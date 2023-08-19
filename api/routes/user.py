from bcrypt import hashpw, gensalt

from api.routes._imports import *
from api.tools.upload_image_to_s3 import upload_image_to_s3

router = APIRouter(
    prefix="/user",
    tags=["user"],
)


class UserCreate(BaseModel):
    name: str = Field(min_length=3)
    email: str = Field(min_length=3)
    password: str = Field(min_length=4)
    phone: str = Field(min_length=10)
    role: str = ["admin", "building", "academy"]
    image_dataurl: Optional[str] = None


class UserUpdate(BaseModel):
    name: str = Field(min_length=3)
    phone: str = Field(min_length=10)
    image_dataurl: Optional[str] = None


class PasswordUpdate(BaseModel):
    password: str = Field(min_length=4)


@router.post("/")
def create_user(new_user: UserCreate):
    with Session(engine) as session:
        user = session.query(User).filter(User.email == new_user.email).first()
        if user:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")

        user = User(
            name=new_user.name,
            email=new_user.email,
            password=hashpw(new_user.password.encode(), gensalt()).decode(),
            phone=new_user.phone,
            role=new_user.role,
            image_url=upload_image_to_s3(new_user.image_dataurl, new_user.email) if new_user.image_dataurl else None
        )

        session.add(user)
        session.commit()
        return {"message": "User successfully created",
                "user": user}


@router.get("/")
def get_user_info(current_user=Depends(get_current_user)):
    with Session(engine) as session:
        user = session.get(User, current_user.id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user


@router.put("/")
def update_user_info(user: UserUpdate, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        current_user = session.get(User, current_user.id)
        if not current_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        current_user.name = user.name
        current_user.phone = user.phone
        current_user.image_url = upload_image_to_s3(user.image_dataurl,
                                                    current_user.email) if user.image_dataurl else None
        session.commit()
        return {"message": "User successfully updated",
                "user": current_user}


@router.put("/password")
def update_user_password(password: PasswordUpdate, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        current_user = session.get(User, current_user.id)
        if not current_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        current_user.password = hashpw(password.password.encode(), gensalt()).decode()
        session.commit()
        return {"message": "Password successfully updated",
                "user": current_user}


@router.delete("/")
def delete_user(current_user=Depends(get_current_user)):
    with Session(engine) as session:
        current_user = session.get(User, current_user.id)
        if not current_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        session.delete(current_user)
        session.commit()
        return {"message": "User successfully deleted",
                "user": current_user}
