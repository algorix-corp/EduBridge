from api.routes._imports import *
from api.tools.send_sms import send_sms

router = APIRouter(
    prefix="/func",
    tags=["function"],
)


class SmsCreate(BaseModel):
    phone_number: str
    message: str


@router.post("/send_sms")
def send_sms_func(sms: SmsCreate, current_user=Depends(get_current_user)):
    res = send_sms(sms.phone_number, sms.message)
    return {"message": res}
