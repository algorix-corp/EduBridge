from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine, Session, Field
from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()


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


@app.get("/academy")
def get_academies():
    with Session(engine) as session:
        return session.query(Academy).all()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
