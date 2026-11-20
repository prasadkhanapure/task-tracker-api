from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, case, func, select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Task
from app.schemas import (
    TaskCreate,
    TaskListResponse,
    TaskPatch,
    TaskPriority,
    TaskResponse,
    TaskUpdate,
)

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("/", response_model=TaskListResponse)
def fetch_data(
    db: Annotated[Session, Depends(get_db)],
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    completed: bool | None = None,
    priority: TaskPriority | None = None,
    overdue: bool = False,
):

    ist = timezone(timedelta(hours=5, minutes=30))
    today_start = datetime.now(ist).replace(hour=0, minute=0, second=0, microsecond=0)

    tomorrow_start = today_start + timedelta(days=1)

    todays_first = case(
        (
            and_(
                Task.due_at >= today_start,
                Task.due_at < tomorrow_start,
            ),
            0,
        ),
        else_=1,
    )

    priority_task = case(
        (Task.priority == "high", 1),
        (Task.priority == "medium", 2),
        (Task.priority == "low", 3),
        else_=4,
    )
    statement = select(Task).order_by(
        todays_first.asc(),
        priority_task.asc(),
        Task.due_at.asc().nulls_last(),
        Task.task_id.asc(),
    )
    count_statement = select(func.count()).select_from(Task)

    overdue_condition = and_(Task.due_at < func.now(), Task.completed.is_(False))

    if completed is not None:
        statement = statement.where(Task.completed == completed)
        count_statement = count_statement.where(Task.completed == completed)

    if priority is not None:
        statement = statement.where(Task.priority == priority)
        count_statement = count_statement.where(Task.priority == priority)

    if overdue is True:
        statement = statement.where(overdue_condition)
        count_statement = count_statement.where(overdue_condition)

    statement = statement.offset(offset).limit(limit)
    tasks = db.scalars(statement).all()
    total = db.scalar(count_statement)

    return {"items": tasks, "total": total, "limit": limit, "offset": offset}


@router.get("/{task_id}", response_model=TaskResponse)
def get_task_id(task_id: int, db: Annotated[Session, Depends(get_db)]):

    statement = select(Task).where(Task.task_id == task_id)
    task = db.scalars(statement).first()

    # task = db.get(Task, task_id)
    # This retrieves an object by its primary key and can use the session's identity map
    # when the object is already loaded.

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found!")

    return task


@router.post("/", status_code=201, response_model=TaskResponse)
def create_task(taskPayload: TaskCreate, db: Annotated[Session, Depends(get_db)]):

    new_task = Task(
        title=taskPayload.title,
        completed=False,
        project_id=taskPayload.project_id,
        priority=taskPayload.priority,
        due_at=taskPayload.due_at,
    )

    try:
        db.add(new_task)
        db.commit()
        db.refresh(new_task)

    except IntegrityError as error:
        db.rollback()

        if getattr(error.orig, "sqlstate", None) == "23503":
            raise HTTPException(status_code=422, detail="Project does not exist")

        raise HTTPException(status_code=500, detail="Unable to create Task")

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Unable to Create Task")

    return new_task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int, payload: TaskUpdate, db: Annotated[Session, Depends(get_db)]
):
    try:
        task = db.get(Task, task_id)
        if task is None:
            raise HTTPException(status_code=404, detail="Task not found!")

        task.title = payload.title
        task.completed = payload.completed
        task.project_id = payload.project_id
        task.priority = payload.priority
        task.due_at = payload.due_at

        db.commit()
        db.refresh(task)

    except IntegrityError as error:
        db.rollback()

        if getattr(error.orig, "sqlstate", None) == "23503":
            raise HTTPException(status_code=422, detail="Project does not exist")

        raise HTTPException(status_code=500, detail="Unable to update Task")

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Unable to update Task")

    return task


@router.patch("/{task_id}", response_model=TaskResponse)
def update_task_using_patch(
    task_id: int, payload: TaskPatch, db: Annotated[Session, Depends(get_db)]
):

    try:
        task = db.get(Task, task_id)
        if task is None:
            raise HTTPException(status_code=404, detail="Task not found!")

        update = payload.model_dump(exclude_unset=True)

        for key, value in update.items():
            setattr(task, key, value)

        db.commit()
        db.refresh(task)

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Unable to update Task")
    return task


@router.delete("/{task_id}")
def delete_task(task_id: int, db: Annotated[Session, Depends(get_db)]):

    try:
        task = db.get(Task, task_id)
        if task is None:
            raise HTTPException(status_code=404, detail="Task not found!")

        db.delete(task)
        db.commit()

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Unable to delete Task")

    return {"message": f"Task {task_id} deleted successfully"}
