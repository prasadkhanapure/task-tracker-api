from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Project, Task
from app.schemas import DashboardResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats/", response_model=DashboardResponse)
def get_all_stats(db: Annotated[Session, Depends(get_db)]):

    statement1 = select(func.count(Project.project_id).label("total_projects"))

    statement2 = select(
        func.count(Task.task_id).label("total_tasks"),
        func.count(Task.task_id)
        .filter(Task.completed.is_(True))
        .label("completed_tasks"),
        func.count(Task.task_id)
        .filter(Task.completed.is_(False))
        .label("pending_tasks"),
    )

    count_projects = db.scalar(statement1)
    task_stats = db.execute(statement2).mappings().one()

    return {"total_projects": count_projects, **task_stats}
