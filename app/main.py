from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
    raise Exception("🔥 THIS APP IS DEPRECATED -- USE API INSTEAD")

    # SQLModel.metadata.create_all(engine)
    #
    # app.add_exception_handler(DBAPIError, database_exception_handler)
    # app.add_exception_handler(Exception, other_exception_handler)
    #
    # app.include_router(academy.router)
    # app.include_router(building.router)
    # app.include_router(room.router)
    # app.include_router(auth.router)
