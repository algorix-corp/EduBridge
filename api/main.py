from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

import api.routes.academy
import api.routes.auth
import api.routes.building
import api.routes.join_lecture
import api.routes.lecture
import api.routes.reservation
import api.routes.room
import api.routes.student
import api.routes.tuition_bill
import api.routes.user
import api.tools.database
import api.tools.env

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])

app.include_router(api.routes.student.router)
app.include_router(api.routes.academy.router)
app.include_router(api.routes.building.router)
app.include_router(api.routes.room.router)
app.include_router(api.routes.lecture.router)
app.include_router(api.routes.reservation.router)
app.include_router(api.routes.tuition_bill.router)
app.include_router(api.routes.user.router)
app.include_router(api.routes.join_lecture.router)
app.include_router(api.routes.auth.router)


@app.on_event("startup")
def startup_event():
    SQLModel.metadata.create_all(api.tools.database.engine)


@app.get("/")
def read_root():
    return {"Hello": "World"}
