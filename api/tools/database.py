import os

from sqlmodel import create_engine, Session

db_host = os.getenv("POSTGRES_HOST")
db_name = os.getenv("POSTGRES_DB")
db_user = os.getenv("POSTGRES_USER")
db_pass = os.getenv("POSTGRES_PASSWORD")

database_url = f"postgresql://{db_user}:{db_pass}@{db_host}/{db_name}"
engine = create_engine(database_url)
Session()
