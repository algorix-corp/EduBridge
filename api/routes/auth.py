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
        user = session.query(User).filter(User.email == user.email).first()
        if user:
            if checkpw(user.password.encode(), user.password_hash.encode()):
                return {"Bearer": issue_auth_token(user.id)}
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password",
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )


@router.post("/auth")
def auth(current_user=Depends(get_current_user)):
    return current_user
