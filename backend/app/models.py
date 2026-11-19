from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Task(Base):
    __tablename__ = "tasks"

    task_id: Mapped[int] = mapped_column(Integer, primary_key=True)

    title: Mapped[str] = mapped_column(String, nullable=False)

    completed: Mapped[bool] = mapped_column(Boolean, default=False)

    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.project_id"), nullable=False
    )

    priority: Mapped[str] = mapped_column(
        String, default="none", server_default=None, nullable=False
    )
    due_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )


class Project(Base):
    __tablename__ = "projects"

    project_id: Mapped[int] = mapped_column(Integer, primary_key=True)

    name: Mapped[str] = mapped_column(String, nullable=False)

    description: Mapped[str | None] = mapped_column(String, nullable=True)
