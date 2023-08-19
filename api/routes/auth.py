from api.routes._imports import *
from fastapi import APIRouter, Depends, HTTPException, status
from bcrypt import hashpw, gensalt, checkpw
from api.tools.issue_auth_token import issue_auth_token

router = APIRouter(
    prefix="",
    tags=["auth"],
)


class UserIn(BaseModel):
    email: str
    password: str


@router.post("/login")
# def login(user: UserIn):
#     with Session(engine) as session:
#         # user = session.get(User, user.email)
#         user = session.query(User).filter(User.email == user.email).first()
#         if not user:
#             raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
#         if not checkpw(user.password.encode(), user.password.encode()):
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong password")
#         return issue_auth_token(user.id)
def login(user: UserIn):
    with Session(engine) as session:
        res = session.query(User).filter(User.email == user.email).first()
        if not res:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        if not checkpw(user.password.encode(), res.password.encode()):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong password")
        return {"Bearer": issue_auth_token(res.id)}


@router.post("/auth")
def auth(current_user=Depends(get_current_user)):
    return current_user
