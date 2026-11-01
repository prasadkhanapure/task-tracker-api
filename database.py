import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv(".env.local")
DATABASE_URL = os.environ["DATABASE_URL"]

engine = create_engine(DATABASE_URL)

if __name__ == "__main__":
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Database connected:", result.scalar())