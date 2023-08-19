from bcrypt import checkpw

from api.routes._imports import *
from api.tools.issue_auth_token import issue_auth_token

router = APIRouter(
    prefix="",
    tags=["auth"],
)


class UserLogin(BaseModel):
    email: str
    password: str


@router.post("/login")
def login(user: UserLogin):
    with Session(engine) as session:
        auth_user = session.query(User).filter(User.email == user.email).first()
        if not auth_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incorrect email or password")

        if not checkpw(user.password.encode(), auth_user.password.encode()):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

        return {"message": "User successfully logged in",
                "user": auth_user,
                "token": issue_auth_token(auth_user.id)}


@router.post("/auth")
def auth(current_user=Depends(get_current_user)):
    return current_user
