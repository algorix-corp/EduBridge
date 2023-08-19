from datetime import datetime, date
from typing import Optional

from pydantic import BaseModel, Field, EmailStr

from api.schemas.academy import Academy
from api.schemas.building import Building
from api.schemas.join_lecture import JoinLecture
from api.schemas.lecture import Lecture
from api.schemas.reservation import Reservation
from api.schemas.room import Room
from api.schemas.student import Student
from api.schemas.tuition_bill import TuitionBill
from api.schemas.user import User
from api.tools.database import engine, Session
from api.tools.get_current_user import get_current_user

Academy(), Building(), JoinLecture(), Lecture(), Reservation(), Room(), Student(), TuitionBill(), User()
BaseModel(), Field(), EmailStr(), Optional, engine, Session, get_current_user, datetime, date
