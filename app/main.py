from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.security import HTTPBearer
from sqlmodel import SQLModel, create_engine, Session, Field
from typing import Optional
from datetime import date, datetime, timedelta
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import boto3
import base64
import uuid
from jose import jwt
import bcrypt

load_dotenv()

# ========== S3 ==========

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("S3_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("S3_SECRET_ACCESS_KEY"),
    region_name=os.getenv("S3_REGION"),
)


def upload_image_to_s3(image_dataurl: str, filename: str = str(uuid.uuid4()) + ".png"):
    image_dataurl = image_dataurl.split(",")[1]
    image_data = base64.b64decode(image_dataurl)
    s3.put_object(
        Bucket=os.getenv("S3_NAME"),
        Key=filename,
        Body=image_data,
        ContentType="image/png",
    )
    return f"https://{os.getenv('S3_NAME')}.s3.{os.getenv('S3_REGION')}.amazonaws.com/{filename}"


# ========== Models ==========
class Building(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    address: str
    image_url: Optional[str] = None


class Academy(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    owner_name: str
    phone: str
    username: str
    password: str
    subject: list[str]
    description: Optional[str] = None
    image_url: Optional[str] = None


class Lecture(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    academy_id: int = Field(foreign_key="academy.id")
    name: str
    description: Optional[str] = None
    start_at: date
    end_at: date


class Student(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    academy_id: int = Field(foreign_key="academy.id")
    name: str
    phone: str
    address: str
    memo: Optional[str] = None
    image_url: Optional[str] = None


class Bill(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int = Field(foreign_key="student.id")
    lecture_id: int = Field(foreign_key="lecture.id")
    yearmonth: str  # YYYYMM
    amount: int
    is_paid: bool = False
    memo: Optional[str] = None


class Room(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    building_id: int = Field(foreign_key="building.id")
    floor: int
    room_number: str  # 호실
    description: Optional[str] = None
    daily_price: int


class Reservation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    academy_id: int = Field(foreign_key="academy.id")
    room_id: int = Field(foreign_key="room.id")
    start_date: date
    end_date: date


# ========== Init ==========

db_host = os.getenv("POSTGRES_HOST")
db_name = os.getenv("POSTGRES_DB")
db_user = os.getenv("POSTGRES_USER")
db_pass = os.getenv("POSTGRES_PASSWORD")

database_url = f"postgresql://{db_user}:{db_pass}@{db_host}/{db_name}"
engine = create_engine(database_url)
SQLModel.metadata.create_all(engine)

app = FastAPI()


def issue_token(academy_id: int):
    with Session(engine) as session:
        academy = session.get(Academy, academy_id)
        if not academy:
            return None
        payload = {
            "academy_id": academy.id,
            "academy_name": academy.name,
            "username": academy.username,
            "image_url": academy.image_url,
            "exp": datetime.utcnow() + timedelta(days=1),
        }
        return jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm="HS256")


# jwt token dependency, Bearer
def get_current_academy(token: str = Depends(HTTPBearer())):
    try:
        payload = jwt.decode(token.credentials, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.get("/")
def root():
    return {"message": "Hello World"}


class BuildingIn(BaseModel):
    name: str
    address: str
    image_dataurl: Optional[str] = None


@app.post("/building", tags=["Building"])
def create_building(building: BuildingIn):
    image_url = None
    if building.image_dataurl:
        image_url = upload_image_to_s3(building.image_dataurl)
    with Session(engine) as session:
        db_building = Building(name=building.name, address=building.address, image_url=image_url)
        session.add(db_building)
        session.commit()
        session.refresh(db_building)
        return db_building


@app.get("/building", tags=["Building"])
def get_buildings():
    with Session(engine) as session:
        return session.query(Building).all()


class AcademyIn(BaseModel):
    name: str
    owner_name: str
    phone: str
    username: str
    password: str  # hash it
    subject: list[str]
    description: Optional[str] = None
    image_dataurl: Optional[str] = None


@app.post("/academy", tags=["Academy"])
def create_academy(academy: AcademyIn):
    image_url = None
    if academy.image_dataurl:
        image_url = upload_image_to_s3(academy.image_dataurl)
    with Session(engine) as session:
        db_academy = Academy(
            name=academy.name,
            owner_name=academy.owner_name,
            phone=academy.phone,
            username=academy.username,
            password=bcrypt.hashpw(academy.password.encode(), bcrypt.gensalt()).decode(),
            subject=academy.subject,
            description=academy.description,
            image_url=image_url,
        )
        session.add(db_academy)
        session.commit()
        session.refresh(db_academy)
        return


class AcademyLogin(BaseModel):
    username: str
    password: str


@app.post("/login", tags=["Academy"])
def login(login: AcademyLogin):
    with Session(engine) as session:
        db_academy = session.query(Academy).filter(Academy.username == login.username).first()
        if not db_academy:
            raise HTTPException(status_code=404, detail="Academy not found")
        if not bcrypt.checkpw(login.password.encode(), db_academy.password.encode()):
            raise HTTPException(status_code=401, detail="Password is incorrect")
        # return db_academy
        return {"access_token": issue_token(db_academy.id)}


@app.post("/auth")
def auth(current_academy: dict = Depends(get_current_academy)):
    return current_academy


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
