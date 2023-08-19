from api.routes._imports import *
from fastapi import APIRouter, Depends, HTTPException, status
from bcrypt import hashpw, gensalt
from api.tools.upload_image_to_s3 import upload_image_to_s3

router = APIRouter(
    prefix="/user",
    tags=["user"],
)


class UserIn(BaseModel):
    name: str
    email: str
    password: str
    phone: str
    role: str
    image_dataurl: Optional[str] = None


class UserUpdate(BaseModel):
    name: str
    phone: str
    image_dataurl: Optional[str] = None


class Password(BaseModel):
    password: str


@router.post("/")
def create_user(user: UserIn):
    with Session(engine) as session:
        if session.get(User, user.email):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")
        user.password = hashpw(user.password.encode(), gensalt()).decode()
        userdata = user.dict()
        # upload_image_to_s3
        if user.image_dataurl:
            userdata["image_url"] = upload_image_to_s3(user.image_dataurl, user.email)
        else:
            userdata["image_url"] = None
        session.add(User(**userdata))
        session.commit()
        return user


@router.get("/")
def get_user_info(current_user=Depends(get_current_user)):
    with Session(engine) as session:
        user = session.get(User, current_user["email"])
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user


@router.put("/")
def update_user_info(user: UserUpdate, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        current_user = session.get(User, current_user["email"])
        if not current_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        current_user.name = user.name
        current_user.phone = user.phone
        if user.image_dataurl:
            current_user.image_url = upload_image_to_s3(user.image_dataurl, current_user.email)
        session.commit()
        return current_user


@router.put("/password")
def update_user_password(password: Password, current_user=Depends(get_current_user)):
    with Session(engine) as session:
        current_user = session.get(User, current_user["email"])
        if not current_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        current_user.password = hashpw(password.password.encode(), gensalt()).decode()
        session.commit()
        return current_user


@router.delete("/")
def delete_user(current_user=Depends(get_current_user)):
    with Session(engine) as session:
        user = session.get(User, current_user["email"])
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        session.delete(user)
        session.commit()
        return {"message": "User deleted successfully"}
