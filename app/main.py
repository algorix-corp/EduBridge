from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine, Session, Field
from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import boto3
import base64
import uuid

load_dotenv()

# ========== S3 ==========

# S3_NAME=ja23-edubridge
# S3_REGION=ap-northeast-2
# S3_ACCESS_KEY_ID=AKIA2BDA6KYHERN6CIMB
# S3_SECRET_ACCESS_KEY=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

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
    subject: list[str]  # math, english, science, algorithm, discrete math, linear algebra, physics
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


@app.get("/")
def root():
    return {"message": "Hello World"}


class BuildingIn(BaseModel):
    name: str
    address: str
    image_dataurl: Optional[str] = None


@app.post("/building")
def create_building(building: BuildingIn):
    # if there is image, save it to s3 and get url
    if building.image_dataurl:
        building.image_url = upload_image_to_s3(building.image_dataurl)
    with Session(engine) as session:
        db_building = Building.from_orm(building)
        session.add(db_building)
        session.commit()
        session.refresh(db_building)
        return db_building


@app.get("/academy")
def get_academies():
    with Session(engine) as session:
        return session.query(Academy).all()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
