from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import DBAPIError
from sqlmodel import SQLModel

import app.tools.env
from app.errors.dbapierror import database_exception_handler
from app.errors.exception import other_exception_handler
from app.routes import academy, building, room, auth
from app.tools.database import engine

app = FastAPI()

# cors
origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def root():
    return {"message": "Hello World"}


@app.on_event("startup")
def startup():
    SQLModel.metadata.create_all(engine)

    app.add_exception_handler(DBAPIError, database_exception_handler)
    app.add_exception_handler(Exception, other_exception_handler)

    app.include_router(academy.router)
    app.include_router(building.router)
    app.include_router(room.router)
    app.include_router(auth.router)
