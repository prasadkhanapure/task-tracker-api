from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Project, Task
from app.schemas import (
    ProjectCreate,
    ProjectResponse,
    ProjectStatsResponse,
    ProjectUpdate,
)

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("/", response_model=list[ProjectResponse])
def get_projects(db: Annotated[Session, Depends(get_db)]):
    statement = select(Project).order_by(Project.project_id)
    projects = db.scalars(statement).all()
    return projects


@router.post("/", status_code=201, response_model=ProjectResponse)
def create_project(
    projectpayload: ProjectCreate, db: Annotated[Session, Depends(get_db)]
):
    new_project = Project(
        name=projectpayload.name, description=projectpayload.description
    )

    try:
        db.add(new_project)
        db.commit()
        db.refresh(new_project)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Unable to create project")

    return new_project


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int, payload: ProjectUpdate, db: Annotated[Session, Depends(get_db)]
):
    try:
        project = db.get(Project, project_id)
        if project is None:
            raise HTTPException(status_code=404, detail="Project not found!")

        project.name = payload.name
        project.description = payload.description

        db.commit()
        db.refresh(project)

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Unable to update Project")

    return project


@router.delete("/{project_id}")
def delete_project(project_id: int, db: Annotated[Session, Depends(get_db)]):

    try:
        project = db.get(Project, project_id)
        if project is None:
            raise HTTPException(status_code=404, detail="Project is not found!")

        db.delete(project)
        db.commit()

    except IntegrityError as error:
        db.rollback()

        if getattr(error.orig, "sqlstate", None) == "23503":
            raise HTTPException(
                status_code=409,
                detail="Cannot delete project because it contains tasks",
            )

        raise HTTPException(status_code=500, detail="Unable to delete project")

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Unable to delete Project")

    return {"message": f"Project {project_id} deleted successfully"}


@router.get("/stats/", response_model=list[ProjectStatsResponse])
def get_projects_stats(db: Annotated[Session, Depends(get_db)]):
    statement = (
        select(
            Project.project_id,
            Project.name,
            func.count(Task.task_id).label("total_tasks"),
            func.count(Task.task_id)
            .filter(Task.completed.is_(True))
            .label("completed_tasks"),
            func.count(Task.task_id)
            .filter(Task.completed.is_(False))
            .label("pending_tasks"),
        )
        .select_from(Project)
        .outerjoin(Task, Project.project_id == Task.project_id)
        .group_by(Project.project_id)
        .order_by(Project.project_id)
    )
    stats = db.execute(statement).mappings().all()
    return stats


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project_id(project_id: int, db: Annotated[Session, Depends(get_db)]):

    statement = select(Project).where(Project.project_id == project_id)
    project = db.scalars(statement).first()

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found!")

    return project
