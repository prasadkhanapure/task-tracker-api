import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

load_dotenv("../.env.local")
DATABASE_URL = os.environ["DATABASE_URL"]

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    bind=engine,
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



if __name__ == "__main__":
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Database connected:", result.scalar())