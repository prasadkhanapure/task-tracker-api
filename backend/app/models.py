from sqlalchemy import Integer, String, Boolean
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class Task(Base):
    __tablename__ = "tasks"

    task_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    title: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )